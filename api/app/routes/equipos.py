from fastapi import APIRouter, HTTPException
from typing import List
from app.models.equipo import Equipo, EquipoCreate, EquipoUpdate, EquipoDelete, EquipoOut
from app.supabase_client import supabase

router = APIRouter()

@router.get("/", response_model=List[Equipo])
def get_equipos():
    response = supabase.table("equipos").select("*").execute()

    if getattr (response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al obtener los usuarios: {response.error.message}")

    return response.data
        
@router.get("/{equipo_id}", response_model=EquipoOut)
def obtener_equipo(equipo_id: int):
    response = supabase.table("equipos").select("*").eq("id", equipo_id).execute()

    if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Equipo no encontrado")

    equipo = response.data[0]
    return equipo

@router.post("/", response_model=EquipoOut)
def crear_equipo(equipo: EquipoCreate):
    response = supabase.table("equipos").insert(equipo.dict()).execute()

    if getattr (response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al crear el equipo: {response.error.message}")

    return response.data[0]

@router.delete("/{equipo_id}")
def eliminar_equipo(equipo_id: int):
    response = supabase.table("equipos").delete().eq("id", equipo_id).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al eliminar el jugador: {response.error.message}")

    if response.data == 0:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")

    return {"message": "Equipo eliminado correctamente"}

@router.put("/{id}")
def actualizar_equipo(id: int, equipo: EquipoUpdate):
    datos_actualizados = equipo.dict(exclude_unset=True)

    if not datos_actualizados:
        raise HTTPException(status_code=400, detail="No se proporcionaron datos para actualizar")
    
    equipo_existente = supabase.table("equipos").select("*").eq("id", id).execute()
    if not equipo_existente.data or len(equipo_existente.data) == 0:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    try:
        respuesta = supabase.table("equipos").update(datos_actualizados).eq("id", id).execute()
        return {"mensaje": "Equipo actualizado correctamente", "datos_actualizados": respuesta.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar el equipo: {str(e)}")