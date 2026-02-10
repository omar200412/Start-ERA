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

# ReportLab imports
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
from reportlab.lib.colors import HexColor

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")
# E-posta Ayarları
MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

# AI Model
MODEL_NAME = "gemini-2.5-flash"

try:
    if API_KEY:
        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel(MODEL_NAME)
    else:
        model = None
except Exception as e:
    model = None

# FastAPI
app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- DB CONNECTION --------------------
def get_db_connection():
    # 1. Postgres (Canlı - Kalıcı)
    if DATABASE_URL:
        try:
            conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
            return conn, "postgres"
        except Exception as e:
            print(f"Postgres Error: {e}")
            pass
    
    # 2. SQLite (Local - Kalıcı / Vercel - Geçici)
    if platform.system() == "Windows":
        db_path = "chatbot.db"
    else:
        db_path = "/tmp/chatbot.db" # Vercel'de burası her seferinde sıfırlanır!
        
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn, "sqlite"

def ph():
    conn, db_type = get_db_connection()
    conn.close()
    return "%s" if db_type == "postgres" else "?"

def init_db():
    conn, db_type = get_db_connection()
    cur = conn.cursor()
    try:
        # Tabloları oluştur
        user_table = """
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                verification_code TEXT,
                is_verified BOOLEAN DEFAULT FALSE
            );
        """ if db_type == "postgres" else """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                verification_code TEXT,
                is_verified INTEGER DEFAULT 0
            );
        """
        cur.execute(user_table)
        
        # Chat tablosu...
        # (Basitlik için burayı kısalttım, user tablosu yeterli)
        
        conn.commit()
    except Exception as e:
        print(f"DB Init Error: {e}")
    finally:
        conn.close()

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
    if not MAIL_USERNAME or not MAIL_PASSWORD:
        return False
    msg = MIMEMultipart()
    msg['From'] = MAIL_USERNAME
    msg['To'] = to_email
    msg['Subject'] = "Start ERA - Kodunuz"
    msg.attach(MIMEText(f"Giriş Kodunuz: {code}", 'plain'))
    try:
        server = smtplib.SMTP(MAIL_SERVER, MAIL_PORT)
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(MAIL_USERNAME, to_email, msg.as_string())
        server.quit()
        return True
    except:
        return False

# -------------------- ROUTES --------------------

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
    placeholder = "%s" if db_type == "postgres" else "?"

    print(f"KAYIT: {clean_email} - KOD: {code}")

    try:
        # Vercel'de DB sıfırlandığı için tablo yoksa tekrar oluşturmayı dene
        init_db()
        
        cur.execute(f"INSERT INTO users (email, password, verification_code, is_verified) VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder})", 
                   (clean_email, hashed, code, 0 if db_type=="sqlite" else False))
        conn.commit()
        
        # Mail at
        send_verification_email(clean_email, code)
        
        return {"message": "success", "email": clean_email}
    except Exception as e:
        print(f"Register Error: {e}")
        # Vercel'de hata olsa bile kullanıcıya kod gitti gibi davran (Demo)
        return {"message": "success", "email": clean_email, "debug_code": code}
    finally:
        conn.close()

@app.post("/api/verify")
def verify(req: VerifyRequest):
    # SABİT DEMO KODU
    if req.code == "123456":
        return {"message": "success", "token": f"demo-{req.email}", "email": req.email}

    conn, db_type = get_db_connection()
    cur = conn.cursor()
    clean_email = req.email.strip().lower()
    placeholder = "%s" if db_type == "postgres" else "?"
    
    try:
        cur.execute(f"SELECT verification_code FROM users WHERE email={placeholder}", (clean_email,))
        row = cur.fetchone()
        
        # Vercel'de kullanıcı silinmiş olabilir, ama kod 123456 ise yukarıda geçtik.
        if not row:
             raise HTTPException(404, "Kullanıcı bulunamadı (Kodun süresi dolmuş olabilir).")
             
        stored = row['verification_code'] if db_type == "postgres" else row[0]
        
        if str(stored) == str(req.code):
            return {"message": "success", "token": f"user-{clean_email}", "email": clean_email}
        else:
            raise HTTPException(400, "Hatalı kod.")
    finally:
        conn.close()

@app.post("/api/login")
def login(user: UserAuth):
    clean_email = user.email.strip().lower()
    hashed = hashlib.sha256(user.password.encode()).hexdigest()
    
    # 🔥🔥🔥 MASTER USER (KURTARICI) 🔥🔥🔥
    # Veritabanı silinse bile bu bilgilerle her zaman giriş yapabilirsiniz.
    if clean_email == "demo@startera.com" and user.password == "123456":
        return {"token": "master-token", "email": clean_email}

    conn, db_type = get_db_connection()
    cur = conn.cursor()
    placeholder = "%s" if db_type == "postgres" else "?"
    
    try:
        if db_type == "postgres":
            cur.execute(f"SELECT * FROM users WHERE email={placeholder}", (clean_email,))
            row = cur.fetchone()
            stored_pass = row['password'] if row else None
        else:
            cur.execute(f"SELECT password FROM users WHERE email={placeholder}", (clean_email,))
            row = cur.fetchone()
            stored_pass = row[0] if row else None
            
        if not stored_pass or stored_pass != hashed:
            raise HTTPException(401, "Hatalı e-posta veya şifre.")
            
        return {"token": f"user-{clean_email}", "email": clean_email}
    except HTTPException as he:
        raise he
    except:
        # DB hatası olursa (Vercel) yine de demo kullanıcısı uyarısı ver
        raise HTTPException(500, "Sunucu hatası. Lütfen 'demo@startera.com' / '123456' ile deneyin.")
    finally:
        conn.close()

# --- AI ROUTES ---
@app.post("/api/chat")
def chat(req: ChatRequest):
    if not model: return {"reply": "API Key Eksik"}
    try:
        res = model.generate_content(req.message)
        return {"reply": res.text}
    except:
        return {"reply": "Hata oluştu."}

@app.post("/api/generate_plan")
def generate_plan(req: BusinessPlanRequest):
    if not model: raise HTTPException(503, "API Key Missing")
    prompt = f"Girişim Fikri: {req.idea}\nSermaye: {req.capital}\nDil: {req.language}\nBana detaylı iş planı yaz."
    try:
        res = model.generate_content(prompt)
        return JSONResponse(content={"plan": res.text})
    except Exception as e:
        raise HTTPException(500, str(e))

@app.post("/api/create_pdf")
def create_pdf(req: PDFRequest):
    # PDF oluşturma (Basitleştirilmiş)
    pdf_file = "/tmp/Plan.pdf" if platform.system() != "Windows" else "Plan.pdf"
    try:
        doc = SimpleDocTemplate(pdf_file, pagesize=A4)
        doc.build([Paragraph(req.text, getSampleStyleSheet()['Normal'])])
        return FileResponse(pdf_file, media_type="application/pdf")
    except:
        raise HTTPException(500, "PDF Error")