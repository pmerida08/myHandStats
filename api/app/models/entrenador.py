from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Entrenador(BaseModel):
    id: int
    nombre: str
    apellidos: str
    email: str
    telefono: str
    usuario_id: int

    class Config:
        orm_mode = True

class EntrenadorCreate(BaseModel):
    nombre: str
    apellidos: str
    email: str
    telefono: str
    usuario_id: int

    class Config:
        orm_mode = True
    
class EntrenadorUpdate(BaseModel):
    nombre: Optional[str] = None
    apellidos: Optional[str] = None
    email: Optional[str] = None
    telefono: Optional[str] = None
    usuario_id: Optional[int] = None

    class Config:
        orm_mode = True

class EntrenadorDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True

class EntrenadorOut(BaseModel):
    id: int
    nombre: str
    apellidos: str
    email: str
    telefono: str
    usuario_id: int

    class Config:
        orm_mode = True
