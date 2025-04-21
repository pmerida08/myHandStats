# app/main.py
from fastapi import FastAPI
from app.routes import usuarios, jugadores

app = FastAPI()

app.include_router(usuarios.router, prefix="/usuarios")
app.include_router(jugadores.router, prefix="/jugadores")
