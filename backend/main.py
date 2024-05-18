from fastapi import FastAPI, status
from propelauth_fastapi import init_auth, User
from dotenv import load_dotenv
from pathlib import Path
import os

# Load the .env file in the environment
load_dotenv(Path(".env"))

# user: User = Depends(auth.require_user) verifies and injects user from auth token
auth = init_auth("https://25870074.propelauthtest.com", os.environ["AUTH_API_KEY"])

app = FastAPI()


app.get("/verify_user", status_code=status.HTTP_202_ACCEPTED)

