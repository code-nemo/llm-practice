from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import openai, gemini, claude
from app.models.user import User
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(openai.router, prefix="/openai", tags=["OpenAI"])
app.include_router(gemini.router, prefix="/gemini", tags=["Gemini"])
app.include_router(claude.router, prefix="/claude", tags=["Claude"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the LLM Chat API"}

@app.post("/login")
async def login(user: User):
    # Verify user credentials and return a success or failure response
    return {"message": "Login successful"}

@app.post("/signup")
async def signup(user: User):
    # Save user email and hashed password to the database
    return {"message": "Signup successful"}