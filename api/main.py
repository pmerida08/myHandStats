from fastapi import FastAPI
from routes import usuario_routes

# Crear la instancia de FastAPI
app = FastAPI()

# Registrar las rutas
app.include_router(usuario_routes.router)
