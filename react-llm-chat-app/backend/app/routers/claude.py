from fastapi import APIRouter, HTTPException
from app.models.llm import BaseLLMRequest, BaseLLMResponse
from anthropic import Anthropic
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Initialize Anthropic client
client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
mongo_client = MongoClient(MONGO_URI)
db = mongo_client["react_chat_app"]  # Database name
chat_collection = db["chat_history"]  # Collection name


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
        # Retrieve or initialize chat history for the user and conversation
        user_id = request.username
        conversation_id = request.conversation_id

        # Find the user's chat history in MongoDB
        user_chat = chat_collection.find_one({"username": user_id})

        if not user_chat:
            # Initialize chat history if the user does not exist
            chat_collection.insert_one(
                {"username": user_id, "conversations": {conversation_id: []}}
            )
            chat_history = []
        else:
            # Retrieve the conversation history if it exists
            chat_history = user_chat["conversations"].get(conversation_id, [])

        # Append the current prompt to the conversation's chat history
        chat_history.append({"role": "user", "content": request.prompt})

        # Concatenate the chat history into a single prompt string
        prompt = "\n".join(
            f"{message['role']}: {message['content']}" for message in chat_history
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
            chat_history.append({"role": "assistant", "content": assistant_message})

            # Update the conversation in MongoDB
            chat_collection.update_one(
                {"username": user_id},
                {"$set": {f"conversations.{conversation_id}": chat_history}},
            )

            return ClaudeResponse(response=assistant_message)

        return ClaudeResponse(response="No response from Claude")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
