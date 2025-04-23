from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

generation_config={"max_output_tokens": 100}

class GeminiRequest(BaseModel):
    prompt: str
    username: str
    max_tokens: int = 100

class GeminiResponse(BaseModel):
    response: str

@router.post("/gemini", response_model=GeminiResponse)
async def chat_with_gemini(request: GeminiRequest):
    try:
        # Maintain a chat history for each user
        user_id = request.username
        chat_histories = getattr(router, "chat_histories", {})
        if user_id not in chat_histories:
            chat_histories[user_id] = []

        # Append the current prompt to the user's chat history
        chat_histories[user_id].append({"role": "user", "content": request.prompt})
        print(chat_histories)
        # Generate response considering the chat history
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[message["content"] for message in chat_histories[user_id]],
        )

        # Append the response to the chat history
        if response.text:
            chat_histories[user_id].append({"role": "assistant", "content": response.text})
            setattr(router, "chat_histories", chat_histories)  # Save updated chat history
            return GeminiResponse(response=response.text)
        return GeminiResponse(response="No response from Gemini")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))