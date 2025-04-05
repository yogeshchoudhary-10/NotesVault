from fastapi import APIRouter, UploadFile, File, Depends,HTTPException
from tempfile import TemporaryDirectory
from pdf2image import convert_from_path
import pytesseract
from PIL import Image, ImageEnhance
from database import notes_collection
from schemas import Note, NoteCreate
from auth import get_current_user
from datetime import datetime
from typing import List
from config import settings
import shutil
import uuid
from bson import ObjectId
import os
router = APIRouter(dependencies=[Depends(get_current_user)])

def preprocess_image(img):
    # Convert to grayscale
    img = img.convert("L")
    
    # Enhance contrast
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(2.0)
    
    # Thresholding
    img = img.point(lambda x: 0 if x < 128 else 255)
    return img

async def process_file(file_path,file_type):
        # Convert PDF to images
    if file_type == "application/pdf":
        images = convert_from_path(file_path)
    else:  # Handle images directly
        images = [Image.open(file_path)]
        
        # OCR Processing
    full_text = ""
    for img in images:
        processed_img = preprocess_image(img)
        text = pytesseract.image_to_string(processed_img)
        full_text += text + "\n"
        
    return full_text

async def save_upload_file(file: UploadFile, user_id: str) -> str:
    # Generate unique filename
    file_ext = file.filename.split(".")[-1]
    file_name = f"{user_id}_{uuid.uuid4()}.{file_ext}"
    file_path = settings.UPLOAD_DIR / file_name
    
    # Save file
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return str(file_path)

@router.post("/upload/")
async def upload_note(
    file: UploadFile = File(...), 
    user: dict = Depends(get_current_user)
):
# Save original file
    file_path = await save_upload_file(file, str(user["_id"]))
    extracted_text = await process_file(file_path,file.content_type )
    note_data = {
    **NoteCreate(filename=file.filename, content=extracted_text,file_path =file_path ).dict(),
    "user_id": user["_id"],
    "upload_date": datetime.now()
}

    result = await notes_collection.insert_one(note_data)
    return {"id": str(result.inserted_id), "file_path": file_path}
#how pyteseract be integrated with tesseract?

@router.get("/notes/",response_model=List[Note])
async def get_notes(
    skip: int = 0,
    limit: int = 10,
    user: dict = Depends(get_current_user)
):
    notes = await notes_collection.find(
        {"user_id": user["_id"]},
        skip=skip,
        limit=limit
    ).to_list(limit)
    return [Note(**{k: v for k, v in n.items() if k not in ["_id", "user_id"]},
        id=str(n["_id"]),
        user_id=str(n["user_id"])) for n in notes]
# how this be used to give the files,not just names
@router.delete("/notes/{note_id}/")
async def delete_note(note_id: str, user: dict = Depends(get_current_user)):
    note = await notes_collection.find_one({"_id": ObjectId(note_id)})
    if not note or note["user_id"] != user["_id"]:
        raise HTTPException(status_code=404, detail="Note not found")
    # Delete file
    try:
        os.remove(note["file_path"])
    except FileNotFoundError:
        pass
    await notes_collection.delete_one({"_id": ObjectId(note_id)})
    return {"message": "Note deleted"}

# Create text index in MongoDB
#db.notes.create_index([("content", "text")]) ,does include anything else
# remove user field for documents?

@router.get("/search/")
async def search_notes(
    query: str,
    user: dict = Depends(get_current_user)
):
    results = await notes_collection.aggregate([
    {
        "$search": {
            "index": "text_search",  # or the name of your custom search index
            "text": {
                "query": query,
                "path": "content",   # fields you've indexed
            }
        }
    },
    { "$match": { "user_id": user["_id"] } },  # secure by user
    { "$limit": 100 },
    {
        "$project": {
            "filename": 1,
            "file_path": 1,
            "content": 1,
            "score": { "$meta": "searchScore" }
        }
    },
    { "$sort": { "score": -1 } }
]).to_list(length=100)
    return [{
        "id": str(n["_id"]),
        "filename": n["filename"],
        "file_path" : n["file_path"],
        "snippet": " ".join(n["content"].split()[:50]) + "..."
    } for n in results]
# do we need snippet?
