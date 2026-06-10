from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    city = Column(String, nullable=False)  # "Bangalore" or "Mumbai"
    locality = Column(String, nullable=False)
    price = Column(Integer, nullable=False)  # in INR
    type = Column(String, nullable=False)  # "rent" or "buy"
    property_type = Column(String, nullable=False)  # "flat" or "house"
    bhk = Column(Integer, nullable=False)  # number of bedrooms
    bathrooms = Column(Integer, nullable=False)
    area = Column(Integer, nullable=False)  # in sq ft
    image_filename = Column(String, nullable=False)  # filename in frontend public/images/
    description = Column(Text, nullable=False)
    amenities = Column(String, nullable=False)  # comma-separated e.g. "Pool, Gym, Parking"
    agent_name = Column(String, nullable=False)
    agent_phone = Column(String, nullable=False)
    agent_email = Column(String, nullable=False)
