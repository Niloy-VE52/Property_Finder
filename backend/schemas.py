from typing import Optional
from pydantic import BaseModel, EmailStr


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


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    city: Optional[str] = None
    locality: Optional[str] = None
    price: Optional[int] = None
    type: Optional[str] = None
    property_type: Optional[str] = None
    bhk: Optional[int] = None
    bathrooms: Optional[int] = None
    area: Optional[int] = None
    image_filename: Optional[str] = None
    description: Optional[str] = None
    amenities: Optional[str] = None
    agent_name: Optional[str] = None
    agent_phone: Optional[str] = None
    agent_email: Optional[str] = None


class PropertyResponse(PropertyBase):
    id: int
    owner_id: Optional[int] = None

    class Config:
        from_attributes = True
        orm_mode = True


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse