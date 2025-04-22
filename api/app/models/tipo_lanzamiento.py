from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TipoLanazamiento(BaseModel):
    id: int
    nombre: str

    class Config:
        orm_mode = True
        