from fastapi import APIRouter, HTTPException
from typing import List
from app.models.partido import Partido, PartidoCreate, PartidoUpdate, PartidoOut, PartidoDelete
from app.supabase_client import supabase
from datetime import datetime



router = APIRouter()


# @router.get("/", response_model=List[Partido])
# def get_partidos():
#     response = supabase.table("partidos").select("*").execute()
    
#     if getattr(response, "error", None):
#         raise HTTPException(status_code=400, detail=f"Error al obtener los Partidos: {response.error.message}")

#     return response.data
    

# @router.get("/{partido_id}", response_model=PartidoOut)
# def obtener_partido(partido_id: int):
#     response = supabase.table("partidos").select("*").eq("id", partido_id).execute()

#     if not response.data or len(response.data) == 0:
#         raise HTTPException(status_code=404, detail="Partido no encontrado")
    
#     partido = response.data[0]
#     return partido


# def serialize_datetime(value):
#     if isinstance(value, datetime):
#         return value.isoformat()
#     return value


# @router.delete("/{id}")
# def eliminar_partido(id: int):
#     response = supabase.table("partidos").delete().eq("id", id).execute()

#     if getattr(response, "error", None):
#         raise HTTPException(status_code=500, detail="Error al eliminar el partido")
   
#     if response.data == 0:
#         raise HTTPException(status_code=404, detail="Partido no encontrado")

#     return {"message": "Partido eliminado correctamente"}

# @router.put("/{id}")
# def actualizar_partido(id: int, partido: PartidoUpdate):
#     # Serializamos cada valor del modelo
#     partido_dict = {k: serialize_datetime(v) for k, v in partido.dict().items()}
    
#     response = supabase.table("partidos").update(partido_dict).eq("id", id).execute()

#     if getattr(response, "error", None):
#         raise HTTPException(status_code=500, detail="Error al actualizar el partido")
    
#     if response.data == 0:
#         raise HTTPException(status_code=404, detail="Partido no encontrado")

#     return response.data[0]