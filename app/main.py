import os
import sqlite3
import hashlib
import psycopg2
from psycopg2.extras import RealDictCursor
import google.generativeai as genai

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

# -------------------- ENV --------------------
load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

# ✅ GÜNCEL MODEL
MODEL_NAME = "gemini-2.5-flash"

try:
    if API_KEY:
        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel(MODEL_NAME)
    else:
        model = None
        print("UYARI: GOOGLE_API_KEY bulunamadı.")
except Exception as e:
    print(f"Model yükleme hatası: {e}")
    model = None

# -------------------- APP --------------------
app = FastAPI()

# CORS: Her yerden gelen isteklere izin ver (Vercel ile iletişim için kritik)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- DB --------------------
def get_db():
    if DATABASE_URL:
        try:
            return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        except Exception as e:
            print(f"Postgres Bağlantı Hatası: {e}")
    
    # Render'da disk geçicidir ama en azından çalışması için SQLite fallback
    conn = sqlite3.connect("chatbot.db")
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
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
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

        conn.commit()
        conn.close()
    except Exception as e:
        print(f"DB Başlatma Hatası: {e}")

init_db()

# -------------------- MODELS --------------------
class UserAuth(BaseModel):
    email: str
    password: str

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

# -------------------- ROOT ROUTE (RENDER İÇİN ŞART) --------------------
@app.get("/")
def read_root():
    return {"status": "Backend is running correctly! 🚀"}

@app.get("/health")
def health():
    return {"status": "ok"}

# -------------------- AUTH --------------------
@app.post("/register")
def register(user: UserAuth):
    conn = get_db()
    cur = conn.cursor()
    hashed = hashlib.sha256(user.password.encode()).hexdigest()

    try:
        cur.execute(
            f"INSERT INTO users (email, password) VALUES ({ph()}, {ph()})",
            (user.email, hashed),
        )
        conn.commit()
        return {"message": "ok"}
    except Exception as e:
        print(f"Register Error: {e}")
        raise HTTPException(400, "Email already exists")
    finally:
        conn.close()

@app.post("/login")
def login(user: UserAuth):
    conn = get_db()
    cur = conn.cursor()
    hashed = hashlib.sha256(user.password.encode()).hexdigest()

    try:
        cur.execute(
            f"SELECT email FROM users WHERE email={ph()} AND password={ph()}",
            (user.email, hashed),
        )
        row = cur.fetchone()
    except Exception as e:
        print(f"Login DB Error: {e}")
        row = None
    finally:
        conn.close()

    if not row:
        raise HTTPException(401, "Invalid credentials")

    return {
        "token": f"user-{user.email}",
        "email": user.email
    }

# -------------------- CHAT --------------------
@app.post("/chat")
def chat(req: ChatRequest):
    if not model:
        raise HTTPException(503, "AI Model API Key is missing on server.")

    prompt = req.system_prompt + "\n\nUser: " + req.message if req.system_prompt else req.message

    try:
        response = model.generate_content(prompt)
        reply = response.text
    except Exception as e:
        print(f"Gemini Error: {e}")
        reply = "⚠️ AI service temporarily unavailable."

    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO chat_history (role, message) VALUES ({ph()}, {ph()})",
            ("user", req.message),
        )
        cur.execute(
            f"INSERT INTO chat_history (role, message) VALUES ({ph()}, {ph()})",
            ("bot", reply),
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Chat Log Error: {e}")

    return {"reply": reply}

# -------------------- PLAN --------------------
@app.post("/generate_plan")
def generate_plan(req: BusinessPlanRequest):
    if not model:
        raise HTTPException(503, "AI Model API Key is missing.")

    prompt = f"""
You are a professional business consultant.
LANGUAGE: {req.language}

Idea: {req.idea}
Capital: {req.capital}
Skills: {req.skills}
Strategy: {req.strategy}
Management: {req.management}

Create a detailed, investor-ready business plan.
Format the output with clear section headers.
Do NOT use markdown symbols like **, ##. Just use plain text with spacing.
"""
    try:
        text = model.generate_content(prompt).text.replace("*", "").replace("#", "")
        return JSONResponse(content={"plan": text})
    except Exception as e:
        print(f"Generate Plan Error: {e}")
        raise HTTPException(500, f"Plan generation failed: {str(e)}")

@app.post("/create_pdf")
def create_pdf(req: PDFRequest):
    # Render'da sadece /tmp klasörüne yazma izni vardır
    pdf_file = "/tmp/StartERA_Plan.pdf"
    
    try:
        doc = SimpleDocTemplate(pdf_file, pagesize=letter)
        styles = getSampleStyleSheet()
        story = [Paragraph("Start ERA Business Plan", styles["Title"]), Spacer(1, 12)]

        for line in req.text.split("\n"):
            if line.strip():
                story.append(Paragraph(line, styles["Normal"]))
                story.append(Spacer(1, 6))

        doc.build(story)
        return FileResponse(pdf_file, filename="StartERA_Plan.pdf", media_type="application/pdf")
    except Exception as e:
        print(f"PDF Error: {e}")
        raise HTTPException(500, "PDF oluşturulamadı")

# -------------------- RUN --------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))