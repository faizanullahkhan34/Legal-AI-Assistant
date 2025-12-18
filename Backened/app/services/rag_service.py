from app.utils.redis_cache import set_cache_embedding, get_all_cache_embeddings
from app.utils.embeddings import search_similar_texts, model
import ollama
import numpy as np
import faiss
from app.core.logger import get_logger
from app.core.config import settings
from app.utils.embeddings import get_embeddings, load_embeddings_from_disk
from app.utils.pdf_loader import load_pdf_text
logger = get_logger(__name__)

# Initialize RAG on module load (or move to startup event)
try:
    if load_embeddings_from_disk():
        logger.info("Loaded existing embeddings from disk.")
    else:
        logger.info(f"Loading PDF from {settings.PDF_PATH}...")
        pdf_texts = load_pdf_text(settings.PDF_PATH)
        get_embeddings(pdf_texts)
        logger.info("PDF loaded and newly embedded.")
except Exception as e:
    logger.error(f"Failed to initialize embeddings: {e}")

def get_rag_answer(query: str, language="en", top_k=1, similarity_threshold=0.75, user_name: str = None):
    # Encode the query
    q_vector = model.encode([query], convert_to_numpy=True).astype("float32")

    # Load cached embeddings from Redis
    try:
        cached_data = get_all_cache_embeddings()
    except Exception as e:
        logger.warning(f"Redis cache unavailable: {e}")
        cached_data = []
    if cached_data:
        # Build FAISS index from cached embeddings
        embeddings_matrix = np.stack([d['embedding'] for d in cached_data])
        index = faiss.IndexFlatL2(embeddings_matrix.shape[1])
        index.add(embeddings_matrix)

        # Search for similar cached query
        distances, idxs = index.search(q_vector, top_k)
        # FAISS returns L2 distance; convert to cosine similarity if needed
        best_match = cached_data[idxs[0][0]]
        # Simple similarity check
        similarity = 1 / (1 + distances[0][0])  # L2 -> similarity heuristic
        if similarity > similarity_threshold:
            logger.info("Cache HIT for query")
            return best_match['answer'], best_match['resolution']
            
    logger.info("Cache MISS - Performing RAG Search")

    # If no similar cache, do normal RAG search
    results = search_similar_texts(query, top_k=3)
    context = " ".join([r['text'] for r in results])
    
    greeting = f"Address the user as {user_name}." if user_name else ""

    prompt = f"""
    You are a legal advisor AI based on the Constitution of India. 
    {greeting}
    Answer the following legal query in {language}, concisely and clearly.
    Include suggested resolution steps if applicable.

    Query: {query}

    Context: {context}
    """

    response = ollama.chat(
        model="llama3",
        messages=[{"role": "user", "content": prompt}]
    )
    answer_text = response['message']['content']
    resolution = {"steps": ["Step 1", "Step 2"]}

    # Save query + embedding + response to Redis
    set_cache_embedding(query, q_vector[0], answer_text, resolution)

    return answer_text, resolution
