from pydantic import BaseModel, EmailStr
from datetime import datetime
from bson import ObjectId
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    hashed_password: str
    disabled: bool = False

class NoteBase(BaseModel):
    filename: str
    content: str
    file_path: str  # Path to stored file
class NoteCreate(NoteBase):
    pass

class Note(NoteBase):
    id: str
    user_id: str
    upload_date: datetime