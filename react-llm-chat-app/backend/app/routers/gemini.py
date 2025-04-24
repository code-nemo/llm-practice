from fastapi import APIRouter, HTTPException
from google import genai
from dotenv import load_dotenv
import os
from app.storage_utils.chat_history import chat_history, save_chat_history
from app.models.llm import BaseLLMRequest, BaseLLMResponse

load_dotenv()

router = APIRouter()

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

generation_config = {"max_output_tokens": 100}


class GeminiRequest(BaseLLMRequest):
    """
    Request model specific to Gemini LLM.
    Inherits from BaseLLMRequest.
    """

    pass


class GeminiResponse(BaseLLMResponse):
    """
    Response model specific to Gemini LLM.
    Inherits from BaseLLMResponse.
    """

    pass


@router.post("/", response_model=GeminiResponse)
async def chat_with_gemini(request: GeminiRequest):
    try:
        # Maintain a chat history for each user
        user_id = request.username
        conversation_id = request.conversation_id

        # Initialize user and conversation if not present
        if user_id not in chat_history:
            chat_history[user_id] = {}
        if conversation_id not in chat_history[user_id]:
            chat_history[user_id][conversation_id] = []

        # Append the current prompt to the conversation's chat history
        chat_history[user_id][conversation_id].append(
            {"role": "user", "content": request.prompt}
        )

        # Generate response considering the chat history
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                message["content"] for message in chat_history[user_id][conversation_id]
            ],
        )

        # Append the response to the chat history
        if response.text:
            chat_history[user_id][conversation_id].append(
                {"role": "assistant", "content": response.text}
            )
            save_chat_history(chat_history)
            return GeminiResponse(response=response.text)
        return GeminiResponse(response="No response from Gemini")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
