from pydantic import BaseModel
from typing import Optional

# Modelo para la gestión de acciones en fases de juego
class AccionFase(BaseModel):
    acciones_partido_id: int
    fase_juego_id: int

    class Config:
        orm_mode = True

# Modelos para crear, actualizar, eliminar y leer datos de AccionFase
class AccionFaseCreate(BaseModel):
    acciones_partido_id: int
    fase_juego_id: int

    class Config:
        orm_mode = True

# Modelo para actualizar datos de AccionFase (los campos son opcionales)
class AccionFaseUpdate(BaseModel):
    acciones_partido_id: Optional[int] = None
    fase_juego_id: Optional[int] = None

    class Config:
        orm_mode = True

# Modelo para eliminar AccionFase (solo necesita los IDs)
class AccionFaseDelete(BaseModel):
    acciones_partido_id: int
    fase_juego_id: int

    class Config:
        orm_mode = True

# Modelo para la respuesta de AccionFase (para salida)
class AccionFaseOut(BaseModel):
    acciones_partido_id: int
    fase_juego_id: int

    class Config:
        orm_mode = True