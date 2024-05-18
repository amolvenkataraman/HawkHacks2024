from fastapi import FastAPI, status
from dotenv import load_dotenv
from pathlib import Path
from routers import user_wallet

import certifi
import os

"""
OS ENVIRONMENT

AUTH_API_KEY

MONGO_CONNECTION_STRING
"""

"""
Load environment 
"""
# Load the .env file in the environment
if (Path() / Path('.env')).exists(): load_dotenv((Path() / Path('.env')))


"""
Routes
"""

app = FastAPI()

app.include_router(user_wallet.router)

