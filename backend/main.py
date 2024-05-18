from fastapi import FastAPI, status
from propelauth_fastapi import init_auth, User
from dotenv import load_dotenv
from pathlib import Path
from pymongo import MongoClient, server_api
import os


"""
Setup auth function
"""
# Load the .env file in the environment
if Path(".env").exists():
    load_dotenv(Path(".env"))

# user: User = Depends(auth.require_user) verifies and injects user from auth token
auth = init_auth("https://25870074.propelauthtest.com", os.environ["AUTH_API_KEY"])


"""
Setup the db engine
"""
uri = os.environ["MONGO_CONNECTION_STRING"]

# Create a MongoClient with a MongoClientOptions object to set the Stable API version
client = MongoClient(uri, server_api=server_api.ServerApi(
    version='1', strict=True, deprecation_errors=True))


"""
Routes
"""

app = FastAPI()

    
    

