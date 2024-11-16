from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from auth.auth import verify_token
from ml.model import predict_image
import numpy as np
import cv2

detection_router = APIRouter()

@detection_router.post("/analyze")
async def analyze_image(file: UploadFile = File(...), token: str = Depends(verify_token)):
    try:
        # Baca file gambar dari file upload
        image_bytes = await file.read()
        # Konversi bytes ke array
        np_img = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        
        # Resize dan preprocess gambar sesuai kebutuhan model
        image_resized = cv2.resize(image, (224, 224))  # Sesuaikan ukuran sesuai kebutuhan model
        result = predict_image(image_resized)
        
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
