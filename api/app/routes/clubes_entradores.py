from fastapi import APIRouter, HTTPException
from typing import List
from app.models.jugador_partido import JugadorPartido, JugadorPartidoCreate, JugadorPartidoUpdate, JugadorPartidoOut
from app.supabase_client import supabase

router = APIRouter()

@router.get("/", response_model=List[JugadorPartido])
def get_jugadores_partidos():
    response = supabase.table("jugadores_partidos").select("*, jugador_id:jugadores(nombre), partido_id:partidos(fecha)").execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al obtener los JugadoresPartidos: {response.error.message}")

    return response.data

@router.get("/{id}", response_model=JugadorPartidoOut)
def obtener_jugador_partido(id: int):
    response = supabase.table("jugadores_partidos").select("*, jugador_id:jugadores(nombre), partido_id:partidos(fecha)").eq("id", id).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(status_code=404, detail="JugadorPartido no encontrado")

    jugador_partido = response.data[0]
    return jugador_partido

@router.post("/", response_model=JugadorPartidoOut)
def crear_jugador_partido(jugador_partido: JugadorPartidoCreate):
    response = supabase.table("jugadores_partidos").insert(jugador_partido.dict()).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al crear el jugador_partido: {response.error.message}")

    return response.data[0]

@router.delete("/{id}")
def eliminar_jugador_partido(id: int):
    response = supabase.table("jugadores_partidos").delete().eq("id", id).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al eliminar el jugador_partido: {response.error.message}")

    if response.data == 0:
        raise HTTPException(status_code=404, detail="JugadorPartido no encontrado")

    return {"message": "JugadorPartido eliminado correctamente"}

@router.put("/{id}")
def actualizar_jugador_partido(id: int, jugador_partido: JugadorPartidoUpdate):
    # Convertimos a diccionario y eliminamos campos no enviados
    datos_actualizados = jugador_partido.dict(exclude_unset=True)

    if not datos_actualizados:
        raise HTTPException(status_code=400, detail="No se proporcionaron datos para actualizar")

    # Comprobamos si el jugador_partido existe
    jugador_partido_existente = supabase.table("jugadores_partidos").select("id").eq("id", id).execute()
    if not jugador_partido_existente.data:
        raise HTTPException(status_code=404, detail="JugadorPartido no encontrado")

    response = supabase.table("jugadores_partidos").update(datos_actualizados).eq("id", id).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al actualizar el jugador_partido: {response.error.message}")

    return response.data[0]
