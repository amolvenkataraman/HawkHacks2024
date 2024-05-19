from fastapi import APIRouter, status, HTTPException, Depends, Response
from propelauth_fastapi import User
from setup.authsetup import auth
from setup.dbsetup import get_dataset_collection, get_users_collection
from pydantic import BaseModel
from setup import storeimage as storeimg
import uuid

router = APIRouter("/dataset")

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
    _id: uuid.UUID
    uid: str
    
    # We will store the id to these images as the keys and (imagetype and bool) to whether it's done
    images: dict[str, list[str, bool]]
    annotated_images: list[str] = [] # These will be links
    completed: bool = False
    
class GetDataset(BaseModel):
    """
    A list of IDs
    """
    dataset_id: uuid.UUID
    image_id_list: list[str]

@router.get('/first', response_model=GetDataset)
def get_first_dataset(auth_user: User = Depends(auth.require_user)):
    dataset_collection = get_dataset_collection()
    
    # Get the first non-completed dataset
    to_validate = dataset_collection.find_one({'completed': False})
    if not to_validate: raise HTTPException(404, "No datasets left!!!")
    
    dataset: Dataset = Dataset.model_validate(dataset)
    
    uncompleted: list[str] = []
    
    for image_id, is_done in dataset.images.items():
        if not is_done: uncompleted.append(image_id)
        
    return GetDataset(dataset_id=dataset._id, image_id_list=uncompleted)


class GetImage(BaseModel):
    image: str

@router.get('/image/{dataset_id}/{image_id}')
def get_image_from_dataset(dataset_id: uuid.UUID, image_id: str, auth_user: User = Depends(auth.require_user)):
    """
    This allows the user to get an image from the front-end
    """
    collection = get_dataset_collection()
    to_validate = collection.find_one({'_id': dataset_id})
    
    dataset = Dataset.model_validate(to_validate)
    
    img = storeimg.get_image(image_id)
    if not img: raise HTTPException(404, "Can't find the image")
    
    return_image = dataset.images[image_id][0] + storeimg.convert_bytes_image_to_base64(img)
    
    return GetImage(image=return_image)


class CreateDataset(BaseModel):
    "This is a list of base64 encoded images"
    images: list[str] 


@router.post('', response_model=Dataset)
def create_dataset(payload: CreateDataset, auth_user: User = Depends(auth.require_user)):
    """
    This creates a dataset. User is the admin
    """
    uid = auth_user.user_id
    _id = uuid.uuid4()
    
    collection = get_dataset_collection()
    image_map: dict[str, bool] = {}
    
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


@router.post('/uploadannotated')
def upload_annotated_dataset(auth_user: User = Depends(auth.require_user)):
    users_collection = get_users_collection()
    dataset_collection = get_dataset_collection()
    
    increment_factor = 0.03
    user = users_collection.update_one({'_id': auth_user.user_id}, {'$inc', {'money_owed', increment_factor}})
    