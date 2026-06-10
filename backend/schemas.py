from pydantic import BaseModel

class PropertyBase(BaseModel):
    title: str
    city: str
    locality: str
    price: int
    type: str
    property_type: str
    bhk: int
    bathrooms: int
    area: int
    image_filename: str
    description: str
    amenities: str
    agent_name: str
    agent_phone: str
    agent_email: str

class PropertyResponse(PropertyBase):
    id: int

    class Config:
        from_attributes = True
        # For compatibility with older pydantic versions:
        orm_mode = True
