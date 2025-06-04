# utils/email.py

import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def enviar_correo_establecer_contraseña(email: str, token: str):
    enlace = f"https://myhandstats.netlify.app/establecer-contraseña?token={token}"
    asunto = "Establece tu contraseña - MyHandStats"
    cuerpo = f"""Hola,

Has sido registrado en MyHandStats. Para establecer tu contraseña, haz clic en el siguiente enlace:

{enlace}

Este enlace expirará en 1 hora.

Si no solicitaste esto, ignora este correo.

Saludos,
El equipo de MyHandStats
"""

    mensaje = MIMEText(cuerpo)
    mensaje["Subject"] = asunto
    mensaje["From"] = SMTP_USER
    mensaje["To"] = email

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(mensaje)
            print("Correo enviado correctamente")
    except Exception as e:
        print("Error al enviar correo:", e)
        raise
