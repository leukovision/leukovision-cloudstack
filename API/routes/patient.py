from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import Patient
from datetime import datetime

patient_router = APIRouter()

class PatientCreate(BaseModel):
    name: str
    age: int

class PatientUpdate(BaseModel):
    name: str
    age: int

@patient_router.post("/", status_code=201)
def add_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    if not patient.name:
        raise HTTPException(status_code=400, detail="Gagal menambahkan pasien. Mohon isi nama pasien")
    new_patient = Patient(name=patient.name, age=patient.age, created_at=datetime.utcnow(), updated_at=datetime.utcnow())
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient

@patient_router.get("/")
def get_all_patients(db: Session = Depends(get_db)):
    patients = db.query(Patient).all()
    return {"status": "success", "data": {"patients": patients}}

@patient_router.get("/{id_patient}")
def get_patient(id_patient: str, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id_patient == id_patient).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Pasien tidak ditemukan")
    return {"status": "success", "data": patient}

@patient_router.put("/{id_patient}")
def update_patient(id_patient: str, patient_data: PatientUpdate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id_patient == id_patient).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Pasien tidak ditemukan")

    patient.name = patient_data.name
    patient.age = patient_data.age
    patient.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(patient)
    return {"status": "success", "data": patient}

@patient_router.delete("/{id_patient}")
def delete_patient(id_patient: str, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id_patient == id_patient).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Pasien gagal dihapus. Id tidak ditemukan")
    db.delete(patient)
    db.commit()
    return {"status": "success", "message": "Pasien berhasil dihapus"}
