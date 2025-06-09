from pydantic import BaseModel
from typing import Optional

# Modelo para la entidad EquipoEntrenador
class EquipoEntrenador(BaseModel):
    equipo_id: int
    entrenador_id: int
    rol: str

    class Config:
        orm_mode = True

# Modelos para crear, actualizar, eliminar y leer datos de EquipoEntrenador
class EquipoEntrenadorCreate(BaseModel):
    equipo_id: int
    entrenador_id: int
    rol: str

    class Config:
        orm_mode = True

# Modelo para actualizar datos de EquipoEntrenador (los campos son opcionales)
class EquipoEntrenadorUpdate(BaseModel):
    equipo_id: Optional[int] = None
    entrenador_id: Optional[int] = None
    rol: Optional[str] = None

    class Config:
        orm_mode = True

# Modelo para eliminar EquipoEntrenador (solo necesita los IDs)
class EquipoEntrenadorDelete(BaseModel):
    equipo_id: int
    entrenador_id: int

    class Config:
        orm_mode = True

# Modelo para la respuesta de EquipoEntrenador (para salida)
class EquipoEntrenadorOut(BaseModel):
    equipo_id: int
    entrenador_id: int
    rol: str

    class Config:
        orm_mode = True
        