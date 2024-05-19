import gridfs
from bson import ObjectId
from .dbsetup import db
import base64

def convert_base64_image_to_bytes(img: str) -> bytes:
    return base64.b64decode(img)

def convert_bytes_image_to_base64(img: bytes) -> str:
    return base64.b64encode(img).decode()

def store_image_in_db(img: str) -> str:
    """
    This will upload an image to the database and return the ID.
    
    img is in base64

    **MAKE SURE TO STORE THE ID FOR RETRIEVAL/DELETION**
    """
    fs = gridfs.GridFS(db)
    return str(fs.put(img))

def delete_stored_image(image_id: str) -> bool:
    fs = gridfs.GridFS(db)
    
    object_id = ObjectId(image_id)
    try:
         fs.delete(object_id)
         return True
    except Exception as e:
        return False
    
def get_image(image_id: str) -> bytes | None:
    fs = gridfs.GridFS(db)
    object_id = ObjectId(image_id)
    file = fs.get(object_id)
    
    if not file: return None
    
    return file.read()
