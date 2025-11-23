from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
# non-deployable
# from backend.app.services.audio_service import transcribe_audio
# from backend.app.services.chat_agent import get_chat_response

# deployable
from app.services.audio_service import transcribe_audio
from app.services.chat_agent import get_chat_response



router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    try:
        content = await file.read()
        # Ensure your audio_service.py has language="ja" in the Groq call
        text = transcribe_audio(content, filename=file.filename)
        return {"transcription": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        # ✅ CORRECT: Pass the result directly.
        # The agent returns {"type": "dashboard", ...} OR {"type": "text", ...}
        # The Frontend checks "type" to decide what to show.
        result = await get_chat_response(request.message)
        return result
    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))