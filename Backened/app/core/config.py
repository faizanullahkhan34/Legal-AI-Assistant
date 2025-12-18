
import os
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "Indian Legal Advisor Bot"
    API_V1_STR: str = "/api/v1"
    OPENAI_API_KEY: str = "YOUR_OPENAI_API_KEY_HERE"
    
    # RAG Settings
    PDF_PATH: str = "document/COI_2024.pdf"
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
