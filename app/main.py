from fastapi import FastAPI
from routes import detection, patient, history, user
from database.models import Base
from database.database import engine, init_db

app = FastAPI()

# Inisialisasi database
init_db()

# Registrasi semua router
app.include_router(detection.detection_router, prefix="/detection")
app.include_router(patient.patient_router, prefix="/patient")
app.include_router(history.history_router, prefix="/history")
app.include_router(user.user_router, prefix="/user")

@app.get("/")
async def root():
    return {"message": "Welcome to LeukoVision API"}
