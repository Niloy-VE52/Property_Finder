from fastapi import FastAPI, Depends, HTTPException, Query
from dotenv import load_dotenv

load_dotenv()

from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from database import SessionLocal, init_db
from models import Property
from schemas import PropertyResponse

from assistant import parse_user_query_to_filters, build_assistant_additional_details
from assistant_schemas import AssistantSearchRequest, AssistantSearchResponse
from chat import router as chat_router


app = FastAPI(title="Indian Property Search API", version="1.0.0")
app.include_router(chat_router)


# Enable CORS to allow the React frontend to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    # Initialize DB tables and seed data if DB is empty
    init_db()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/properties", response_model=List[PropertyResponse])
def get_properties(
    city: Optional[str] = None,
    type: Optional[str] = None,
    property_type: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    bhk: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Property)
    
    if city:
        query = query.filter(Property.city.ilike(city))
    if type:
        query = query.filter(Property.type == type)
    if property_type:
        query = query.filter(Property.property_type == property_type)
    if min_price is not None:
        query = query.filter(Property.price >= min_price)
    if max_price is not None:
        query = query.filter(Property.price <= max_price)
    if bhk is not None:
        query = query.filter(Property.bhk == bhk)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            Property.title.ilike(search_filter) | 
            Property.locality.ilike(search_filter) |
            Property.description.ilike(search_filter) |
            Property.amenities.ilike(search_filter)
        )
        
    return query.all()

@app.get("/api/properties/{property_id}", response_model=PropertyResponse)
def get_property_detail(property_id: int, db: Session = Depends(get_db)):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop


@app.post("/api/assistant/search", response_model=AssistantSearchResponse)
def assistant_search(req: AssistantSearchRequest, db: Session = Depends(get_db)):
    """AI-assisted property search using OpenAI.

    Steps:
    1) LLM converts user query into backend search filters.
    2) Backend queries properties using those filters.
    3) LLM produces 'additional_details' explanation based on matched results.
    """

    filters = parse_user_query_to_filters(req.query)


    query = db.query(Property)

    if filters.get("city"):
        query = query.filter(Property.city == filters["city"])
    if filters.get("type"):
        query = query.filter(Property.type == filters["type"])
    if filters.get("property_type"):
        query = query.filter(Property.property_type == filters["property_type"])
    if filters.get("bhk") is not None:
        query = query.filter(Property.bhk == filters["bhk"])
    if filters.get("min_price") is not None:
        query = query.filter(Property.price >= filters["min_price"])
    if filters.get("max_price") is not None:
        query = query.filter(Property.price <= filters["max_price"])

    # Use full-text-ish search across existing fields
    if filters.get("search"):
        search_filter = f"%{filters['search']}%"
        query = query.filter(
            Property.title.ilike(search_filter)
            | Property.locality.ilike(search_filter)
            | Property.description.ilike(search_filter)
            | Property.amenities.ilike(search_filter)
        )

    matches = query.all()

    matches_payload: List[Dict[str, Any]] = [
        {
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
            "description": p.description,
            "amenities": p.amenities,
            "agent_name": p.agent_name,
            "agent_phone": p.agent_phone,
            "agent_email": p.agent_email,
        }
        for p in matches[:8]
    ]

    additional_details = build_assistant_additional_details(
        user_query=req.query,
        filters=filters,
        properties=matches_payload,
    )

    return AssistantSearchResponse(
        filters={
            "city": filters.get("city"),
            "type": filters.get("type"),
            "property_type": filters.get("property_type"),
            "bhk": filters.get("bhk"),
            "min_price": filters.get("min_price"),
            "max_price": filters.get("max_price"),
            "search": filters.get("search"),
            "sort_preference": filters.get("sort_preference") or "relevance",
        },
        matches=matches_payload,
        additional_details=additional_details,
        rationale=filters.get("rationale"),
    )

