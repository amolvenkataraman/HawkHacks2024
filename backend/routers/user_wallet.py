from fastapi import APIRouter, status, HTTPException, Depends
from propelauth_fastapi import User
from setup.authsetup import auth
from setup.dbsetup import get_users_collection
from pydantic import BaseModel

"""
This file will setup the basics of a mongoDB User

*User*
id: UUID
wallet: array[str]
money_owed: float
"""

router = APIRouter(prefix='/users')

@router.get("/verifyuser", status_code=status.HTTP_200_OK)
async def verify_and_create_user(auth_user: User = Depends(auth.require_user)):
    """
    This will verify the user exists and that the **Wallet is attached to the account**
    
    Will create a user if they/them not made. 
    """
    try:
        users_collection = get_users_collection()
        user: dict = users_collection.find_one({ '_id': auth_user.user_id })
        
        if user and len(user['wallets']) > 0:
            return
        
        # Check if none, then create the new user
        if not user: users_collection.insert_one({'_id': auth_user.user_id, 'wallets': [], 'money_owed': 0})
        
        raise HTTPException(400, detail="User needs to add a wallet")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(400, detail=str(e))


class GetMoneyOwed(BaseModel):
    balance: float

@router.get('/balance', response_model=GetMoneyOwed)
def get_money_owed(auth_user: User = Depends(auth.require_user)):
    users_collection = get_users_collection()
    user: dict = users_collection.find_one({ '_id': auth_user.user_id })
    
    if not user: raise HTTPException(400, detail="Need to verify user before accessing")
    
    return GetMoneyOwed(balance=user['money_owed'])
    

class Wallet(BaseModel):
    wallet: str
    
class GetWallet(BaseModel):
    wallets: list[str]    
    
    
@router.get('/wallet', response_model=GetWallet)
def get_wallet(auth_user: User = Depends(auth.require_user)):
    users_collection = get_users_collection()
    user: dict = users_collection.find_one({ '_id': auth_user.user_id })
    
    if not user: raise HTTPException(400, detail="Need to verify user before accessing")

    return GetWallet(wallets=user['wallets'])

@router.post('/wallet', status_code=200)
def create_wallet(payload: Wallet, auth_user: User = Depends(auth.require_user)):
    users_collection = get_users_collection()
    user: dict = users_collection.find_one({ '_id': auth_user.user_id })
    
    if not user: raise HTTPException(400, detail="Need to verify user before accessing")
    
    wallets: list[str] = user['wallets']
    wallets.append(payload.wallet)
    
    users_collection.update_one({ '_id': auth_user.user_id }, {'$set': {'wallets': wallets}})
    
@router.delete('/wallet/{wallet_id}', status_code=200)
def delete_Wallet(wallet_id: str, auth_user: User = Depends(auth.require_user)):
    users_collection = get_users_collection()
    user: dict = users_collection.find_one({ '_id': auth_user.user_id })
    
    if not user: raise HTTPException(400, detail="Need to verify user before accessing")
    
    wallets: list[str] = user['wallets']
    
    if wallet_id not in wallets: raise HTTPException(404, "Wallet doesn't exist")
    
    wallets.remove(wallet_id)
    users_collection.update_one({ '_id': auth_user.user_id }, {'$set': {'wallets': wallets}})
