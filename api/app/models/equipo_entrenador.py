from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EquipoEntrenador(BaseModel):
    equipo_id: int
    entrenador_id: int
    rol: str

    class Config:
        orm_mode = True
        
class EquipoEntrenadorCreate(BaseModel):
    equipo_id: int
    entrenador_id: int
    rol: str

    class Config:
        orm_mode = True

class EquipoEntrenadorUpdate(BaseModel):
    equipo_id: Optional[int] = None
    entrenador_id: Optional[int] = None
    rol: Optional[str] = None

    class Config:
        orm_mode = True

class EquipoEntrenadorDelete(BaseModel):
    equipo_id: int
    entrenador_id: int

    class Config:
        orm_mode = True

class EquipoEntrenadorOut(BaseModel):
    equipo_id: int
    entrenador_id: int
    rol: str

    class Config:
        orm_mode = True
        