from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import AnalysisHistory

history_router = APIRouter()

class AnalysisHistoryCreate(BaseModel):
    id_patient: str
    result: int
    timestamp: datetime

@history_router.post("/", status_code=201)
def add_analysis_history(history: AnalysisHistoryCreate, db: Session = Depends(get_db)):
    if not history.id_patient or history.result is None:
        raise HTTPException(status_code=400, detail="Gagal menambahkan riwayat analisis. Mohon isi id pasien dan hasil analisis")
    new_history = AnalysisHistory(id_patient=history.id_patient, result=history.result, timestamp=history.timestamp,
                                  created_at=datetime.utcnow(), updated_at=datetime.utcnow())
    db.add(new_history)
    db.commit()
    db.refresh(new_history)
    return new_history

@history_router.get("/")
def get_all_analysis_history(db: Session = Depends(get_db)):
    analysis_history = db.query(AnalysisHistory).all()
    return {"status": "success", "data": {"analysis_history": analysis_history}}

@history_router.get("/{id_history}")
def get_analysis_history(id_history: str, db: Session = Depends(get_db)):
    history = db.query(AnalysisHistory).filter(AnalysisHistory.id_history == id_history).first()
    if not history:
        raise HTTPException(status_code=404, detail="Riwayat analisis tidak ditemukan")
    return {"status": "success", "data": history}

@history_router.delete("/{id_history}")
def delete_analysis_history(id_history: str, db: Session = Depends(get_db)):
    history = db.query(AnalysisHistory).filter(AnalysisHistory.id_history == id_history).first()
    if not history:
        raise HTTPException(status_code=404, detail="Riwayat analisis gagal dihapus. Id tidak ditemukan")
    db.delete(history)
    db.commit()
    return {"status": "success", "message": "Riwayat analisis berhasil dihapus"}
