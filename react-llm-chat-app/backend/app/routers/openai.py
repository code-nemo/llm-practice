from fastapi import APIRouter, HTTPException
from app.models.llm import BaseLLMRequest, BaseLLMResponse
from pymongo import MongoClient
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
mongo_client = MongoClient(MONGO_URI)
db = mongo_client["react_chat_app"]  # Database name
chat_collection = db["chat_history"]  # Collection name


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

        # Generate response using the OpenAI API
        response = client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": message["role"], "content": message["content"]}
                for message in chat_history
            ],
            max_tokens=request.max_tokens,
        )

        # Append the assistant's response to the chat history
        if response.choices:
            assistant_message = response.choices[0].message["content"]
            chat_history.append({"role": "assistant", "content": assistant_message})

            # Update the conversation in MongoDB
            chat_collection.update_one(
                {"username": user_id},
                {"$set": {f"conversations.{conversation_id}": chat_history}},
            )

            return OpenAIResponse(response=assistant_message)

        return OpenAIResponse(response="No response from OpenAI")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
