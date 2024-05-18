from propelauth_fastapi import init_auth
import os
from pathlib import Path
from dotenv import load_dotenv

# Load the .env file in the environment
if Path('.env').exists(): load_dotenv((Path() / Path('.env')))

# user: User = Depends(auth.require_user) verifies and injects user from auth token
auth = init_auth("https://25870074.propelauthtest.com", os.environ["AUTH_API_KEY"])
