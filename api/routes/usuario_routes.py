from fastapi import APIRouter
from services.usuario_service import obtener_usuarios
from models.Usuario import Usuario
from typing import List

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "Bienvenido a la API de usuarios"}


@router.get("/usuarios", response_model=List[Usuario])
async def get_usuarios():
    usuarios = obtener_usuarios()
    return usuarios
