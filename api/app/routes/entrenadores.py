from fastapi import APIRouter, HTTPException
from typing import List
from app.models.entrenador import Entrenador, EntrenadorCreate, EntrenadorUpdate, EntrenadorDelete, EntrenadorOut
from app.supabase_client import supabase

router = APIRouter()

# @router.get("/", response_model=List[Entrenador])
# def get_entrenadores():
#     response = supabase.table("entrenadores").select("*").execute()

#     if getattr (response, "error", None):
#         raise HTTPException(status_code=400, detail=f"Error al obtener los entrenadores: {response.error.message}")

#     return response.data



# @router.post("/", response_model=EntrenadorOut)
# def crear_entrenador(entrenador: EntrenadorCreate):
#     response = supabase.table("entrenadores").insert(entrenador.dict()).execute()

#     if getattr (response, "error", None):
#         raise HTTPException(status_code=400, detail=f"Error al crear el entrenador: {response.error.message}")

#     return response.data[0]

@router.delete("/{entrenador_id}")
def eliminar_entrenador(entrenador_id: int):
    response = supabase.table("entrenadores").delete().eq("id", entrenador_id).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al eliminar el entrenador: {response.error.message}")

    if response.data == 0:
        raise HTTPException(status_code=404, detail="Entrenador no encontrado")

    return {"message": "Entrenador eliminado correctamente"}

@router.put("/{id}")
def actualizar_entrenador(id: int, entrenador: EntrenadorUpdate):
    datos_actualizados = entrenador.dict(exclude_unset=True)

    if not datos_actualizados:
        raise HTTPException(status_code=400, detail="No se proporcionaron datos para actualizar")
    
    entrenador_existente = supabase.table("entrenadores").select("*").eq("id", id).execute()
    if not entrenador_existente.data or len(entrenador_existente.data) == 0:
        raise HTTPException(status_code=404, detail="Entrenador no encontrado")
    
    try:
        respuesta = supabase.table("entrenadores").update(datos_actualizados).eq("id", id).execute()
        if getattr(respuesta, "error", None):
            raise HTTPException(status_code=400, detail=f"Error al actualizar el entrenador: {respuesta.error.message}")
        
        return {"message": "Entrenador actualizado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")