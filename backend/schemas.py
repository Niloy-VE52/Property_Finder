import re
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator

# Accepts +91 98765 43210, +919876543210, 9876543210, 987-654-3210, etc.
PHONE_REGEX = re.compile(r"^\+?\d{0,3}[\s-]?\d{4,5}[\s-]?\d{4,6}$")

MIN_RENT_PRICE = 1_000            # ₹1,000/month floor
MAX_RENT_PRICE = 10_000_000       # ₹1 Cr/month ceiling (sanity cap)
MIN_BUY_PRICE = 100_000           # ₹1 Lakh floor
MAX_BUY_PRICE = 5_000_000_000     # ₹500 Cr ceiling (sanity cap)


def _validate_phone(v: str) -> str:
    v = v.strip()
    if not PHONE_REGEX.match(v):
        raise ValueError(
            "Enter a valid phone number (e.g. +91 98765 43210 or 9876543210)"
        )
    digits = re.sub(r"\D", "", v)
    if not (10 <= len(digits) <= 13):
        raise ValueError("Phone number must contain 10–13 digits")
    return v


def _validate_image_url(v: Optional[str]) -> Optional[str]:
    if v is None or v == "":
        return v
    if not re.match(r"^https?://", v):
        raise ValueError("image_url must be a valid http(s) URL")
    return v


# ---------------------------------------------------------------------------
# WRITE schemas — strict validation applies here (create / update only)
# ---------------------------------------------------------------------------

class PropertyCreate(BaseModel):
    title: str
    city: str
    locality: str
    price: int = Field(..., gt=0, le=MAX_BUY_PRICE)
    type: str
    property_type: str
    bhk: int = Field(..., ge=1, le=10)
    bathrooms: int = Field(..., ge=1, le=10)
    area: int = Field(..., gt=0, le=100_000)
    image_filename: Optional[str] = None
    image_url: Optional[str] = None
    description: str
    amenities: str
    agent_name: str
    agent_phone: str
    agent_email: EmailStr

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        if v not in ("buy", "rent"):
            raise ValueError('type must be "buy" or "rent"')
        return v

    @field_validator("property_type")
    @classmethod
    def validate_property_type(cls, v: str) -> str:
        if v not in ("flat", "house"):
            raise ValueError('property_type must be "flat" or "house"')
        return v

    @field_validator("agent_phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        return _validate_phone(v)

    @field_validator("image_url")
    @classmethod
    def validate_image_url(cls, v: Optional[str]) -> Optional[str]:
        return _validate_image_url(v)

    @model_validator(mode="after")
    def validate_price_for_type(self) -> "PropertyCreate":
        if self.type == "rent":
            if not (MIN_RENT_PRICE <= self.price <= MAX_RENT_PRICE):
                raise ValueError(
                    f"Rent price must be between ₹{MIN_RENT_PRICE:,} and "
                    f"₹{MAX_RENT_PRICE:,} per month"
                )
        elif self.type == "buy":
            if not (MIN_BUY_PRICE <= self.price <= MAX_BUY_PRICE):
                raise ValueError(
                    f"Buy price must be between ₹{MIN_BUY_PRICE:,} and "
                    f"₹{MAX_BUY_PRICE:,}"
                )
        return self


class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    city: Optional[str] = None
    locality: Optional[str] = None
    price: Optional[int] = Field(None, gt=0, le=MAX_BUY_PRICE)
    type: Optional[str] = None
    property_type: Optional[str] = None
    bhk: Optional[int] = Field(None, ge=1, le=10)
    bathrooms: Optional[int] = Field(None, ge=1, le=10)
    area: Optional[int] = Field(None, gt=0, le=100_000)
    image_filename: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    amenities: Optional[str] = None
    agent_name: Optional[str] = None
    agent_phone: Optional[str] = None
    agent_email: Optional[EmailStr] = None

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in ("buy", "rent"):
            raise ValueError('type must be "buy" or "rent"')
        return v

    @field_validator("property_type")
    @classmethod
    def validate_property_type(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in ("flat", "house"):
            raise ValueError('property_type must be "flat" or "house"')
        return v

    @field_validator("agent_phone")
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        return _validate_phone(v)

    @field_validator("image_url")
    @classmethod
    def validate_image_url(cls, v: Optional[str]) -> Optional[str]:
        return _validate_image_url(v)

    @model_validator(mode="after")
    def validate_price_for_type(self) -> "PropertyUpdate":
        # Only cross-check when both fields are present in this partial update
        if self.price is not None and self.type is not None:
            if self.type == "rent" and not (MIN_RENT_PRICE <= self.price <= MAX_RENT_PRICE):
                raise ValueError(f"Rent price must be between ₹{MIN_RENT_PRICE:,} and ₹{MAX_RENT_PRICE:,}")
            if self.type == "buy" and not (MIN_BUY_PRICE <= self.price <= MAX_BUY_PRICE):
                raise ValueError(f"Buy price must be between ₹{MIN_BUY_PRICE:,} and ₹{MAX_BUY_PRICE:,}")
        return self


# ---------------------------------------------------------------------------
# READ schema — NO strict validation. This just mirrors whatever is in the
# DB so that legacy/imperfect rows (old phone numbers, etc.) never crash a
# GET request. Validation belongs on write, not on read.
# ---------------------------------------------------------------------------

class PropertyResponse(BaseModel):
    id: int
    owner_id: Optional[int] = None
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
    agent_email: str  # plain str on read — EmailStr here would 500 on legacy bad data

    class Config:
        from_attributes = True
        orm_mode = True


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------

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