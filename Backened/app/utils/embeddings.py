import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# Load model once
model = SentenceTransformer("all-MiniLM-L6-v2")

import os
import pickle

# ... (keep existing imports)

INDEX_FILE = "document/faiss_index.bin"
TEXTS_FILE = "document/texts.pkl"

# Global FAISS index
index = None
texts = []

def save_embeddings_to_disk():
    if index is not None:
        faiss.write_index(index, INDEX_FILE)
        with open(TEXTS_FILE, "wb") as f:
            pickle.dump(texts, f)

def load_embeddings_from_disk():
    global index, texts
    if os.path.exists(INDEX_FILE) and os.path.exists(TEXTS_FILE):
        index = faiss.read_index(INDEX_FILE)
        with open(TEXTS_FILE, "rb") as f:
            texts = pickle.load(f)
        return True
    return False

def get_embeddings(texts_list):
    """
    Generate embeddings for a list of texts.
    """
    global texts, index
    texts = texts_list
    vectors = model.encode(texts_list, convert_to_numpy=True).astype("float32")
    
    # Initialize FAISS index
    index = faiss.IndexFlatL2(vectors.shape[1])
    index.add(vectors)
    
    save_embeddings_to_disk() # Auto-save after generation
    
    return vectors

def search_similar_texts(query, top_k=3):
    """
    Search top_k most similar text chunks using FAISS.
    """
    if index is None:
        raise ValueError("FAISS index is not initialized. Call get_embeddings first.")
    
    q_vector = model.encode([query], convert_to_numpy=True).astype("float32")
    distances, idxs = index.search(q_vector, top_k)
    
    results = []
    for idx in idxs[0]:
        results.append({"text": texts[idx]})
    return results
