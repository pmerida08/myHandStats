class TipoLanzamiento7mBase(BaseModel):
    nombre: str  # arriba izquierda, medio derecha...
    tipo: str    # normal, calidad

class TipoLanzamiento7mCreate(TipoLanzamiento7mBase):
    pass

class TipoLanzamiento7m(TipoLanzamiento7mBase):
    id: str = Field(default_factory=str, alias="_id")
