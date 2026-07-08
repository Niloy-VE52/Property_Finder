"""
Chat endpoint – multi-turn conversational AI assistant that can search the
property database and suggest properties based on the user's requirements.
"""

import json
import os
import re
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from openai import OpenAI

from database import SessionLocal
from models import Property


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]


class ChatPropertyMatch(BaseModel):
    id: int
    title: str
    city: str
    locality: str
    price: int
    type: str
    property_type: str
    bhk: int
    bathrooms: int
    area: int
    image_filename: Optional[str] = None
    image_url: Optional[str] = None
    description: str
    amenities: str
    agent_name: str
    agent_phone: str
    agent_email: str


class ChatResponse(BaseModel):
    reply: str
    properties: Optional[List[ChatPropertyMatch]] = None


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------
router = APIRouter(prefix="/api")


def _get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _get_openai_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY is not configured on the server.",
        )
    return OpenAI(api_key=api_key)


# ---------------------------------------------------------------------------
# System prompt
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """\
You are **PropertyAI**, a friendly, expert real-estate consultant for an Indian property portal called MagicProperty Elite. You help users find flats and houses for buying or renting in Bangalore, Mumbai, Chennai, and Hyderabad.

## Your Capabilities
- Search the property database when users ask for suggestions
- Provide advice about localities, pricing trends, and buying/renting decisions
- Compare properties and help narrow down choices
- Answer general real-estate questions

## CRITICAL: When to Search
When the user asks you to find, suggest, show, search, or recommend properties, you MUST include a search action block in your response. Output the following JSON block on its own line, surrounded by triple backticks:

```propertysearch
{"city": null, "type": null, "property_type": null, "bhk": null, "min_price": null, "max_price": null, "search": null}
```

Rules for the search block:
- city: one of "Bangalore", "Mumbai", "Chennai", "Hyderabad" or null
- type: "buy" or "rent" or null
- property_type: "flat" or "house" or null
- bhk: integer 1-5 or null
- min_price / max_price: integer in INR (convert Lakh=100000, Cr=10000000) or null
- search: keyword string for locality/amenity/title search, or null

## Response Guidelines
- Be warm, helpful, and concise
- Use markdown formatting (bold, bullets, etc.)
- When showing search results, provide a brief summary of what you found and why these match
- If no properties match, suggest adjusting filters
- For general questions (not requiring a search), just respond conversationally — do NOT include a search block
- Always respond in a helpful, professional tone
- Use ₹ symbol for prices, format in Lakh/Cr for readability
"""


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

_SEARCH_BLOCK_RE = re.compile(
    r"```propertysearch\s*\n\s*(\{.*?\})\s*\n\s*```",
    re.DOTALL,
)


def _extract_search_filters(text: str) -> Optional[Dict[str, Any]]:
    """Extract a propertysearch JSON block from the LLM reply, if present."""
    m = _SEARCH_BLOCK_RE.search(text)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except (json.JSONDecodeError, ValueError):
        return None


def _strip_search_block(text: str) -> str:
    """Remove the ```propertysearch``` block from the visible reply."""
    return _SEARCH_BLOCK_RE.sub("", text).strip()


def _query_properties(db: Session, filters: Dict[str, Any]) -> List[Property]:
    """Run a filtered query against the properties table."""
    q = db.query(Property)

    if filters.get("city"):
        q = q.filter(Property.city.ilike(filters["city"]))
    if filters.get("type"):
        q = q.filter(Property.type == filters["type"])
    if filters.get("property_type"):
        q = q.filter(Property.property_type == filters["property_type"])
    if filters.get("bhk") is not None:
        q = q.filter(Property.bhk == filters["bhk"])
    if filters.get("min_price") is not None:
        q = q.filter(Property.price >= filters["min_price"])
    if filters.get("max_price") is not None:
        q = q.filter(Property.price <= filters["max_price"])
    if filters.get("search"):
        like = f"%{filters['search']}%"
        q = q.filter(
            Property.title.ilike(like)
            | Property.locality.ilike(like)
            | Property.description.ilike(like)
            | Property.amenities.ilike(like)
        )

    return q.limit(8).all()


def _property_to_dict(p: Property) -> Dict[str, Any]:
    return {
        "id": p.id,
        "title": p.title,
        "city": p.city,
        "locality": p.locality,
        "price": p.price,
        "type": p.type,
        "property_type": p.property_type,
        "bhk": p.bhk,
        "bathrooms": p.bathrooms,
        "area": p.area,
        "image_filename": p.image_filename,
        "image_url": p.image_url,
        "description": p.description,
        "amenities": p.amenities,
        "agent_name": p.agent_name,
        "agent_phone": p.agent_phone,
        "agent_email": p.agent_email,
    }


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------

@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest, db: Session = Depends(_get_db)):
    """
    Multi-turn conversational AI assistant.

    1. Send the full conversation history to the LLM.
    2. If the LLM's reply contains a ``propertysearch`` block, query the DB.
    3. Return the cleaned reply text + any matched property objects.
    """
    client = _get_openai_client()

    # Build messages list for OpenAI
    openai_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in req.messages:
        openai_messages.append({"role": msg.role, "content": msg.content})

    resp = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        messages=openai_messages,
        temperature=0.4,
    )

    raw_reply = resp.choices[0].message.content or ""

    # Check for embedded search action
    filters = _extract_search_filters(raw_reply)
    properties_out = None

    if filters:
        matches = _query_properties(db, filters)
        if matches:
            properties_out = [_property_to_dict(p) for p in matches]

    clean_reply = _strip_search_block(raw_reply)

    # If a search was triggered but no results, append a helpful note
    if filters and not properties_out:
        clean_reply += (
            "\n\n> I searched the database but couldn't find properties matching "
            "those exact criteria. Try adjusting your budget, BHK, or city."
        )

    return ChatResponse(reply=clean_reply, properties=properties_out)
