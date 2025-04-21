from fastapi import APIRouter, HTTPException
from typing import List
from app.models.jugador import Jugador, JugadorCreate, JugadorUpdate, JugadorOut
from app.supabase_client import supabase

router = APIRouter()

@router.get("/", response_model=List[Jugador])
async def get_jugadores():
    response = supabase.table("jugadores").select("*, posicion_id:posiciones(nombre)").execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al obtener los usuarios: {response.error.message}")

    return response.data

@router.get("/{id}", response_model=JugadorOut)
def obtener_jugador(id: int):
    response = supabase.table("jugadores").select("*, posicion_id:posiciones(nombre)").eq("id", id).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")

    jugador = response.data[0]
    return jugador
