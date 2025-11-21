from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routers import chat

app = FastAPI(title="Weather Travel Bot")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
async def ping():
    """
    Dummy GET endpoint to test if router is working.
    """
    return {"message": "pong"}

@app.post("/test-json")
async def test_json(data: dict):
    """
    Simple test endpoint to confirm JSON routing works.
    Input:  {"msg": "hi"}
    Output: {"response": "yoo"}
    """
    return {"response": "yoo"}
app.include_router(chat.router, prefix="/api")


# Do NOT set a fixed port here
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", reload=True)
