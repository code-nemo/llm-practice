from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.routers import openai, gemini, claude
from app.models.user import SignupUser, LoginUser
from app.storage_utils.users import read_users, write_users
from app.storage_utils.chat_history import chat_history
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
    if not any(
        u["username"] == user.username and u["password"] == user.password for u in users
    ):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {"message": "Login successful", "username": user.username}


@app.get("/chat_history/{username}", response_model=dict)
async def get_chat_history(username: str):
    try:
        # Retrieve chat history for the specified user
        if username in chat_history:
            return chat_history[username]
        else:
            raise HTTPException(
                status_code=404, detail="No chat history found for this user"
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
