from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JugadorPosicion(BaseModel):
    jugador_id: int
    posicion_id: int

    class Config:
        orm_mode = True

class JugadorPosicionCreate(BaseModel):
    jugador_id: int
    posicion_id: int

    class Config:
        orm_mode = True

class JugadorPosicionUpdate(BaseModel):
    jugador_id: Optional[int] = None
    posicion_id: Optional[int] = None

    class Config:
        orm_mode = True

class JugadorPosicionDelete(BaseModel):
    jugador_id: int
    posicion_id: int

    class Config:
        orm_mode = True

class JugadorPosicionOut(BaseModel):
    jugador_id: int
    posicion_id: int

    class Config:
        orm_mode = True