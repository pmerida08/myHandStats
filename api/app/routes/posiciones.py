from fastapi import APIRouter, HTTPException
from typing import List
from app.models.posicion import Posicion
from app.supabase_client import supabase

router = APIRouter()

@router.get("/", response_model=List[Posicion])
def listar_posiciones():
    response = supabase.table("posiciones").select("*").execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail="Error al obtener posiciones")
    return response.data