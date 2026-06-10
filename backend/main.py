from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from database import SessionLocal, init_db
from models import Property
from schemas import PropertyResponse

app = FastAPI(title="Indian Property Search API", version="1.0.0")

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
