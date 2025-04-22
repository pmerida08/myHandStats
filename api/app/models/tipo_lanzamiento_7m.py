from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TipoLanzamiento7M(BaseModel):
    id: int
    nombre: str

    class Config:
        orm_mode = True
