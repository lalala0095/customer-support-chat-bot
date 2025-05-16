from pymongo import AsyncMongoClient
from dotenv import load_dotenv
import os
from google import genai

load_dotenv() # Load environment variables from .env file

MONGO_DB_URI = os.getenv("MONGO_DB_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")

mongodb_client = AsyncMongoClient(MONGO_DB_URI)
db = mongodb_client[MONGO_DB_NAME]

chats_collection = db["chats"]
support_tickets = db["support_tickets"]

gemini_api_key = os.getenv("GEMINI_API_KEY")
gemini_client = genai.Client(api_key=gemini_api_key)