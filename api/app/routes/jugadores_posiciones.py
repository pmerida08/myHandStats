from fastapi import APIRouter, HTTPException
from typing import List
from app.models.jugador_posicion import JugadorPosicion, JugadorPosicionCreate, JugadorPosicionUpdate, JugadorPosicionOut
from app.supabase_client import supabase

# Importar el cliente de Supabase
router = APIRouter()

# Endpoint para listar todas las relaciones entre jugadores y posiciones
@router.get("/", response_model=List[JugadorPosicion])
def get_jugador_posicion():
    response = supabase.table("jugador_posicion").select("*, jugador_id:jugadores(nombre), posicion_id:posiciones(nombre)").execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al obtener los Jugadores y Posiciones: {response.error.message}")

    return response.data

# Endpoint para obtener una relación específica entre un jugador y su posición
@router.get("/{jugador_id}", response_model=JugadorPosicionOut)
def obtener_jugador_posicion(jugador_id: int):
    response = supabase.table("jugador_posicion").select("*, jugador_id:jugadores(nombre), posicion_id:posiciones(nombre)").eq("jugador_id", jugador_id).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")

    jugador_posicion = response.data[0]
    return jugador_posicion

# Endpoint para crear una nueva relación entre un jugador y una posición 
@router.post("/", response_model=JugadorPosicionOut)
def crear_jugador_posicion(jugador_posicion: JugadorPosicionCreate):
    response = supabase.table("jugador_posicion").insert(jugador_posicion.dict()).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al crear la relación: {response.error.message}")

    return response.data[0]

# Endpoint para eliminar una relación entre un jugador y su posición
@router.delete("/{jugador_id}")
def eliminar_jugador_posicion(jugador_id: int):
    response = supabase.table("jugador_posicion").delete().eq("jugador_id", jugador_id).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al eliminar la relación: {response.error.message}")

    if response.data == 0:
        raise HTTPException(status_code=404, detail="Relación no encontrada")

    return {"message": "Relación eliminada correctamente"}

# Endpoint para actualizar una relación entre un jugador y su posición
@router.put("/{jugador_id}")
def actualizar_jugador_posicion(jugador_id: int, jugador_posicion: JugadorPosicionUpdate):
    # Convertimos a diccionario y eliminamos campos no enviados
    datos_actualizados = jugador_posicion.dict(exclude_unset=True)

    if not datos_actualizados:
        raise HTTPException(status_code=400, detail="No se proporcionaron datos para actualizar")

    # Comprobamos si la relación existe
    relacion_existente = supabase.table("jugador_posicion").select("jugador_id").eq("jugador_id", jugador_id).execute()
    if not relacion_existente.data:
        raise HTTPException(status_code=404, detail="Relación no encontrada")

    response = supabase.table("jugador_posicion").update(datos_actualizados).eq("jugador_id", jugador_id).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al actualizar la relación: {response.error.message}")

    return response.data[0]