from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from auth import verify_password
from schemas import UserCreate, UserInDB
from auth import get_password_hash, get_current_user
from database import users_collection
from datetime import datetime, timedelta
from jose import jwt
from config import settings
router = APIRouter()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

@router.post("/signup/")
async def create_user(user: UserCreate):
    existing_user = await users_collection.find_one({"$or": [{"username": user.username}, {"email": user.email}]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_db = UserInDB(**user.dict(), hashed_password=hashed_password)
    await users_collection.insert_one(user_db.dict())
    return {"message": "User created successfully"}

@router.post("/login/")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer","user": {
            "id": str(user.id),
            "username": user.username}}
    #UserCreate, UserInDB, or create_access_token ?