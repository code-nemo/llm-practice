from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import openai, gemini, claude
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