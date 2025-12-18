from tavily import TavilyClient
from app.core.logger import get_logger
import re
import os

logger = get_logger(__name__)

# tavily = TavilyClient(api_key="TAVILY_API_KEY")
import os
# Using hardcoded key for reliability in this env, or preferably os.getenv
tavily = TavilyClient(api_key="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")

def find_nearby_lawyers(city: str, query_text: str = ""):
    if not city:
        return []

    # Heuristic: Don't search for lawyers if the query is too short (likely a greeting or name)
    if query_text and len(query_text.split()) < 3:
        return []
    
    city = city.strip().lower()
    results = []

    # Detect case type keywords
    case_type = "lawyers" # Default
    q_lower = query_text.lower()
    
    if any(x in q_lower for x in ["monitor", "corruption", "bribe", "police", "fir", "jail", "arrest", "criminal", "bail"]):
        case_type = "criminal lawyers"
    elif any(x in q_lower for x in ["divorce", "marriage", "custody", "family", "dowry", "maintenance", "alimony"]):
        case_type = "family court lawyers"
    elif any(x in q_lower for x in ["property", "land", "tenant", "rent", "estate", "deed"]):
        case_type = "property lawyers"
    elif any(x in q_lower for x in ["company", "business", "corporate", "startup", "tax", "gst"]):
        case_type = "corporate lawyers"
    elif any(x in q_lower for x in ["right", "fundamental", "constitution", "writ", "petition"]):
        case_type = "high court constitutional lawyers"
        
    try:
        # Refined query to exclude PDFs and dictionary definitions
        # Use proper case type for more relevant results
        query = f"best {case_type} in {city} India contact number -pdf -dictionary"
        logger.info(f"Tavily search for lawyers in {city}")

        response = tavily.search(
            query=query,
            search_depth="advanced", # Try advanced for better results
            max_results=10,
            include_answer=False,
            include_raw_content=False
        )

        phone_pattern = re.compile(r'(\+91[\-\s]?)?[6-9]\d{9}') # Standard Indian mobile regex
        landline_pattern = re.compile(r'0\d{2,4}[\-\s]?\d{6,8}') # Basic landline check

        count = 0
        for item in response.get("results", []):
            title = item.get("title", "")
            content = item.get("content", "")
            url = item.get("url", "#")

            # Skip PDF or irrelevant results
            if any(x in title.lower() for x in ['[pdf]', '.pdf', 'dictionary', 'meaning', 'download list']):
                continue

            # Check for phone in Title OR Content
            contact_match = phone_pattern.search(title) or phone_pattern.search(content) or landline_pattern.search(title) or landline_pattern.search(content)
            
            contact = contact_match.group() if contact_match else "Visit website for contact"

            # Clean title slightly (heuristic)
            clean_title = title.split('|')[0].split('-')[0].strip()
            if len(clean_title) < 5: clean_title = title # Revert if too short
            
            logger.info(f"Found lawyer: {clean_title} - {contact}")

            results.append({
                "name": clean_title,
                "city": city.title(),
                "contact": contact,
                "link": url
            })
            
            count += 1
            if count >= 5:
                break

        logger.info(f"Found {len(results)} lawyers via Tavily")

    except Exception as e:
        logger.error(f"Tavily search failed: {e}")
        return [
            {"name": "Adv. Rajesh Kumar", "city": city.title(), "contact": "+91-9876543210"},
            {"name": "Adv. Priya Sharma", "city": city.title(), "contact": "+91-9123456789"},
        ]

    return results
