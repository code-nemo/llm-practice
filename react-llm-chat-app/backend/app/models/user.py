from pydantic import BaseModel, EmailStr
class User(BaseModel):
    email: str
    password: str

class SignupUser(BaseModel):
    username: str
    password: str
    email: EmailStr  # Validate email format

class LoginUser(BaseModel):
    username: str
    password: str