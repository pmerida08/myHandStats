from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Modelo para la entidad AccionesPartido
class AccionesPartido(BaseModel):
    id: int
    minuto: str
    jugadores_partido_id: int
    acciones_id: int
    fases_juego_id: int

    class Config:
        orm_mode = True

# Modelos para crear, actualizar, eliminar y leer datos de AccionesPartido
class AccionesPartidoCreate(BaseModel):
    minuto: str
    jugadores_partido_id: int
    acciones_id: int
    fases_juego_id: int

    class Config:
        orm_mode = True

# Modelo para actualizar datos de AccionesPartido (los campos son opcionales)
class AccionesPartidoUpdate(BaseModel):
    minuto: Optional[str] = None
    jugadores_partido_id: Optional[int] = None
    acciones_id: Optional[int] = None
    fases_juego_id: Optional[int] = None

    class Config:
        orm_mode = True

# Modelo para eliminar AccionesPartido (solo necesita el ID)
class AccionesPartidoDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True

# Modelo para la respuesta de AccionesPartido (para salida)
class AccionesPartidoOut(BaseModel):
    id: int
    minuto: str
    jugadores_partido_id: int
    acciones_id: int
    fases_juego_id: int

    class Config:
        orm_mode = True