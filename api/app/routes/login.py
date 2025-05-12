from fastapi import APIRouter, HTTPException , Depends
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from typing import List
from app.models.usuario import UsuarioCreate, UsuarioUpdate, UsuarioOut, LoginRequest
from app.supabase_client import supabase
from app.services.auth import verificar_password, generar_token, obtener_info_desde_token, autenticar_usuario
from app.utils.hashing import hash_password

router = APIRouter()

@router.post("/")
def login(data: LoginRequest):
    usuario = autenticar_usuario(data.email, data.password)
    
    if not usuario:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    
    token = generar_token(usuario["email"], usuario["id"], usuario["clubs_id"], usuario["rol"])
    return {"access_token": token, "token_type": "bearer"}