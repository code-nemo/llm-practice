from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

router = APIRouter()

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

generation_config={"max_output_tokens": 100}

# Schema for chat histories
# {
#     "user1_id": {
#         "conversation1_id": [...<conversation1_history>],
#         "conversation2_id": [...<conversation2_history>]
#     },
#     "user2_id": {
#         "conversation1_id": [...<conversation1_history>],
#         "conversation2_id": [...<conversation2_history>]
#     }
# }

# File to persist chat histories
CHAT_HISTORY_FILE = "chat_histories.json"

# Load chat histories from file
def load_chat_histories():
    if os.path.exists(CHAT_HISTORY_FILE):
        with open(CHAT_HISTORY_FILE, "r") as file:
            return json.load(file)
    return {}

# Save chat histories to file
def save_chat_histories(chat_histories):
    with open(CHAT_HISTORY_FILE, "w") as file:
        json.dump(chat_histories, file, indent=4)

# Initialize chat histories
chat_histories = load_chat_histories()

class GeminiRequest(BaseModel):
    prompt: str
    username: str
    conversation_id: str
    max_tokens: int = 100

class GeminiResponse(BaseModel):
    response: str

@router.post("/gemini", response_model=GeminiResponse)
async def chat_with_gemini(request: GeminiRequest):
    try:
        # Maintain a chat history for each user
        user_id = request.username
        conversation_id = request.conversation_id

        # Initialize user and conversation if not present
        if user_id not in chat_histories:
            chat_histories[user_id] = {}
        if conversation_id not in chat_histories[user_id]:
            chat_histories[user_id][conversation_id] = []

        # Append the current prompt to the conversation's chat history
        chat_histories[user_id][conversation_id].append({"role": "user", "content": request.prompt})
        print(chat_histories)

        # Generate response considering the chat history
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[message["content"] for message in chat_histories[user_id][conversation_id]],
        )

        # Append the response to the chat history
        if response.text:
            chat_histories[user_id][conversation_id].append({"role": "assistant", "content": response.text})
            save_chat_histories(chat_histories)
            return GeminiResponse(response=response.text)
        return GeminiResponse(response="No response from Gemini")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{username}", response_model=dict)
async def get_chat_history(username: str):
    try:
        # Retrieve chat history for the specified user
        if username in chat_histories:
            return chat_histories[username]
        else:
            raise HTTPException(status_code=404, detail="No chat history found for this user")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))