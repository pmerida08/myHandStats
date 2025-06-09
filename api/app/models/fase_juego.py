from pydantic import BaseModel

# Modelo para la entidad FaseJuego
class FaseJuego(BaseModel):
    id: int
    nombre: str

    class Config:
        orm_mode = True
        