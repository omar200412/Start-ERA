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

# ReportLab imports for Professional PDF generation
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER, TA_LEFT
from reportlab.lib.colors import Color, black, white, HexColor

# -------------------- ENV --------------------
load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

# ✅ MODEL: Gemini 2.5 Flash
MODEL_NAME = "gemini-2.5-flash"

try:
    if API_KEY:
        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel(MODEL_NAME)
    else:
        print("Warning: GOOGLE_API_KEY is missing.")
        model = None
except Exception as e:
    print(f"Model config error: {e}")
    model = None

# -------------------- APP --------------------
app = FastAPI()

# CORS Ayarları: Frontend'den gelen her türlü isteğe izin ver
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Güvenlik için canlıda frontend domaini yazılabilir ama "*" şimdilik çalışır.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- DB --------------------
def get_db():
    if DATABASE_URL:
        return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    # Render diskleri geçicidir, SQLite verisi silinebilir. 
    # Kalıcı veri için Render Postgres kullanılmalı.
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
        print(f"DB Init Error: {e}")

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

# -------------------- ROUTES --------------------

@app.get("/")
def read_root():
    return {"message": "Start ERA Backend is Running! 🚀"}

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
        print(e)
        raise HTTPException(400, "Email already exists or DB error")
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
    except Exception:
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
        raise HTTPException(503, "AI Model not configured properly.")

    prompt = req.system_prompt + "\n\nUser: " + req.message if req.system_prompt else req.message

    try:
        response = model.generate_content(prompt)
        reply = response.text
    except Exception as e:
        print(f"Gemini Error: {e}")
        reply = "⚠️ AI service temporarily unavailable."

    # Chat geçmişini kaydetme (Opsiyonel - Hata olursa akışı bozmasın)
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
        print(f"DB Chat Log Error: {e}")

    return {"reply": reply}

@app.get("/chat/history")
def chat_history():
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT role, message FROM chat_history ORDER BY id")
        rows = cur.fetchall()
        conn.close()

        return [
            {"text": r["message"], "isBot": r["role"] == "bot"}
            for r in rows
        ]
    except Exception:
        return []

# -------------------- PLAN --------------------
@app.post("/generate_plan")
def generate_plan(req: BusinessPlanRequest):
    if not model:
        raise HTTPException(503, "AI Model not configured.")

    prompt = f"""
You are a professional business consultant named Start ERA AI.
LANGUAGE: {req.language}

Analyze the following startup details:
- Idea: {req.idea}
- Capital: {req.capital}
- Skills: {req.skills}
- Strategy: {req.strategy}
- Management: {req.management}

OUTPUT FORMAT:
Generate a structured, professional business plan with the following sections (use uppercase for headers):
1. EXECUTIVE SUMMARY
2. BUSINESS DESCRIPTION
3. MARKET ANALYSIS
4. OPERATIONAL STRATEGY
5. FINANCIAL PLAN

Do NOT use markdown symbols like ** or ##. Use clean text.
Tone: Professional, encouraging, and analytical.
"""
    try:
        text = model.generate_content(prompt).text.replace("*", "").replace("#", "")
        return JSONResponse(content={"plan": text})
    except Exception as e:
        print(f"Plan Error: {e}")
        raise HTTPException(500, f"Plan generation failed: {str(e)}")

@app.post("/create_pdf")
def create_pdf(req: PDFRequest):
    pdf_file = "/tmp/StartERA_Plan.pdf" # Render/Vercel gibi yerlerde /tmp kullanmak daha güvenlidir
    try:
        doc = SimpleDocTemplate(
            pdf_file, 
            pagesize=A4,
            rightMargin=72, leftMargin=72, 
            topMargin=72, bottomMargin=72
        )
        
        styles = getSampleStyleSheet()
        brand_color = HexColor("#1e40af") 
        
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Title'],
            fontName='Helvetica-Bold',
            fontSize=24,
            spaceAfter=30,
            textColor=brand_color,
            alignment=TA_CENTER
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=14,
            spaceBefore=20,
            spaceAfter=12,
            textColor=brand_color,
            keepWithNext=True,
            borderPadding=5,
            borderColor=brand_color,
            borderWidth=0,
            borderBottomWidth=1
        )
        
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=11,
            leading=15,
            alignment=TA_JUSTIFY,
            spaceAfter=10,
            textColor=HexColor("#333333")
        )

        story = []
        story.append(Paragraph("Start ERA", title_style))
        story.append(Paragraph("Professional Business Plan", styles["Heading3"]))
        story.append(Paragraph("Generated by AI Consultant", styles["Italic"]))
        story.append(Spacer(1, 30))
        
        for line in req.text.split("\n"):
            line = line.strip()
            if not line:
                continue
            if (len(line) < 60 and line.isupper()) or (len(line) < 50 and line.endswith(":")):
                story.append(Paragraph(line, heading_style))
            else:
                story.append(Paragraph(line, body_style))
        
        story.append(Spacer(1, 40))
        story.append(Paragraph("© 2026 Start ERA - Confidential Document", styles["Italic"]))
        
        doc.build(story)
        return FileResponse(pdf_file, filename="StartERA_Plan.pdf", media_type="application/pdf")
    except Exception as e:
        raise HTTPException(500, f"PDF creation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))