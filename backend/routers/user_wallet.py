from fastapi import APIRouter, status, HTTPException, Depends
from propelauth_fastapi import User
from setup.authsetup import auth
from setup.dbsetup import db

"""
This file will setup the basics of a mongoDB User

*User*
id: UUID
wallet: array[str]
"""

router = APIRouter()

router.get("/verify_user", status_code=status.HTTP_200_OK)
async def verify_user(auth_user: User = Depends(auth.require_user)):
    """
    This will verify the user exists and that the **Wallet is attached to the account**
    
    Will create a user if they/them not made. 
    """
    try:
        users_collection = db['users']
        user = users_collection.find_one({ '_id': auth_user.user_id })
        
        print(auth_user.user_id)
        
    except Exception as e:
        raise HTTPException(400, detail=str(e))
    