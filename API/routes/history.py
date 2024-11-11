from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from datetime import datetime
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import AnalysisHistory

history_router = APIRouter()

class AnalysisHistoryCreate(BaseModel):
    patient_id: int
    result: int  # Hasil prediksi model
    timestamp: datetime

@history_router.post("/", response_model=AnalysisHistoryCreate)
async def add_analysis_history(history: AnalysisHistoryCreate, db: Session = Depends(get_db)):
    new_history = AnalysisHistory(
        patient_id=history.patient_id,
        result=history.result,
        timestamp=history.timestamp
    )
    db.add(new_history)
    db.commit()
    db.refresh(new_history)
    return new_history

@history_router.get("/patient/{patient_id}", response_model=List[AnalysisHistoryCreate])
async def get_patient_history(patient_id: int, db: Session = Depends(get_db)):
    history = db.query(AnalysisHistory).filter(AnalysisHistory.patient_id == patient_id).all()
    if not history:
        raise HTTPException(status_code=404, detail="History not found for this patient")
    return history
