from pydantic import BaseModel
from typing import Optional

# Modelo para la entidad Entrenador
class Entrenador(BaseModel):
    id: int
    nombre: str
    email: str
    usuario_id: int

    class Config:
        orm_mode = True

# Modelos para crear, actualizar, eliminar y leer datos de Entrenador
class EntrenadorCreate(BaseModel):
    nombre: str
    email: str
    usuario_id: int

    class Config:
        orm_mode = True

# Modelo para actualizar datos de Entrenador (los campos son opcionales)   
class EntrenadorUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[str] = None
    usuario_id: Optional[int] = None

    class Config:
        orm_mode = True

# Modelo para eliminar Entrenador (solo necesita el ID)
class EntrenadorDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True

# Modelo para la respuesta de Entrenador (para salida)
class EntrenadorOut(BaseModel):
    id: int
    nombre: str
    email: str
    usuario_id: int

    class Config:
        orm_mode = True
