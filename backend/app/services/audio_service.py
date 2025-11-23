import io
from groq import Groq
# from backend.app.core.config import settings

from app.core.config import settings


client = Groq(api_key=settings.GROQ_API_KEY)


def transcribe_audio(file_bytes: bytes, filename: str = "audio.webm") -> str:
    try:
        audio_file = io.BytesIO(file_bytes)
        audio_file.name = filename

        # ✅ Change response_format to "json" (More reliable)
        transcription = client.audio.transcriptions.create(
            file=(filename, audio_file.read()),
            model="whisper-large-v3-turbo",
            prompt="The audio is in Japanese.",
            language="ja",
            response_format="json",
            temperature=0.0
        )

        # ✅ Explicitly return just the text string
        return transcription.text

    except Exception as e:
        print(f"Groq Error: {e}")
        raise e