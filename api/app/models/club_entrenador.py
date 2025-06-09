from pydantic import BaseModel
from typing import Optional

# Modelo para la entidad ClubEntrenador
class ClubEntrenador(BaseModel):
    club_id: int
    entrenador_id: int

    class Config:
        orm_mode = True

# Modelos para crear, actualizar, eliminar y leer datos de ClubEntrenador
class ClubEntrenadorCreate(BaseModel):
    club_id: int
    entrenador_id: int

    class Config:
        orm_mode = True

# Modelo para actualizar datos de ClubEntrenador (los campos son opcionales)
class ClubEntrenadorUpdate(BaseModel):
    club_id: Optional[int] = None
    entrenador_id: Optional[int] = None

    class Config:
        orm_mode = True

# Modelo para eliminar ClubEntrenador (solo necesita los IDs)
class ClubEntrenadorDelete(BaseModel):
    club_id: int
    entrenador_id: int

    class Config:
        orm_mode = True

# Modelo para la respuesta de ClubEntrenador (para salida)
class ClubEntrenadorOut(BaseModel):
    club_id: int
    entrenador_id: int

    class Config:
        orm_mode = True