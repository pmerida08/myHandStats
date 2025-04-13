from fastapi import APIRouter, HTTPException
from api.schemas.login import LoginRequest
from api.db import db  

router = APIRouter()

@router.post("/login")
async def login(data: LoginRequest):
    user = await db.usuarios.find_one({"email": data.email})
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    if user["password"] != data.password:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    
    return {
        "message": "Login exitoso",
        "usuario": {
            "nombre": user["nombre"],
            "rol": user["rol"],
            "email": user["email"]
        }
    }
