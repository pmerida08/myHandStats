import os
from dotenv import load_dotenv
from supabase import create_client

# Carga el archivo .env (asegúrate de que la ruta es correcta)
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("SUPABASE_URL y SUPABASE_KEY deben estar configurados en el entorno")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)