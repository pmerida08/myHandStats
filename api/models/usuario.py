from pydantic import BaseModel, EmailStr

class Usuario(BaseModel):
    id: str
    nombre: str
    email: EmailStr
    password: str
    rol: str
    activo: bool

# class UserLogin(BaseModel):
#     email: EmailStr
#     password: str

# class UserResponse(BaseModel):
#     id: str
#     nombre: str
#     email: EmailStr
#     rol: str
#     activo: bool
