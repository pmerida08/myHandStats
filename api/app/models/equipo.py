from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Equipo(BaseModel):
    id: int
    nombre: str
    id_usuario : int
    entrenador: str
    fecha_creacion: datetime

    class Config:
        orm_mode = True

class EquipoCreate(BaseModel):
    nombre: str
    id_usuario : int
    entrenador: str

    class Config:
        orm_mode = True

class EquipoUpdate(BaseModel):
    nombre: Optional[str] = None
    id_usuario : Optional[int] = None
    entrenador: Optional[str] = None

    class Config:
        orm_mode = True

class EquipoDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True

class EquipoOut(BaseModel):
    id: int
    nombre: str
    id_usuario : int
    entrenador: str
    fecha_creacion: datetime

    class Config:
        orm_mode = True

