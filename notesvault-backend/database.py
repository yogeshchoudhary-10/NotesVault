from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
#create config file
print("MongoDB URL:", settings.MONGODB_URL)
client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client.notesvault
users_collection = db.users
notes_collection = db.notes
# mongodb db structure notesvault -> (users,notes)

