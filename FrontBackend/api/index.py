import os
import sqlite3
import hashlib
import smtplib
import random
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

# root_path ayarını kaldırdık, rotaları manuel olarak yönetiyoruz.
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
    conn = sqlite3.connect("/tmp/chatbot.db")
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
    if not MAIL_USERNAME or not MAIL_PASSWORD: 
        print("⚠️ MAIL Credentials Missing")
        return False
        
    msg = MIMEMultipart()
    msg['From'] = MAIL_USERNAME
    msg['To'] = to_email
    msg['Subject'] = "Start ERA - Verification Code"
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

# -------------------- ROUTES (Hepsine /api eklendi) --------------------

@app.get("/api/health")
def health():
    return {"status": "ok", "backend": "Vercel Python Runtime"}

@app.post("/api/register")
def register(user: UserAuth):
    conn = get_db()
    cur = conn.cursor()
    hashed = hashlib.sha256(user.password.encode()).hexdigest()
    code = str(random.randint(100000, 999999))
    print(f"\n🔥🔥🔥 DEBUG CODE: {code} 🔥🔥🔥\n")
    
    try:
        cur.execute(f"INSERT INTO users (email, password, verification_code, is_verified) VALUES ({ph()}, {ph()}, {ph()}, {ph()})", (user.email, hashed, code, 0))
        conn.commit()
        send_verification_email(user.email, code)
        return {"message": "verification_needed", "email": user.email}
    except:
        raise HTTPException(400, "Email already exists")
    finally:
        conn.close()

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
        else:
            raise HTTPException(400, "Invalid code")
    finally:
        conn.close()

@app.post("/api/login")
def login(user: UserAuth):
    conn = get_db()
    cur = conn.cursor()
    hashed = hashlib.sha256(user.password.encode()).hexdigest()
    try:
        cur.execute(f"SELECT email, is_verified FROM users WHERE email={ph()} AND password={ph()}", (user.email, hashed))
        row = cur.fetchone()
        if not row: raise HTTPException(401, "Invalid credentials")
        
        is_verified = row[1] if DATABASE_URL else row["is_verified"]
        if not is_verified: raise HTTPException(403, "Not verified")
        
        return {"token": f"user-{user.email}", "email": user.email}
    finally:
        conn.close()

@app.post("/api/chat")
def chat(req: ChatRequest):
    if not model: return {"reply": "API Key Missing"}
    try:
        prompt = (req.system_prompt or "") + "\n\nUser: " + req.message
        response = model.generate_content(prompt)
        reply = response.text
    except:
        reply = "⚠️ AI Error"
    return {"reply": reply}

@app.post("/api/generate_plan")
def generate_plan(req: BusinessPlanRequest):
    if not model: raise HTTPException(503, "API Key Missing")
    prompt = f"Idea: {req.idea}\nCapital: {req.capital}\nSkills: {req.skills}\nStrategy: {req.strategy}\nLang: {req.language}\nCreate a business plan."
    try:
        text = model.generate_content(prompt).text.replace("*", "").replace("#", "")
        return JSONResponse(content={"plan": text})
    except Exception as e:
        raise HTTPException(500, str(e))

@app.post("/api/create_pdf")
def create_pdf(req: PDFRequest):
    pdf_file = "/tmp/StartERA_Plan.pdf"
    try:
        doc = SimpleDocTemplate(pdf_file, pagesize=A4)
        styles = getSampleStyleSheet()
        story = [Paragraph("Business Plan", styles["Title"]), Spacer(1, 12)]
        for line in req.text.split("\n"):
            if line.strip(): story.append(Paragraph(line, styles["Normal"]))
        doc.build(story)
        return FileResponse(pdf_file, filename="StartERA_Plan.pdf", media_type="application/pdf")
    except Exception as e:
        raise HTTPException(500, str(e))