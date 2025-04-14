from fastapi import APIRouter
from services.usuario_service import obtener_usuarios
from models.usuario import usuario
from typing import List

router = APIRouter()

@router.get("/usuarios", response_model=List[usuario])
async def get_usuarios():
    usuarios = obtener_usuarios()
    return usuarios
