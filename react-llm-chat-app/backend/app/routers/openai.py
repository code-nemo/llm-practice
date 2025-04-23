from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


class OpenAIRequest(BaseModel):
    prompt: str
    max_tokens: int = 100


class OpenAIResponse(BaseModel):
    response: str


@router.post("/openai", response_model=OpenAIResponse)
async def chat_with_openai(request: OpenAIRequest):
    try:
        response = client.chat.completions.create(
            model="gpt-4.1",
            messages=[{"role": "user", "content": request.prompt}],
            max_tokens=request.max_tokens,
        )
        return OpenAIResponse(response=response.choices[0].message["content"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
