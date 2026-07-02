import os
import json
from typing import Any, Dict, List, Optional

from fastapi import HTTPException
from openai import OpenAI


def get_openai_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY is not configured on the server.",
        )
    return OpenAI(api_key=api_key)


def _extract_json_object(text: str) -> Optional[Dict[str, Any]]:
    """Best-effort extraction of a JSON object from model output."""
    if not text:
        return None

    # If the model already returned a JSON object directly.
    text_stripped = text.strip()
    if text_stripped.startswith("{") and text_stripped.endswith("}"):
        try:
            return json.loads(text_stripped)
        except Exception:
            return None

    # Try to find the first {...} block.
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None
    candidate = text[start : end + 1]
    try:
        return json.loads(candidate)
    except Exception:
        return None


def parse_user_query_to_filters(user_query: str) -> Dict[str, Any]:
    """
    Use GPT to translate a natural language query into backend-compatible filters.

    Output schema:
    - city: one of Bangalore|Mumbai|Chennai|Hyderabad (or null)
    - type: "buy"|"rent"|null
    - property_type: "flat"|"house"|null
    - bhk: int 1-5 (or null). Also supports "4+" as 4.
    - min_price: int INR (or null)
    - max_price: int INR (or null)
    - search: string keywords (or null)
    - sort_preference: "relevance"|"price_asc"|"price_desc" (or "relevance")
    - rationale: short string
    """

    client = get_openai_client()

    system_prompt = (
        "You are a real-estate assistant. Convert the user's natural language request into "
        "strict search filters for an Indian property portal. "
        "Return ONLY valid JSON that matches the requested schema. "
        "If a value isn't specified or can't be inferred, use null. "
        "Price must be returned in INR as integers. Convert Lakh/Cr to integers. "
        "Use city names exactly: Bangalore, Mumbai, Chennai, Hyderabad. "
        "Use type exactly: buy, rent. "
        "Use property_type exactly: flat, house. "
        "For bhk, output an integer (1-5). If user says '4+' treat it as 4. "
        "For search, include keywords like locality/amenities/title terms extracted from the query."
    )

    schema_prompt = (
        "Return JSON with keys: city, type, property_type, bhk, min_price, max_price, search, "
        "sort_preference, rationale."
    )

    user_prompt = f"User query: {user_query}"

    resp = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": schema_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
    )

    content = resp.choices[0].message.content
    parsed = _extract_json_object(content)
    if not parsed:
        raise HTTPException(status_code=500, detail="Failed to parse assistant output as JSON.")

    # Normalize / enforce keys
    keys = [
        "city",
        "type",
        "property_type",
        "bhk",
        "min_price",
        "max_price",
        "search",
        "sort_preference",
        "rationale",
    ]
    out: Dict[str, Any] = {k: parsed.get(k) for k in keys}

    if not out.get("sort_preference"):
        out["sort_preference"] = "relevance"

    return out


def build_assistant_additional_details(
    user_query: str,
    filters: Dict[str, Any],
    properties: List[Dict[str, Any]],
) -> str:
    """Generate human-friendly explanation and recommendations."""

    client = get_openai_client()

    # Provide a compact view of properties to the model
    props_compact = [
        {
            "id": p.get("id"),
            "title": p.get("title"),
            "city": p.get("city"),
            "locality": p.get("locality"),
            "price": p.get("price"),
            "type": p.get("type"),
            "property_type": p.get("property_type"),
            "bhk": p.get("bhk"),
            "amenities": p.get("amenities"),
        }
        for p in properties[:8]
    ]

    system_prompt = (
        "You are an expert property recommender for an Indian property portal. "
        "Using the user query, filters, and matched properties, write a concise section titled "
        "'Additional Details'. Include: why these match, what to consider, and 2-4 bullet 'Next Steps'. "
        "Do not invent facts not present in the property data."
    )

    user_prompt = {
        "user_query": user_query,
        "filters": filters,
        "matched_properties": props_compact,
    }

    resp = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": json.dumps(user_prompt)},
        ],
        temperature=0.35,
    )

    return resp.choices[0].message.content or ""

