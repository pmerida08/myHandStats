from pydantic import BaseModel
from typing import Optional

# Modelo para la entidad JugadorPosicion
class JugadorPosicion(BaseModel):
    jugador_id: int
    posicion_id: int

    class Config:
        orm_mode = True

# Modelos para crear, actualizar, eliminar y leer datos de JugadorPosicion
class JugadorPosicionCreate(BaseModel):
    jugador_id: int
    posicion_id: int

    class Config:
        orm_mode = True

# Modelo para actualizar datos de JugadorPosicion (los campos son opcionales)
class JugadorPosicionUpdate(BaseModel):
    jugador_id: Optional[int] = None
    posicion_id: Optional[int] = None

    class Config:
        orm_mode = True

# Modelo para eliminar JugadorPosicion (solo necesita los IDs)
class JugadorPosicionDelete(BaseModel):
    jugador_id: int
    posicion_id: int

    class Config:
        orm_mode = True

# Modelo para la respuesta de JugadorPosicion (para salida)
class JugadorPosicionOut(BaseModel):
    jugador_id: int
    posicion_id: int

    class Config:
        orm_mode = True