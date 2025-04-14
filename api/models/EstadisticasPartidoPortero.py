class EstadisticaPorteroBase(BaseModel):
    partido_id: str
    paradas: int
    tiros_recibidos: int
    porcentaje_paradas: float
    goles: int
    pases_errados: int
    lanzamiento_7m: int
    lanzamiento_exterior: int
    lanzamiento_penetracion: int
    lanzamiento_pivote: int
    lanzamiento_extremo: int

class EstadisticaPorteroCreate(EstadisticaPorteroBase):
    pass

class EstadisticaPortero(EstadisticaPorteroBase):
    id: str = Field(default_factory=str, alias="_id")
