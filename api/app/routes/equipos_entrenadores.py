from fastapi import APIRouter, HTTPException
from typing import List
from app.models.equipo_entrenador import EquipoEntrenador, EquipoEntrenadorCreate, EquipoEntrenadorUpdate, EquipoEntrenadorOut
from app.supabase_client import supabase


router = APIRouter()

@router.post("/", response_model=EquipoEntrenadorOut)
def crear_equipo_entrenador(equipo_entrenador: EquipoEntrenadorCreate):
    response = supabase.table("equipos_entrenadores").insert(equipo_entrenador.dict()).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al crear el equipo_entrenador: {response.error.message}")

    return response.data[0]

# @router.get("/", response_model=List[EquipoEntrenador])
# def obtener_equipos_entrenadores():
#     response = supabase.table("equipo_entrenador").select("*, equipo_id:equipos(nombre), entrenador_id:entrenadores(nombre)").execute()

#     if getattr(response, "error", None):
#         raise HTTPException(status_code=400, detail=f"Error al obtener los equipos_entrenadores: {response.error.message}")

#     return response.data

@router.get("/{id}", response_model=EquipoEntrenadorOut)
def obtener_equipo_entrenador(id: int):
    response = supabase.table("equipos_entrenadores").select("*, equipo_id:equipos(nombre), entrenador_id:entrenadores(nombre)").eq("id", id).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(status_code=404, detail="EquipoEntrenador no encontrado")

    equipo_entrenador = response.data[0]
    return equipo_entrenador

# @router.delete("/{id}")
# def eliminar_equipo_entrenador(id: int):
#     response = supabase.table("equipos_entrenadores").delete().eq("id", id).execute()

#     if getattr(response, "error", None):
#         raise HTTPException(status_code=400, detail=f"Error al eliminar el equipo_entrenador: {response.error.message}")

#     if response.data == 0:
#         raise HTTPException(status_code=404, detail="EquipoEntrenador no encontrado")

#     return {"message": "EquipoEntrenador eliminado correctamente"}

@router.put("/{id}", response_model=EquipoEntrenadorOut)
def actualizar_equipo_entrenador(id: int, equipo_entrenador: EquipoEntrenadorUpdate):
    # Convertimos a diccionario y eliminamos campos no enviados
    datos_actualizados = equipo_entrenador.dict(exclude_unset=True)

    if not datos_actualizados:
        raise HTTPException(status_code=400, detail="No se proporcionaron datos para actualizar")

    # Comprobamos si el equipo_entrenador existe
    equipo_entrenador_existente = supabase.table("equipos_entrenadores").select("id").eq("id", id).execute()
    if not equipo_entrenador_existente.data:
        raise HTTPException(status_code=404, detail="EquipoEntrenador no encontrado")

    # Actualizamos el equipo_entrenador
    response = supabase.table("equipos_entrenadores").update(datos_actualizados).eq("id", id).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al actualizar el equipo_entrenador: {response.error.message}")

    return response.data[0]
