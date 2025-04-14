class UsuarioBase(BaseModel):
    nombre: str
    email: str
    contrasena: str  # hashed
    fecha_registro: Optional[str] = None
    fecha_actualizacion: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    pass

class Usuario(UsuarioBase):
    id: str = Field(default_factory=str, alias="_id")
