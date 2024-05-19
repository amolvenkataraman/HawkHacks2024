from typing import Any
from fastapi import APIRouter, status, HTTPException, Depends, Response
from propelauth_fastapi import User
from setup.authsetup import auth
from setup.dbsetup import get_dataset_collection, get_users_collection
from pydantic import BaseModel
from setup import storeimage as storeimg
from bson import ObjectId
import uuid

router = APIRouter(prefix="/dataset")

"""
import gridfs
from PIL import Image
import io
"""

class Dataset(BaseModel):
    """
    dataset:
    - _id: uuid
    - user (id)
    - list of images
    - list of annotated/unannotated for each image
    - complete/not
    dataset is complete when each image is annotated (dumb way to do it is just to loop through each image and check)
    
    Dataset is completed when images is empty
    """
    _id: str
    uid: str
    
    # We will store the id to these images as the keys and (imagetype and bool) to whether it's done
    images: dict[str, list]
    annotated_images: list[str] = [] # These will be links
    completed: bool = False
    
    
class GetDataset(BaseModel):
    """
    A list of IDs
    """
    dataset_id: str
    image_id_list: list[str]

@router.get('/first', response_model=GetDataset)
def get_first_dataset(auth_user: User = Depends(auth.require_user)):
    dataset_collection = get_dataset_collection()
    
    # Get the first non-completed dataset
    dataset = dataset_collection.find_one({'completed': False})
    if not dataset: raise HTTPException(404, "No datasets left!!!")
    
    print(dataset)
    
    uncompleted: list[str] = []
    
    for image_id, values in dataset['images'].items():
        if not values[1]: uncompleted.append(image_id)
        
    return GetDataset(dataset_id=str(dataset['_id']), image_id_list=uncompleted)


class GetImage(BaseModel):
    image: str

@router.get('/image/{dataset_id}/{image_id}')
def get_image_from_dataset(dataset_id: str, image_id: str, auth_user: User = Depends(auth.require_user)):
    """
    This allows the user to get an image from the front-end
    """
    collection = get_dataset_collection()
    
    object_id = ObjectId(dataset_id)
    dataset = collection.find_one({'_id': object_id})
    
    print(dataset)
    
    if not dataset: raise HTTPException(404, "Dataset not found")
    
    img = storeimg.get_image(image_id)
    if not img: raise HTTPException(404, "Can't find the image")
    
    return_image = dataset['images'][image_id][0] + storeimg.convert_bytes_image_to_base64(img)
    
    return GetImage(image=return_image)


class CreateDataset(BaseModel):
    "This is a list of base64 encoded images"
    images: list[str] 
    username: str
    password: str


@router.post('', response_model=Dataset)
def create_dataset(payload: CreateDataset, auth_user: User = Depends(auth.require_user)):
    """
    This creates a dataset. User is the admin
    """
    uid = auth_user.user_id
    _id = uuid.uuid4().hex
    
    if payload.username != "username" or payload.password != "password": raise HTTPException(401)
    
    collection = get_dataset_collection()
    image_map: dict[str, list] = {}
    
    for image in payload.images:
        encoding_split = image.find(',') # This is the formatting of the image
        formatting = image[0: encoding_split + 1]
        base_64_image = image[encoding_split + 1: ]
        
        image_in_bytes = storeimg.convert_base64_image_to_bytes(base_64_image)
        img_id = storeimg.store_image_in_db(image_in_bytes)
        image_map[img_id] = [formatting, False] # The new image is false
        
    dataset = Dataset(_id=_id, uid=uid, images=image_map)
    
    collection.insert_one(dataset.model_dump())
    return dataset


class GetAnnotated(BaseModel):
    image_links: list[str]
    datasets_and_finished: dict

@router.get('', response_model=GetAnnotated)
def get_admin_annotated(auth_user: User = Depends(auth.require_user)):
    dataset_collection = get_dataset_collection()
    
    datasets = dataset_collection.find({'uid': auth_user.user_id})
    if not datasets: raise HTTPException(404)
    
    print(datasets)
    
    ret = []
    datasets_and_finished = {}
    
    for dataset in datasets:
        print(dataset)
        images: list[str] = dataset['annotated_images']
        ret.extend(images)
        datasets_and_finished[str(dataset['_id'])] = dataset['completed']
    
    return GetAnnotated(image_links=ret, datasets_and_finished=datasets_and_finished)

class CreateAnnotated(BaseModel):
    dataset_id: str
    image_id: str
    
    coordinates: list[dict]
    

@router.post('/uploadannotated', status_code=200)
def upload_annotated_dataset(payload: CreateAnnotated, auth_user: User = Depends(auth.require_user)):
    users_collection = get_users_collection()
    dataset_collection = get_dataset_collection()
    
    object_id = ObjectId(payload.dataset_id)
    dataset = dataset_collection.find_one({'_id': object_id})
    
    if not dataset: raise HTTPException(404)
    
    image_map: dict = dataset['images']
    if not image_map.get(payload.image_id): raise HTTPException(404)
    
    image_map[1] = True
    completed = True
    
    # Check if all the maps are true not
    for image in dataset['images']:
        image: dict
        for value in image.values():
            if not value[1]: completed = False
            
        if not completed: break
        
    if completed: dataset_collection.update_one({'_id': object_id}, {'$set': {'completed': completed}})
    
    increment_factor = 0.03
    users_collection.update_one({'_id': auth_user.user_id}, {'$inc', {'money_owed', increment_factor}})
    
    