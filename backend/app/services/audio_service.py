import io
from groq import Groq
from backend.app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)


def transcribe_audio(file_bytes: bytes, filename: str = "audio.webm") -> str:
    try:
        # Create a file-like object from bytes
        audio_file = io.BytesIO(file_bytes)
        audio_file.name = filename

        # Create transcription
        transcription = client.audio.transcriptions.create(
            file=(filename, audio_file.read()),  # Read directly
            model="whisper-large-v3-turbo",
            prompt="The audio is in Japanese.",
            language="ja",
            response_format="text"  # Returns a simple string
        )
        return transcription
    except Exception as e:
        print(f"Groq Error: {e}")
        raise e