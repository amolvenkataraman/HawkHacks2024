from fastapi import APIRouter, status

"""
This file will setup the basics of a mongoDB User

*User*
id: UUID
wallet: array[str]
"""

router = APIRouter()

router.get("/verify_user", status_code=status.HTTP_200_OK)
async def verify_user():
    """
    This will verify the user exists and that the **Wallet is attached to the account**
    
    Will create a user if they/them not made. 
    """