from pydantic import BaseModel


class BaseLLMRequest(BaseModel):
    """
    Base model for LLM requests.
    Contains fields common to all LLMs.
    """

    prompt: str
    username: str
    conversation_id: str
    max_tokens: int = 100


class BaseLLMResponse(BaseModel):
    """
    Base model for LLM responses.
    Contains fields common to all LLMs.
    """

    response: str
