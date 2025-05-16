from fastapi import APIRouter, HTTPException 
from app.models.usuario import LoginRequest
from app.services.auth import generar_token, autenticar_usuario

router = APIRouter()

@router.post("/")
def login(data: LoginRequest):
    usuario = autenticar_usuario(data.email, data.password)
    
    if not usuario:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    
    token = generar_token(usuario["email"], usuario["id"], usuario["clubs_id"], usuario["rol"])
    return {"access_token": token, "token_type": "bearer"}