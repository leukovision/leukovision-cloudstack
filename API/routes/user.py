from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.auth.auth import verify_token
from app.database.models import User

user_router = APIRouter()

class UserCreate(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None

@user_router.get("/users", response_model=List[UserCreate], dependencies=[Depends(verify_token)])
async def get_all_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@user_router.post("/users", response_model=UserCreate)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter((User.email == user.email) | (User.username == user.username)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    new_user = User(username=user.username, email=user.email, full_name=user.full_name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@user_router.put("/users/{user_id}", response_model=UserCreate)
async def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.id == user_id).first()
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.email:
        existing_user.email = user.email
    if user.full_name:
        existing_user.full_name = user.full_name
    db.commit()
    db.refresh(existing_user)
    return existing_user

@user_router.delete("/users/{user_id}")
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}
