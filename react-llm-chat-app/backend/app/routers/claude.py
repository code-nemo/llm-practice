from fastapi import APIRouter, HTTPException
from app.models.llm import BaseLLMRequest, BaseLLMResponse
from dotenv import load_dotenv
from anthropic import Anthropic
import os
from app.storage_utils.chat_history import (
    chat_history,
    save_chat_history,
)  # Import shared utilities

load_dotenv()

# Initialize Anthropic client
client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

router = APIRouter()


class ClaudeRequest(BaseLLMRequest):
    """
    Request model specific to Claude LLM.
    Inherits from BaseLLMRequest.
    """

    pass


class ClaudeResponse(BaseLLMResponse):
    """
    Response model specific to Claude LLM.
    Inherits from BaseLLMResponse.
    """

    pass


@router.post("/", response_model=ClaudeResponse)
async def chat_with_claude(request: ClaudeRequest):
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

        # Concatenate the chat history into a single prompt string
        prompt = "\n".join(
            f"{message['role']}: {message['content']}"
            for message in chat_history[user_id][conversation_id]
        )

        # Generate response using the Anthropic API
        response = client.completions.create(
            model="claude-3",
            max_tokens_to_sample=request.max_tokens,
            prompt=prompt,  # Pass the concatenated prompt
        )

        # Append the response to the chat history
        if response.completion:
            assistant_message = response.completion
            chat_history[user_id][conversation_id].append(
                {"role": "assistant", "content": assistant_message}
            )
            save_chat_history(chat_history)
            return ClaudeResponse(response=assistant_message)
        return ClaudeResponse(response="No response from Claude")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
