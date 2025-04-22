from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ZonaLanzamiento(BaseModel):
    id: int
    nombre: str

    class Config:
        orm_mode = True
