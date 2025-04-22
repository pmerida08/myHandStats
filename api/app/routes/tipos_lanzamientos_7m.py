from fastapi import APIRouter, HTTPException
from typing import List
from app.models.tipo_lanzamiento_7m import TipoLanzamiento7M
from app.supabase_client import supabase

router = APIRouter()

@router.get("/", response_model=List[TipoLanzamiento7M])
def listar_tipos_lanzamientos_7m():
    response = supabase.table("tipos_lanzamientos_7m").select("*").execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail="Error al obtener los tipos de lanzamientos 7M")
    
    return response.data

