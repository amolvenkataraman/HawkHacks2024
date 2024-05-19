from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
from routers import user_wallet, dataset

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

origins = ['*']

app = FastAPI(debug=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(user_wallet.router)
app.include_router(dataset.router)

@app.get('/')
async def home():
    return "hello"


