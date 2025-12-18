from fastapi import APIRouter
from app.models.schemas import LegalQueryRequest, BotResponse
from app.services.rag_service import get_rag_answer
from app.services.lawyer_service import find_nearby_lawyers

from app.core.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)

@router.post("/legal-query", response_model=BotResponse)
async def legal_query(request: LegalQueryRequest):
    logger.info(f"Received legal query: {request.query} | City: {request.city}")
    
    # RAG-based answer
    answer, resolution = get_rag_answer(request.query, request.language, user_name=request.user_name)

    # Nearby lawyers (Only if needed)
    lawyers = find_nearby_lawyers(request.city, request.query)

    return BotResponse(
        answer=answer,
        possible_resolution=resolution,
        nearby_lawyers=lawyers
    )
