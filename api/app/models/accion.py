from pydantic import BaseModel

class Accion(BaseModel):
    id: int
    nombre: str
    tipo_accion: str

    class Config:
        orm_mode = True

class AccionOut(BaseModel):
    id: int
    nombre: str
    tipo_accion: str

    class Config:
        orm_mode = True
