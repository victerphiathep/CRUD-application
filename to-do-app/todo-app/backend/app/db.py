from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


# Replace with PostGreSQl database
DATABASE_URL = "postgresql://postgres:Loveabl3@localhost:5432/ToDoApplication"

# Create the database engine.
engine = create_engine(DATABASE_URL)

# Create a configured "Session" class.
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# Base class for our classes definitions.
Base = declarative_base()

# Define the TodoModel, which maps to a "todos" table in the database.
def get_db():
    """
    Generator that yields a database session and ensures it closes properly.
    Creates a connection to the PostgreSQL database.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()