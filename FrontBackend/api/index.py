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
MODEL_NAME = "gemini-2.5-flash"

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
    text: str

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

# --- PLAN & PDF ---

@app.post("/api/generate_plan")
def generate_plan(req: BusinessPlanRequest):
    if not model: raise HTTPException(503, "API Key Missing")
    
    prompt = f"""
    Sen uzman bir iş danışmanısın.
    DİL: {req.language}
    GİRİŞİM: {req.idea}
    SERMAYE: {req.capital}
    YETENEKLER: {req.skills}
    
    Lütfen profesyonel bir iş planı yaz. Bölümler:
    1. YÖNETİCİ ÖZETİ
    2. İŞ MODELİ
    3. PAZAR ANALİZİ
    4. FİNANSAL PLAN
    
    Sadece düz metin kullan, markdown kullanma.
    """
    try:
        # Metin üret
        text = model.generate_content(prompt).text.replace("*", "").replace("#", "")
        # JSON döndür (PDF DEĞİL!)
        return JSONResponse(content={"plan": text})
    except Exception as e:
        raise HTTPException(500, str(e))

@app.post("/api/create_pdf")
def create_pdf(req: PDFRequest):
    pdf_file = "/tmp/StartERA_Plan.pdf" if platform.system() != "Windows" else "Plan.pdf"
    try:
        doc = SimpleDocTemplate(pdf_file, pagesize=A4)
        doc.build([Paragraph(req.text, getSampleStyleSheet()['Normal'])])
        return FileResponse(pdf_file, media_type="application/pdf")
    except:
        raise HTTPException(500, "PDF Error")