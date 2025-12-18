# app/utils/redis_cache.py
import redis
import json
import numpy as np

try:
    r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    r.ping() # Check connection
except:
    r = None

def set_cache_embedding(query: str, embedding: np.ndarray, answer: str, resolution: dict, expire: int = 3600):
    """
    Store query embedding and response in Redis
    """
    if r is None:
        return
    key = f"query:{hash(query)}"
    value = {
        "query": query,
        "embedding": embedding.tolist(),
        "answer": answer,
        "resolution": resolution
    }
    try:
        r.set(key, json.dumps(value), ex=expire)
    except:
        pass

def get_all_cache_embeddings():
    """
    Retrieve all cached embeddings
    """
    if r is None:
        return []
    try:
        keys = r.keys("query:*")
    except:
        return []
    data = []
    for key in keys:
        val = json.loads(r.get(key))
        val['embedding'] = np.array(val['embedding'], dtype=np.float32)
        data.append(val)
    return data
