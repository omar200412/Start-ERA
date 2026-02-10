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

# --- E-POSTA AYARLARI ---
MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
MAIL_USERNAME = os.getenv("MAIL_USERNAME", "dev@plan-iq.net")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD") # Gmail için "App Password" olmalı

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

# FastAPI Uygulaması
app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json", root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- DATABASE CONNECTION --------------------
def get_db_connection():
    if DATABASE_URL:
        try:
            conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
            return conn, "postgres"
        except Exception as e:
            print(f"❌ Postgres Bağlantı Hatası: {e}")
            pass
    
    if platform.system() == "Windows":
        db_path = "chatbot.db"
    else:
        db_path = "/tmp/chatbot.db"
        
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
            cur.execute("""
                CREATE TABLE IF NOT EXISTS chat_history (
                    id SERIAL PRIMARY KEY,
                    role TEXT,
                    message TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
            cur.execute("""
                CREATE TABLE IF NOT EXISTS chat_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    role TEXT,
                    message TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
        
        conn.commit()
    except Exception as e:
        print(f"❌ DB Init Error: {e}")
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
        print("\n⚠️  MAIL HATASI: .env dosyasında MAIL_USERNAME veya MAIL_PASSWORD eksik.")
        return False
        
    msg = MIMEMultipart()
    msg['From'] = MAIL_USERNAME
    msg['To'] = to_email
    msg['Subject'] = "Start ERA - Dogrulama Kodunuz"
    msg.attach(MIMEText(f"Start ERA Giriş Kodunuz: {code}", 'plain', 'utf-8'))

    try:
        server = smtplib.SMTP(MAIL_SERVER, MAIL_PORT)
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(MAIL_USERNAME, to_email, msg.as_string())
        server.quit()
        print(f"✅ MAIL GÖNDERİLDİ: {to_email}")
        return True
    except Exception as e:
        print(f"\n❌ MAIL GÖNDERME HATASI: {str(e)}")
        print("💡 İPUCU: Gmail kullanıyorsanız 'App Password' oluşturup .env dosyasına yazmalısınız.\n")
        return False

# -------------------- ROUTES --------------------

@app.get("/health")
def health():
    return {"status": "ok", "backend": "Python Active"}

@app.post("/register")
def register(user: UserAuth):
    conn, db_type = get_db_connection()
    cur = conn.cursor()
    
    clean_email = user.email.strip().lower()
    hashed = hashlib.sha256(user.password.encode()).hexdigest()
    code = str(random.randint(100000, 999999))
    
    # 👇 BURASI ÇOK ÖNEMLİ: Kodu terminale basıyoruz
    print("="*40)
    print(f"📧 ALICI: {clean_email}")
    print(f"🔑 DOĞRULAMA KODU: {code}")
    print("="*40)

    placeholder = "%s" if db_type == "postgres" else "?"

    try:
        cur.execute(f"SELECT id FROM users WHERE email={placeholder}", (clean_email,))
        if cur.fetchone():
            raise HTTPException(400, "Bu e-posta zaten kayıtlı.")

        verified_val = False if db_type == "postgres" else 0
        
        cur.execute(
            f"INSERT INTO users (email, password, verification_code, is_verified) VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder})", 
            (clean_email, hashed, code, verified_val)
        )
        conn.commit()
        
        # Mail göndermeyi dene ama hata verirse kod terminalde göründüğü için devam et
        try:
            send_verification_email(clean_email, code)
        except:
            pass
        
        return {"message": "success", "email": clean_email}
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"❌ Register DB Error: {e}")
        raise HTTPException(500, "Sunucu hatası.")
    finally:
        conn.close()

@app.post("/login")
def login(user: UserAuth):
    conn, db_type = get_db_connection()
    cur = conn.cursor()
    
    clean_email = user.email.strip().lower()
    hashed = hashlib.sha256(user.password.encode()).hexdigest()
    placeholder = "%s" if db_type == "postgres" else "?"
    
    try:
        if db_type == "postgres":
            cur.execute(f"SELECT * FROM users WHERE email={placeholder}", (clean_email,))
            user_data = cur.fetchone()
            if not user_data: raise HTTPException(401, "Kullanıcı bulunamadı.")
            stored_password = user_data['password']
            is_verified = user_data['is_verified']
        else:
            cur.execute(f"SELECT email, password, is_verified FROM users WHERE email={placeholder}", (clean_email,))
            user_data = cur.fetchone()
            if not user_data: raise HTTPException(401, "Kullanıcı bulunamadı.")
            stored_password = user_data[1]
            is_verified = user_data[2]

        if stored_password != hashed:
            raise HTTPException(401, "Hatalı şifre.")
            
        if not is_verified:
             raise HTTPException(403, "Lütfen önce e-posta adresinizi doğrulayın.")

        return {"token": f"user-{clean_email}", "email": clean_email}
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"❌ Login Error: {e}")
        raise HTTPException(500, "Giriş işlemi başarısız.")
    finally:
        conn.close()

@app.post("/verify")
def verify(req: VerifyRequest):
    conn, db_type = get_db_connection()
    cur = conn.cursor()
    clean_email = req.email.strip().lower()
    placeholder = "%s" if db_type == "postgres" else "?"
    
    try:
        if db_type == "postgres":
            cur.execute(f"SELECT verification_code FROM users WHERE email={placeholder}", (clean_email,))
            row = cur.fetchone()
            stored_code = row['verification_code'] if row else None
        else:
            cur.execute(f"SELECT verification_code FROM users WHERE email={placeholder}", (clean_email,))
            row = cur.fetchone()
            stored_code = row[0] if row else None
            
        if not stored_code:
            raise HTTPException(404, "Kullanıcı bulunamadı")
        
        # Kod Eşleştirme (String olarak karşılaştırıyoruz)
        if str(stored_code).strip() == str(req.code).strip():
            verified_val = True if db_type == "postgres" else 1
            cur.execute(f"UPDATE users SET is_verified={placeholder} WHERE email={placeholder}", (verified_val, clean_email))
            conn.commit()
            return {"message": "success", "token": f"user-{clean_email}", "email": clean_email}
        else:
            raise HTTPException(400, "Geçersiz kod.")
    finally:
        conn.close()

# --- AI & TOOLS ROUTES ---

@app.post("/chat")
def chat(req: ChatRequest):
    if not model: return {"reply": "API Key Missing"}
    try:
        prompt = (req.system_prompt or "") + "\n\nUser: " + req.message
        response = model.generate_content(prompt)
        return {"reply": response.text}
    except:
        return {"reply": "Üzgünüm, şu an yanıt veremiyorum."}

@app.post("/generate_plan")
def generate_plan(req: BusinessPlanRequest):
    if not model: raise HTTPException(503, "API Key Missing")
    
    prompt = f"""
    Sen uzman bir iş geliştirme danışmanısın. Aşağıdaki girişim fikri için profesyonel bir iş planı hazırla.
    
    GİRİŞİM:
    - Fikir: {req.idea}
    - Sermaye: {req.capital}
    - Yetenekler: {req.skills}
    - Strateji: {req.strategy}
    - Yönetim: {req.management}
    - Dil: {req.language}
    
    ÇIKTI FORMATI (Markdown kullanma, Büyük Harfli Başlıklar):
    1. YÖNETİCİ ÖZETİ
    2. İŞ MODELİ
    3. PAZAR ANALİZİ
    4. PAZARLAMA STRATEJİSİ
    5. FİNANSAL PLAN
    """
    
    try:
        text = model.generate_content(prompt).text.replace("*", "").replace("#", "")
        return JSONResponse(content={"plan": text})
    except Exception as e:
        raise HTTPException(500, str(e))

@app.post("/create_pdf")
def create_pdf(req: PDFRequest):
    if platform.system() == "Windows":
        pdf_file = "StartERA_Plan.pdf"
    else:
        pdf_file = "/tmp/StartERA_Plan.pdf"

    try:
        doc = SimpleDocTemplate(pdf_file, pagesize=A4)
        styles = getSampleStyleSheet()
        story = [Paragraph("Start ERA - Business Plan", styles["Title"]), Spacer(1, 12)]
        
        for line in req.text.split("\n"):
            if line.strip():
                style = styles["Heading2"] if line.isupper() and len(line) < 50 else styles["Normal"]
                story.append(Paragraph(line, style))
                story.append(Spacer(1, 6))
                
        doc.build(story)
        return FileResponse(pdf_file, filename="StartERA_Plan.pdf", media_type="application/pdf")
    except Exception as e:
        raise HTTPException(500, str(e))