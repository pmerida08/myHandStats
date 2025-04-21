from fastapi import APIRouter, HTTPException
from typing import List
from app.models.jugador import Jugador, JugadorCreate, JugadorUpdate
from app.supabase_client import supabase

router = APIRouter()

@router.get("/", response_model=List[Jugador])
async def get_jugadores():
    response = supabase.table("jugadores").select("*, posicion_id:posiciones(nombre)").execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al obtener los usuarios: {response.error.message}")

    return response.data