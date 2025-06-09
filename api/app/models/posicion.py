from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Modelo para la creación de posiciones
class Posicion(BaseModel):
    id: int
    nombre: str

    class Config:
        orm_mode = True

# Modelo para crear una nueva posición
class PosicionOut(BaseModel):
    id: int
    nombre: str

    class Config:
        orm_mode = True

