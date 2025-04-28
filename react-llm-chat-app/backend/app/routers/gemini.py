from fastapi import APIRouter, HTTPException
from google import genai
from app.models.llm import BaseLLMRequest, BaseLLMResponse
from pymongo import MongoClient
import os

router = APIRouter()

# Initialize Google Gemini client
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
mongo_client = MongoClient(MONGO_URI)
db = mongo_client["react_chat_app"]  # Database name
chat_collection = db["chat_history"]  # Collection name

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


@router.post("", response_model=GeminiResponse)
async def chat_with_gemini(request: GeminiRequest):
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

        # Generate response using the Gemini API
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[message["content"] for message in chat_history],
        )

        # Append the assistant's response to the chat history
        if response.text:
            assistant_message = response.text
            chat_history.append({"role": "assistant", "content": assistant_message})

            # Update the conversation in MongoDB
            chat_collection.update_one(
                {"username": user_id},
                {"$set": {f"conversations.{conversation_id}": chat_history}},
            )

            return GeminiResponse(response=assistant_message)

        return GeminiResponse(response="No response from Gemini")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
