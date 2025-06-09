from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Modelo para la creación de usuarios
class UsuarioCreate(BaseModel):
    nombre: str
    email: str
    password: str
    rol: str
    foto: Optional[str] = None 

    class Config:
        orm_mode = True

# Modelo para leer datos de usuarios (incluye todos los campos)
class Usuario(BaseModel):
    id: int
    nombre: str
    email: str
    password: str
    rol: str
    foto: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Modelo para crear usuarios administradores (con campos específicos)
class CrearUsuarioAdminDTO(BaseModel):
    nombre: str
    email: str
    rol: str

    class Config:
        orm_mode = True

# Modelo para actualizar datos de usuarios (los campos son opcionales)
class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    rol: Optional[str] = None
    foto: Optional[str] = None  

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
    rol: str
    foto: Optional[str] = None  
    clubs_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Modelo para la solicitud de inicio de sesión y registro
class LoginRequest(BaseModel):
    email: str
    password: str

    class Config:
        orm_mode = True

# Modelo para la solicitud de registro de usuario
class RegisterRequest(BaseModel):
    nombre: str
    email: str
    password: str
    rol: str = "admin"
    foto: Optional[str] = None 

    class Config:
        orm_mode = True

# Modelo para establecer una nueva contraseña
class EstablecerContraseñaDTO(BaseModel):
    token: str
    nueva_contraseña: str
    
# Modelo para la solicitud de inicio de sesión con Google
class GoogleLoginRequest(BaseModel):
    credential: str
    
# Modelo para la solicitud de registro con Google
class GoogleRegisterRequest(BaseModel):
    credential: str