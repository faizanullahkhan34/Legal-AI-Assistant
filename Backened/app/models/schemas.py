from pydantic import BaseModel
from typing import Optional, List

class LegalQueryRequest(BaseModel):
    query: str
    city: Optional[str] = None
    language: Optional[str] = "en"
    user_name: Optional[str] = None

class BotResponse(BaseModel):
    answer: str
    possible_resolution: Optional[dict] = None
    nearby_lawyers: Optional[List[dict]] = None
