from fastapi import APIRouter, HTTPException
from app.models.llm import BaseLLMRequest, BaseLLMResponse
from dotenv import load_dotenv
from openai import OpenAI
import os
from app.storage_utils.chat_history import chat_history, save_chat_history

load_dotenv()

router = APIRouter()

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


class OpenAIRequest(BaseLLMRequest):
    """
    Request model specific to OpenAI LLM.
    Inherits from BaseLLMRequest.
    """

    pass


class OpenAIResponse(BaseLLMResponse):
    """
    Response model specific to OpenAI LLM.
    Inherits from BaseLLMResponse.
    """

    pass


@router.post("/", response_model=OpenAIResponse)
async def chat_with_openai(request: OpenAIRequest):
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
        response = client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": message["role"], "content": message["content"]}
                for message in chat_history[user_id][conversation_id]
            ],
            max_tokens=request.max_tokens,
        )

        # Append the response to the chat history
        if response.choices:
            assistant_message = response.choices[0].message["content"]
            chat_history[user_id][conversation_id].append(
                {"role": "assistant", "content": assistant_message}
            )
            save_chat_history(chat_history)
            return OpenAIResponse(response=assistant_message)
        return OpenAIResponse(response="No response from OpenAI")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
