from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes

from app.core.logger import get_logger

logger = get_logger(__name__)

app = FastAPI(title="Indian Legal Advisor Bot")

@app.on_event("startup")
async def startup_event():
    logger.info("Application starting up...")

@app.get("/health")
async def health_check():
    """Health check endpoint for Docker and monitoring"""
    return {
        "status": "healthy",
        "service": "Legal-AI Backend",
        "version": "1.0.0"
    }


# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include routes
app.include_router(routes.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
