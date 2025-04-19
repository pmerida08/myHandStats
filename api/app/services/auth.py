# app/services/auth.py
import bcrypt
import jwt
from datetime import datetime, timedelta
from app.config import SECRET_KEY

def verificar_password(hashed_password: str, plain_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def generar_token(usuario_id: int) -> str:
    expiration = datetime.utcnow() + timedelta(hours=1)
    payload = {
        "sub": usuario_id,
        "exp": expiration
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
