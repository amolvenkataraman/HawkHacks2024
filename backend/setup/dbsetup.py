import os
from pymongo import MongoClient, collection
import certifi
from dotenv import load_dotenv
from pathlib import Path

# Load the .env file in the environment
if Path('.env').exists(): load_dotenv((Path() / Path('.env')))

"""
Setup the DB
"""
uri = os.environ["MONGO_CONNECTION_STRING"]

# Create a MongoClient with a MongoClientOptions object to set the Stable API version
cluster = MongoClient(uri, ssl=True, tlsCAFile=certifi.where())
db = cluster["hawkhacksdb"]

def get_users_collection() -> collection.Collection:
    return db.get_collection('users')

def get_jobs_collection() -> collection.Collection:
    return db.get_collection('jobs')

def get_dataset_collection() -> collection.Collection:
    return db.get_collection('dataset')
