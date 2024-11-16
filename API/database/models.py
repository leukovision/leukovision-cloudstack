from sqlalchemy import Column, String, Integer, ForeignKey, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from nanoid import generate  # Tambahkan nanoid untuk menghasilkan ID unik

Base = declarative_base()

# Fungsi untuk menghasilkan ID unik dengan awalan tertentu
def generate_user_id():
    return f"usr_{generate(size=16)}"

def generate_patient_id():
    return f"patient_{generate(size=16)}"

def generate_history_id():
    return f"history_{generate(size=16)}"

class User(Base):
    __tablename__ = "users"
    id_users = Column(String(21), primary_key=True, default=generate_user_id)  # Mengganti Integer dengan String dan menambahkan default
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class Patient(Base):
    __tablename__ = "patients"
    id_patient = Column(String(50), primary_key=True, default=generate_patient_id)  # Mengganti Integer dengan String dan menambahkan default
    name = Column(String, nullable=False)
    age = Column(Integer)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class AnalysisHistory(Base):
    __tablename__ = "analysis_history"
    id_history = Column(String(50), primary_key=True, default=generate_history_id)  # Mengganti Integer dengan String dan menambahkan default
    id_patient = Column(String(50), ForeignKey("patients.id_patient"))
    result = Column(Integer)
    timestamp = Column(TIMESTAMP)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
