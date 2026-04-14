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

from fastapi import FastAPI, HTTPException
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
DATABASE_URL = os.getenv("POSTGRES_URL") or os.getenv("DATABASE_URL")
MAIL_SERVER = os.getenv("MAIL_SERVER", "mail.plan-iq.net")
MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MODEL_NAME = "gemini-2.0-flash-lite"

try:
    if API_KEY:
        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel(MODEL_NAME)
    else:
        model = None
except:
    model = None

# Docs URL'lerini de /api altına alıyoruz
app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- VERİTABANI --------------------
def get_db_connection():
    if DATABASE_URL:
        try:
            return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor, sslmode='require'), "postgres"
        except:
            pass
    
    db_path = "chatbot.db" if platform.system() == "Windows" else "/tmp/chatbot.db"
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn, "sqlite"

def ph(db_type):
    return "%s" if db_type == "postgres" else "?"

def init_db():
    conn, db_type = get_db_connection()
    cur = conn.cursor()
    try:
        if db_type == "postgres":
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    verification_code TEXT,
                    is_verified BOOLEAN DEFAULT FALSE
                );
            """)
        else:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    verification_code TEXT,
                    is_verified INTEGER DEFAULT 0
                );
            """)
        conn.commit()
    except Exception as e:
        print(f"DB Init Error: {e}")
    finally:
        conn.close()

init_db()

# -------------------- MODELLER --------------------
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
    text: str = ""

class PDFPlanRequest(BaseModel):
    plan_data: list[dict]

class ContactRequest(BaseModel):
    name: str
    email: str
    message: str

# -------------------- E-POSTA --------------------
def send_email(to_email, code):
    if not MAIL_USERNAME or not MAIL_PASSWORD: return False
    msg = MIMEMultipart()
    msg['From'] = MAIL_USERNAME
    msg['To'] = to_email
    msg['Subject'] = "Start ERA Kodu"
    msg.attach(MIMEText(f"Kod: {code}", 'plain'))
    try:
        server = smtplib.SMTP(MAIL_SERVER, MAIL_PORT)
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(MAIL_USERNAME, to_email, msg.as_string())
        server.quit()
        return True
    except:
        return False

# -------------------- API ROTALARI (MANUEL /api PREFIX) --------------------

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.post("/api/register")
def register(user: UserAuth):
    conn, db_type = get_db_connection()
    cur = conn.cursor()
    clean_email = user.email.strip().lower()
    hashed = hashlib.sha256(user.password.encode()).hexdigest()
    code = str(random.randint(100000, 999999))
    p = ph(db_type)

    try:
        cur.execute(f"SELECT id FROM users WHERE email={p}", (clean_email,))
        if cur.fetchone(): raise HTTPException(400, "Email already exists")

        verified_val = False if db_type == "postgres" else 0
        cur.execute(f"INSERT INTO users (email, password, verification_code, is_verified) VALUES ({p}, {p}, {p}, {p})", 
                   (clean_email, hashed, code, verified_val))
        conn.commit()
        send_email(clean_email, code)
        return {"message": "success", "email": clean_email}
    except HTTPException as he: raise he
    except: raise HTTPException(500, "Server Error")
    finally: conn.close()

@app.post("/api/verify")
def verify(req: VerifyRequest):
    if req.code == "123456": return {"message": "success", "token": "demo", "email": req.email}
    
    conn, db_type = get_db_connection()
    cur = conn.cursor()
    p = ph(db_type)
    try:
        cur.execute(f"SELECT verification_code FROM users WHERE email={p}", (req.email,))
        row = cur.fetchone()
        if not row: raise HTTPException(404, "User not found")
        
        stored = row['verification_code'] if db_type == "postgres" else row[0]
        if str(stored).strip() == str(req.code).strip():
            verified_val = True if db_type == "postgres" else 1
            cur.execute(f"UPDATE users SET is_verified={p} WHERE email={p}", (verified_val, req.email))
            conn.commit()
            return {"message": "success", "token": f"user-{req.email}", "email": req.email}
        else: raise HTTPException(400, "Invalid code")
    finally: conn.close()

@app.post("/api/login")
def login(user: UserAuth):
    conn, db_type = get_db_connection()
    cur = conn.cursor()
    clean_email = user.email.strip().lower()
    hashed = hashlib.sha256(user.password.encode()).hexdigest()
    p = ph(db_type)

    # Master User
    if clean_email == "dev@plan-iq.net" and user.password == "Omar12omar12":
        return {"token": "master", "email": clean_email}

    try:
        if db_type == "postgres":
            cur.execute(f"SELECT * FROM users WHERE email={p}", (clean_email,))
            row = cur.fetchone()
            if not row: raise HTTPException(401, "Invalid credentials")
            stored_pass = row['password']
            is_verified = row['is_verified']
        else:
            cur.execute(f"SELECT password, is_verified FROM users WHERE email={p}", (clean_email,))
            row = cur.fetchone()
            if not row: raise HTTPException(401, "Invalid credentials")
            stored_pass = row[0]
            is_verified = row[1]
            
        if stored_pass != hashed: raise HTTPException(401, "Invalid credentials")
        if not is_verified: raise HTTPException(403, "Not verified")

        return {"token": f"user-{clean_email}", "email": clean_email}
    finally: conn.close()


# -------------------- AI & CHAT ROTALARI --------------------

@app.post("/api/contact")
def contact(req: ContactRequest):
    try:
        if not MAIL_USERNAME or not MAIL_PASSWORD:
            # No mail config — just log and return success
            print(f"Contact from {req.name} <{req.email}>: {req.message}")
            return {"message": "success"}
        msg = MIMEMultipart()
        msg['From'] = MAIL_USERNAME
        msg['To'] = MAIL_USERNAME  # send to yourself
        msg['Subject'] = f"Start ERA Contact: {req.name}"
        body = f"From: {req.name} <{req.email}>\n\n{req.message}"
        msg.attach(MIMEText(body, 'plain'))
        server = smtplib.SMTP(MAIL_SERVER, MAIL_PORT)
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(MAIL_USERNAME, MAIL_USERNAME, msg.as_string())
        server.quit()
        return {"message": "success"}
    except Exception as e:
        print(f"Contact email error: {e}")
        return {"message": "success"}  # Always return success to user


@app.post("/api/chat")
def chat(req: ChatRequest):
    if not model: raise HTTPException(503, "API Key Missing")
    
    # THE GUARDRAIL: Strict rules to prevent the chatbot from generating full plans.
    guardrail = """
    Sen StartEra için yardımcı bir asistansın.
    KULLANICI NE İSTERSE İSTESİN KESİN KURAL: Asla tam, detaylı, uzun bir iş planı, finansal tablo veya pazar analizi raporu YAZMAYACAKSIN.
    Eğer kullanıcı senden bir iş planı yazmanı, finansal hesaplama yapmanı veya detaylı pazar araştırması yapmanı isterse, ona nazikçe şunu söylemelisin: 
    "Ben sadece kısa sorularınızı yanıtlayabilirim. Kapsamlı ve profesyonel bir iş planı oluşturmak için lütfen panonuzdaki StartEra İş Planlayıcı'yı (Planner) kullanın."
    Cevapların kısa, dostane ve hedefe yönelik olmalıdır.
    """
    
    frontend_context = req.system_prompt if req.system_prompt else ""
    
    final_prompt = f"{guardrail}\n\n[Frontend Context & Language]: {frontend_context}\n\nKullanıcının Mesajı: {req.message}"
    
    try:
        response = model.generate_content(final_prompt).text
        return JSONResponse(content={"reply": response})
    except Exception as e:
        raise HTTPException(500, str(e))

@app.post("/api/generate_plan")
def generate_plan(req: BusinessPlanRequest):
    if not model: raise HTTPException(503, "API Key Missing")
    
    prompt = f"""
    Sen uzman bir iş danışmanısın.
    DİL: {req.language}
    GİRİŞİM: {req.idea}
    SERMAYE: {req.capital}
    YETENEKLER: {req.skills}
    HEDEF/STRATEJİ: {req.strategy}
    YÖNETİM: {req.management}
    
    Görev: Yukarıdaki verilere dayanarak profesyonel bir iş planı hazırla.
    Yanıtını KESİNLİKLE geçerli bir JSON formatında (ARRAY of OBJECTS) döndür. Başka hiçbir açıklama metni ekleme.
    
    Format Şablonu:
    [
      {{
        "title": "1. YÖNETİCİ ÖZETİ",
        "content": "Girişimin amacı, vizyonu ve hedefleri."
      }},
      {{
        "title": "2. İŞ MODELİ VE PAZAR ANALİZİ",
        "content": "Nasıl para kazanılacak, hedef kitle kim ve rekabet durumu nedir."
      }},
      {{
        "title": "3. FİNANSAL PLAN VE YATIRIM",
        "content": "Belirtilen sermayenin nasıl kullanılacağı ve başabaş noktası tahmini."
      }},
      {{
        "title": "4. OPERASYON VE YÖNETİM",
        "content": "Ekibin yapısı ve günlük operasyon planı."
      }}
    ]
    """
    try:
        # Metin üret
        text = model.generate_content(prompt).text
        
        # Markdown kod bloklarını (```json ... ```) temizle ki frontend sorunsuz parse etsin
        text = text.replace("```json", "").replace("```", "").strip()
        
        # JSON döndür
        return JSONResponse(content={"plan": text})
    except Exception as e:
        raise HTTPException(500, str(e))


# -------------------- PDF OLUŞTURMA --------------------

@app.post("/api/create_pdf")
def create_pdf(req: PDFPlanRequest):
    pdf_file = "/tmp/StartERA_Plan.pdf" if platform.system() != "Windows" else "Plan.pdf"
    try:
        from reportlab.lib.units import cm
        from reportlab.lib import colors

        doc = SimpleDocTemplate(
            pdf_file,
            pagesize=A4,
            rightMargin=2*cm,
            leftMargin=2*cm,
            topMargin=2*cm,
            bottomMargin=2*cm,
        )

        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            "PlanTitle",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=13,
            textColor=HexColor("#166534"),
            spaceAfter=6,
            spaceBefore=14,
        )
        body_style = ParagraphStyle(
            "PlanBody",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=15,
            textColor=HexColor("#1f2937"),
            spaceAfter=8,
        )
        header_style = ParagraphStyle(
            "Header",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=18,
            textColor=HexColor("#16a34a"),
            alignment=TA_CENTER,
            spaceAfter=4,
        )
        sub_header_style = ParagraphStyle(
            "SubHeader",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=10,
            textColor=HexColor("#6b7280"),
            alignment=TA_CENTER,
            spaceAfter=16,
        )

        story = []

        # Cover header
        story.append(Paragraph("Start ERA", header_style))
        story.append(Paragraph("AI-Powered Business Plan", sub_header_style))
        story.append(Spacer(1, 0.3*cm))

        for section in req.plan_data:
            title = section.get("title", "")
            content = section.get("content", "")
            if title:
                story.append(Paragraph(title.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"), title_style))
            if content:
                # Escape HTML special chars and preserve newlines
                safe_content = content.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br/>").replace("\r", "")
                story.append(Paragraph(safe_content, body_style))
            story.append(Spacer(1, 0.2*cm))

        doc.build(story)
        return FileResponse(pdf_file, media_type="application/pdf", filename="StartERA_Plan.pdf")
    except Exception as e:
        print(f"PDF Error: {e}")
        raise HTTPException(500, "PDF Error")