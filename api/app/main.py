# app/main.py
from fastapi import FastAPI
from app.routes import usuarios, jugadores, equipos, partidos

app = FastAPI()

app.include_router(usuarios.router, prefix="/usuarios")
app.include_router(jugadores.router, prefix="/jugadores")
app.include_router(equipos.router, prefix="/equipos")
app.include_router(partidos.router, prefix="/partidos")
