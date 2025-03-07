# models.py
from sqlalchemy import Column, Integer, String, Boolean
from db import Base  # Import the Base from db.py

class TodoModel(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    done = Column(Boolean, default=False)