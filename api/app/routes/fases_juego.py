from fastapi import APIRouter, HTTPException
from typing import List
from app.models.fase_juego import FaseJuego
from app.supabase_client import supabase

# Importar el cliente de Supabase
router = APIRouter()

# Endpoint para listar todas las fases de juego
@router.get("/", response_model=List[FaseJuego])
def listar_fases_juego():

    response = supabase.table("fases_juego").select("*").execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail="Error al obtener las fases de juego")
    
    return response.data


