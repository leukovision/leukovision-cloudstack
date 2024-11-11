from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import Patient

patient_router = APIRouter()

class PatientCreate(BaseModel):
    name: str
    age: int

class PatientResponse(BaseModel):
    id_patient: int
    name: str
    age: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

@patient_router.post("/", response_model=PatientResponse)
async def add_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    new_patient = Patient(name=patient.name, age=patient.age)
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient

@patient_router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id_patient == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@patient_router.put("/{patient_id}", response_model=PatientResponse)
async def update_patient(patient_id: int, patient: PatientCreate, db: Session = Depends(get_db)):
    existing_patient = db.query(Patient).filter(Patient.id_patient == patient_id).first()
    if not existing_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    existing_patient.name = patient.name
    existing_patient.age = patient.age
    db.commit()
    db.refresh(existing_patient)
    return existing_patient

@patient_router.delete("/{patient_id}")
async def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id_patient == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()
    return {"message": "Patient deleted successfully"}
