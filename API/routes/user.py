from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from database.database import get_db
from database.models import User

user_router = APIRouter()

class UserCreate(BaseModel):
    username: str
    email: str
    full_name: str

class UserUpdate(BaseModel):
    username: str
    email: str
    full_name: str

@user_router.post("/", status_code=201)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    if not user.username or not user.email:
        raise HTTPException(status_code=400, detail="Gagal menambahkan pengguna. Mohon isi username dan email")
    existing_user = db.query(User).filter((User.email == user.email) | (User.username == user.username)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists.")

    new_user = User(username=user.username, email=user.email, full_name=user.full_name,
                    created_at=datetime.utcnow(), updated_at=datetime.utcnow())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@user_router.get("/")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return {"status": "success", "data": {"users": users}}

@user_router.get("/{id_users}")
def get_user(id_users: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id_users == id_users).first()
    if not user:
        raise HTTPException(status_code=404, detail="Pengguna tidak ditemukan")
    return {"status": "success", "data": user}

@user_router.put("/{id_users}")
def update_user(id_users: str, user_data: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id_users == id_users).first()
    if not user:
        raise HTTPException(status_code=404, detail="Pengguna tidak ditemukan")

    user.username = user_data.username
    user.email = user_data.email
    user.full_name = user_data.full_name
    user.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(user)
    return {"status": "success", "data": user}

@user_router.delete("/{id_users}")
def delete_user(id_users: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id_users == id_users).first()
    if not user:
        raise HTTPException(status_code=404, detail="Pengguna gagal dihapus. Id tidak ditemukan")
    db.delete(user)
    db.commit()
    return {"status": "success", "message": "Pengguna berhasil dihapus"}
