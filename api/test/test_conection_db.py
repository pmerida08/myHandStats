import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def test_connection():
    uri = "mongodb+srv://josemayenp:X5VYC9dSiDbB3d3@myhandstats.dl3grol.mongodb.net/?retryWrites=true&w=majority&appName=myhandstats"
    client = AsyncIOMotorClient(uri)

    try:
        # Obtener los nombres de las bases de datos como prueba
        dbs = await client.list_database_names()
        print("Conexión exitosa. Bases de datos encontradas:", dbs)
    except Exception as e:
        print("❌ Error al conectar:", e)

asyncio.run(test_connection())
