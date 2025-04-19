from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Modelo para la creación de usuarios
class UsuarioCreate(BaseModel):
    nombre: str
    email: str
    password: str

    class Config:
        orm_mode = True

# Modelo para leer datos de usuarios (incluye todos los campos)
class Usuario(BaseModel):
    id: int
    nombre: str
    email: str
    password: str
    fecha_registro: datetime
    fecha_actualizacion: datetime

    class Config:
        orm_mode = True

# Modelo para actualizar datos de usuarios (los campos son opcionales)
class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

    class Config:
        orm_mode = True

# Modelo para eliminar usuarios (solo necesita el ID)
class UsuarioDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True

# Modelo para la respuesta de los usuarios (para salida)
class UsuarioOut(BaseModel):
    id: int
    nombre: str
    email: str
    fecha_registro: datetime
    fecha_actualizacion: datetime

    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    email: str
    password: str

