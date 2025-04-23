from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.routers import openai, gemini, claude
from app.models.user import User, SignupUser, LoginUser
import json
from pathlib import Path

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

# Path to the JSON file for storing user credentials
USERS_FILE = Path("users.json")

# Ensure the JSON file exists
if not USERS_FILE.exists():
    USERS_FILE.write_text("[]")

# Helper functions to read and write users
def read_users():
    with open(USERS_FILE, "r") as file:
        return json.load(file)

def write_users(users):
    with open(USERS_FILE, "w") as file:
        json.dump(users, file, indent=4)

@app.post("/signup")
async def signup(user: SignupUser):
    print(user.dict())
    users = read_users()

    # Check if the username already exists
    if any(u["username"] == user.username for u in users):
        raise HTTPException(status_code=400, detail="Username already exists")

    # Add the new user
    users.append(user.dict())
    write_users(users)

    return {"message": "User signed up successfully"}

@app.post("/login")
async def login(user: LoginUser):
    users = read_users()

    # Check if the username and password match
    if not any(u["username"] == user.username and u["password"] == user.password for u in users):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {"message": "Login successful", "username": user.username}