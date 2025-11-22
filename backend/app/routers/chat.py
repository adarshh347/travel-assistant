from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.app.services.audio_service import transcribe_audio
from backend.app.services.chat_agent import get_chat_response
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str


# @router.post("/test-json")
# async def test_json(data: dict):
#     """
#     Simple test endpoint to confirm JSON routing works.
#     Input:  {"msg": "hi"}
#     Output: {"response": "yoo"}
#     """
#     return {"response": "yoo"}



@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    # Debug print to see if request hits the server
    print(f"Received file: {file.filename}, content_type: {file.content_type}")

    try:
        content = await file.read()

        # Pass filename to helper for correct extension handling
        text = transcribe_audio(content, filename=file.filename)

        return {"transcription": text}
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        # result is now {"response": "...", "weather_data": [...]}
        result = await get_chat_response(request.message)

        return {
            "response": result["response"],
            "weather_data": result["weather_data"]  # Passing this to frontend
        }
    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))