# main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from models import TodoModel
from db import engine, Base, get_db
from pydantic import BaseModel
from typing import List, Annotated
import models

app = FastAPI()

# Configure CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Pydantic models
class TodoBase(BaseModel):
    title: str
    description: str = ""
    done: bool = False

# Annotated dependency for the DB session
db_dependency = Annotated[Session, Depends(get_db)]

# Create To-Do Endpoint
@app.post("/todos/",)
async def create_todo(todo: TodoBase, db: db_dependency):
    db_todo = TodoModel(title=todo.title, description=todo.description, done=todo.done)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

# Get All To-dos Endpoint
@app.get("/todos/")
async def get_all_todos(db: db_dependency):
    todos = db.query(TodoModel).all()
    return todos

# Update (Edit) a To-do Endpoint
@app.put("/todos/{todo_id}")
async def update_todo(todo_id: int, todo: TodoBase, db: db_dependency):
    db_todo = db.query(TodoModel).filter(TodoModel.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    # Update fields using dot notation
    db_todo.title = todo.title
    db_todo.description = todo.description
    db_todo.done = todo.done
    db.commit()
    db.refresh(db_todo)
    return db_todo

# Fetch a to-do
@app.get("/todos/{todo_id}")
async def get_todo(todo_id: int, db: db_dependency):
    result = db.query(TodoModel).filter(TodoModel.id == todo_id).first()
    if result is None:
        raise HTTPException(statu_code=404, detail="To-do is not found.")
    return result

# Delete a todo
@app.delete("/todos/{todo_id}", status_code=200)
async def delete_todo(todo_id: int, db: db_dependency):
    try:
        # Find the todo in the database
        todo = db.query(TodoModel).filter(TodoModel.id == todo_id).first()
        
        if todo is None:
            raise HTTPException(status_code=404, detail="Todo not found")
            
        # Delete the todo from the database
        db.delete(todo)
        db.commit()
        
        return {"message": "Todo deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))