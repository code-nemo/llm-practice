from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
from anthropic import Anthropic
from dotenv import load_dotenv
import os

load_dotenv()
client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),
)

router = APIRouter()

class ClaudeRequest(BaseModel):
    prompt: str
    max_tokens: int = 100

class ClaudeResponse(BaseModel):
    response: str

@router.post("/claude", response_model=ClaudeResponse)
async def chat_with_claude(request: ClaudeRequest):
    try:
        response = client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=request.max_tokens,
            messages=[
                {"role": "user", "content": request.prompt}
            ]
        )
        if response.content:
            return ClaudeResponse(response=response.content)
        return ClaudeResponse(response="No response from Claude")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))