from sqlalchemy import Column, Integer, String, Boolean
from db import Base  # Import the Base from db.py

class UserModel(Base):
    id = Column(Integer, primary_key=True, index=True)
    username=Column(String, unique=True, index=True)
    hashed_password=Column(String, unique=True, index=True)