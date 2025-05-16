from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.models.acciones import Acciones
from app.supabase_client import supabase

router = APIRouter()

@router.get("/", response_model=List[Acciones])
def obtener_acciones():
    """
    Obtener todas las acciones.
    """
    response = supabase.table("acciones").select("*").execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail="Error al obtener las acciones")

    return response.data

@router.get("/filtrar", response_model=List[Acciones])
def filtrar_acciones_por_tipo(tipo_accion: str = Query(..., description="Tipo de acción a filtrar")):
    """
    Filtrar acciones por tipo de acción.
    """
    response = supabase.table("acciones").select("*").eq("tipo_accion", tipo_accion).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail="Error al filtrar las acciones")

    if not response.data:
        raise HTTPException(status_code=404, detail=f"No se encontraron acciones del tipo: {tipo_accion}")

    return response.data