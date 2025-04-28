from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.routers import openai, gemini, claude
from app.models.user import SignupUser, LoginUser
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["react_chat_app"]  # Database name
chat_collection = db["chat_histories"]  # Collection name

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
    """
    Sign up a new user and store their data in MongoDB.
    """
    try:
        # Check if the username already exists in MongoDB
        existing_user = db["users"].find_one({"username": user.username})
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")

        # Insert the new user into the MongoDB collection
        db["users"].insert_one(user.dict())
        return {"message": "User signed up successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/login")
async def login(user: LoginUser):
    """
    Log in a user by verifying their credentials in MongoDB.
    """
    try:
        # Check if the username and password match in MongoDB
        existing_user = db["users"].find_one(
            {"username": user.username, "password": user.password}
        )
        if not existing_user:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        return {"message": "Login successful", "username": user.username}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/chat_history/{username}", response_model=dict)
async def get_chat_history(username: str):
    """
    Retrieve chat history for a specific user from MongoDB.
    """
    try:
        user_chat = chat_collection.find_one({"username": username})
        if user_chat:
            return user_chat["conversations"]
        else:
            raise HTTPException(
                status_code=404, detail="No chat history found for this user"
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat_history/{username}")
async def save_chat_history(username: str, conversation: dict):
    """
    Save or update chat history for a specific user in MongoDB.
    """
    try:
        chat_collection.update_one(
            {"username": username},
            {"$push": {"conversations": conversation}},
            upsert=True,
        )
        return {"message": "Chat history updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
