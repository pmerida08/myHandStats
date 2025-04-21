from fastapi import APIRouter, HTTPException
from typing import List
from app.models.jugador import Jugador, JugadorCreate, JugadorUpdate, JugadorOut
from app.supabase_client import supabase

router = APIRouter()

@router.get("/", response_model=List[Jugador])
def get_jugadores():
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

@router.post("/", response_model=JugadorOut)
def crear_jugador(jugador: JugadorCreate):
    response = supabase.table("jugadores").insert(jugador.dict()).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al crear el jugador: {response.error.message}")

    return response.data[0]

@router.delete("/{id}")
def eliminar_jugador(id: int):
    response = supabase.table("jugadores").delete().eq("id", id).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al eliminar el jugador: {response.error.message}")

    if response.data == 0:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")

    return {"message": "Jugador eliminado correctamente"}

@router.put("/{id}")
def actualizar_jugador(id: int, jugador: JugadorUpdate):
    # Convertimos a diccionario y eliminamos campos no enviados
    datos_actualizados = jugador.dict(exclude_unset=True)

    if not datos_actualizados:
        raise HTTPException(status_code=400, detail="No se proporcionaron datos para actualizar")

    # Comprobamos si el jugador existe
    jugador_existente = supabase.table("jugadores").select("id").eq("id", id).execute()
    if not jugador_existente.data:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")

    # Hacemos el update
    try:
        respuesta = supabase.table("jugadores").update(datos_actualizados).eq("id", id).execute()
        return {"mensaje": "Jugador actualizado correctamente", "datos": respuesta.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar jugador: {str(e)}")