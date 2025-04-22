from fastapi import APIRouter, HTTPException
from typing import List
from app.models.zona_lanzamiento import ZonaLanzamiento
from app.supabase_client import supabase

router = APIRouter()

@router.get("/", response_model=List[ZonaLanzamiento])
def listar_zonas_lanzamiento():
    response = supabase.table("zonas_lanzamiento").select("*").execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail="Error al obtener las zonas de lanzamiento")
    
    return response.data

