from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class AssistantFilters(BaseModel):
    city: Optional[str] = None
    type: Optional[str] = None  # buy/rent
    property_type: Optional[str] = None  # flat/house
    bhk: Optional[int] = None
    min_price: Optional[int] = None
    max_price: Optional[int] = None
    search: Optional[str] = None
    sort_preference: Optional[str] = "relevance"


class AssistantSearchRequest(BaseModel):
    query: str


class AssistantSearchResponse(BaseModel):
    filters: AssistantFilters
    matches: List[Dict[str, Any]]
    additional_details: str
    rationale: Optional[str] = None

