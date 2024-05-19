from fastapi import APIRouter, status, HTTPException, Depends
from propelauth_fastapi import User
from setup.authsetup import auth
from setup.dbsetup import get_jobs_collection
from pydantic import BaseModel

router = APIRouter(prefix="/jobs")

class Job(BaseModel):
    
    completed: bool

@router.get('', status_code=200)
def _____():
    pass
