from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://josemayenp:X5VYC9dSiDbB3d3@myhandstats.dl3grol.mongodb.net/?retryWrites=true&w=majority&appName=myhandstats"
client = AsyncIOMotorClient(MONGO_URL)
db = client.myHandStats
