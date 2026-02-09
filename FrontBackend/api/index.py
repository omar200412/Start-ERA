import os
import sqlite3
import hashlib
import smtplib
import random
import platform
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2
from psycopg2.extras import RealDictCursor
import google.generativeai as genai

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
from reportlab.lib.colors import HexColor

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")
MAIL_SERVER = os.getenv("MAIL_SERVER", "mail.plan-iq.net")
MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
MAIL_USERNAME = os.getenv("MAIL_USERNAME", "dev@plan-iq.net")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MODEL_NAME = "gemini-2.5-flash"

try:
    if API_KEY:
        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel(MODEL_NAME)
    else:
        model = None
except Exception as e:
    model = None

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- DB --------------------
def get_db():
    if DATABASE_URL:
        try:
            return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        except:
            pass
    
    if platform.system() == "Windows":
        db_path = "chatbot.db"
    else:
        db_path = "/tmp/chatbot.db"
        
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def ph():
    return "%s" if DATABASE_URL else "?"

def init_db():
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                verification_code TEXT,
                is_verified INTEGER DEFAULT 0
            );
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS chat_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                role TEXT,
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"DB Init Error: {e}")

init_db()

# -------------------- MODELS --------------------
class UserAuth(BaseModel):
    email: str
    password: str

class VerifyRequest(BaseModel):
    email: str
    code: str

class ChatRequest(BaseModel):
    message: str
    system_prompt: str | None = None

class BusinessPlanRequest(BaseModel):
    idea: str
    capital: str
    skills: str
    strategy: str
    management: str
    language: str = "tr"

class PDFRequest(BaseModel):
    text: str

# -------------------- EMAIL --------------------
def send_verification_email(to_email, code):
    if not MAIL_USERNAME or not MAIL_PASSWORD: return False
    msg = MIMEMultipart()
    msg['From'] = MAIL_USERNAME
    msg['To'] = to_email
    msg['Subject'] = "Start ERA - Aktivasyon Kodu"
    msg.attach(MIMEText(f"Kodunuz: {code}", 'plain'))
    try:
        server = smtplib.SMTP(MAIL_SERVER, MAIL_PORT)
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(MAIL_USERNAME, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Mail Error: {e}")
        return False

# -------------------- ROUTES --------------------

@app.get("/api/health")
def health():
    return {"status": "ok", "backend": "Vercel Python Runtime"}

@app.post("/api/register")
def register(user: UserAuth):
    conn = get_db()
    cur = conn.cursor()
    hashed = hashlib.sha256(user.password.encode()).hexdigest()
    code = str(random.randint(100000, 999999))
    print(f"DEBUG CODE: {code}")

    try:
        cur.execute(f"SELECT id FROM users WHERE email={ph()}", (user.email,))
        if cur.fetchone(): raise HTTPException(400, "Email already exists")

        # Geliştirme için is_verified=1 yapıyoruz
        cur.execute(f"INSERT INTO users (email, password, verification_code, is_verified) VALUES ({ph()}, {ph()}, {ph()}, {ph()})", (user.email, hashed, code, 1))
        conn.commit()
        try: send_verification_email(user.email, code)
        except: pass
        return {"message": "verification_needed", "email": user.email, "debug_code": code}
    except HTTPException as he: raise he
    except Exception: raise HTTPException(500, "Internal Server Error")
    finally: conn.close()

@app.post("/api/verify")
def verify(req: VerifyRequest):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute(f"SELECT verification_code FROM users WHERE email={ph()}", (req.email,))
        row = cur.fetchone()
        if not row: raise HTTPException(404, "User not found")
        stored_code = row[0] if DATABASE_URL else row["verification_code"]
        if str(stored_code).strip() == str(req.code).strip():
            cur.execute(f"UPDATE users SET is_verified={ph()} WHERE email={ph()}", (1, req.email))
            conn.commit()
            return {"message": "success", "token": f"user-{req.email}", "email": req.email}
        else: raise HTTPException(400, "Invalid code")
    finally: conn.close()

@app.post("/api/login")
def login(user: UserAuth):
    conn = get_db()
    cur = conn.cursor()
    hashed = hashlib.sha256(user.password.encode()).hexdigest()
    try:
        cur.execute(f"SELECT email, is_verified FROM users WHERE email={ph()} AND password={ph()}", (user.email, hashed))
        row = cur.fetchone()
        if not row: raise HTTPException(401, "Invalid credentials")
        # is_verified kontrolü
        return {"token": f"user-{user.email}", "email": user.email}
    finally: conn.close()

@app.post("/api/chat")
def chat(req: ChatRequest):
    if not model: return {"reply": "API Key Missing"}
    try:
        prompt = (req.system_prompt or "") + "\n\nUser: " + req.message
        response = model.generate_content(prompt)
        return {"reply": response.text}
    except: return {"reply": "AI Error"}

@app.post("/api/generate_plan")
def generate_plan(req: BusinessPlanRequest):
    if not model: raise HTTPException(503, "API Key Missing")
    
    # --- GELİŞMİŞ PROMPT ---
    prompt = f"""
    Sen uzman bir iş geliştirme danışmanısın. Aşağıdaki girişim fikri için profesyonel, yatırımcı sunumuna uygun ve kapsamlı bir iş planı hazırla.

    GİRİŞİM DETAYLARI:
    - Fikir: {req.idea}
    - Sermaye Durumu: {req.capital}
    - Ekip Yetenekleri: {req.skills}
    - Strateji: {req.strategy}
    - Yönetim: {req.management}
    - Dil: {req.language} (Cevabı BU dilde ver)

    ÇIKTI FORMATI:
    Lütfen aşağıdaki başlıkları kullanarak detaylı paragraflar yaz. Markdown (**, ##) kullanma, sadece düz metin ve BÜYÜK HARFLİ BAŞLIKLAR kullan.

    1. YÖNETİCİ ÖZETİ
    (Girişimin kısa ve vurucu bir özeti)

    2. İŞ MODELİ VE ÜRÜN
    (Ne satıyoruz, değer önerimiz ne?)

    3. PAZAR ANALİZİ VE HEDEF KİTLE
    (Kimlere hitap ediyoruz, pazarın durumu ne?)

    4. PAZARLAMA VE SATIŞ STRATEJİSİ
    (Müşteriye nasıl ulaşacağız?)

    5. FİNANSAL PLAN VE YATIRIM
    (Sermaye nasıl kullanılacak, gelir modeli ne?)

    6. YOL HARİTASI
    (Gelecek 1 yıl için adımlar)

    Lütfen profesyonel, motive edici ve gerçekçi bir ton kullan.
    """
    
    try:
        # Generate content
        response = model.generate_content(prompt)
        text = response.text.replace("*", "").replace("#", "")
        return JSONResponse(content={"plan": text})
    except Exception as e:
        print(f"Plan Error: {e}")
        raise HTTPException(500, str(e))

@app.post("/api/create_pdf")
def create_pdf(req: PDFRequest):
    if platform.system() == "Windows":
        pdf_file = "StartERA_Plan.pdf"
    else:
        pdf_file = "/tmp/StartERA_Plan.pdf"

    try:
        doc = SimpleDocTemplate(pdf_file, pagesize=A4, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72)
        styles = getSampleStyleSheet()
        brand_color = HexColor("#1e40af") 
        
        title_style = ParagraphStyle('CustomTitle', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=24, spaceAfter=30, textColor=brand_color, alignment=TA_CENTER)
        heading_style = ParagraphStyle('CustomHeading', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=14, spaceBefore=20, textColor=brand_color)
        body_style = ParagraphStyle('CustomBody', parent=styles['Normal'], fontName='Helvetica', fontSize=11, leading=15, alignment=TA_JUSTIFY, spaceAfter=10)

        story = []
        story.append(Paragraph("Start ERA", title_style))
        story.append(Paragraph("Professional Business Plan", styles["Heading3"]))
        story.append(Spacer(1, 30))
        
        for line in req.text.split("\n"):
            line = line.strip()
            if not line: continue
            if (len(line) < 60 and line.isupper()) or (len(line) < 50 and line.endswith(":")):
                story.append(Paragraph(line, heading_style))
            else:
                story.append(Paragraph(line, body_style))
        
        story.append(Spacer(1, 40))
        story.append(Paragraph("© 2026 Start ERA", styles["Italic"]))
        
        doc.build(story)
        return FileResponse(pdf_file, filename="StartERA_Plan.pdf", media_type="application/pdf")
    except Exception as e:
        raise HTTPException(500, f"PDF Error: {str(e)}")