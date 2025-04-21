from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Jugador(BaseModel):
    id: int
    nombre: str
    dorsal: int
    posicion: int
    foto: Optional[str] = None
    fecha_nacimiento: Optional[datetime] = None  # Permite None
    fecha_registro: Optional[datetime] = None  # Permite None
    fecha_actualizacion: Optional[datetime] = None  # Permite None

    class Config:
        orm_mode = True

class JugadorCreate(BaseModel):
    nombre: str
    dorsal: int
    posicion: str
    fecha_nacimiento: datetime

    class Config:
        orm_mode = True

class JugadorUpdate(BaseModel):
    nombre: Optional[str] = None
    dorsal: Optional[int] = None
    posicion: Optional[str] = None
    fecha_nacimiento: Optional[datetime] = None

    class Config:
        orm_mode = True

class JugadorDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True

class JugadorOut(BaseModel):
    id: int
    nombre: str
    dorsal: int
    posicion: str
    fecha_nacimiento: datetime
    fecha_registro: datetime
    fecha_actualizacion: datetime

    class Config:
        orm_mode = True
