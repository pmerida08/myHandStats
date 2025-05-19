from pydantic import BaseModel

class FaseJuego(BaseModel):
    id: int
    nombre: str

    class Config:
        orm_mode = True
        