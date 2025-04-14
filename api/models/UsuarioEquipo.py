class UsuarioEquipoBase(BaseModel):
    usuario_id: str
    equipo_id: str

class UsuarioEquipoCreate(UsuarioEquipoBase):
    pass

class UsuarioEquipo(UsuarioEquipoBase):
    id: str = Field(default_factory=str, alias="_id")
