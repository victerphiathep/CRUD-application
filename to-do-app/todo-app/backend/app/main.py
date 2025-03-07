# main.py
from fastapi import Security
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from models import TodoModel
from db import engine, Base, get_db
from schemas import TodoBase
from typing import List, Annotated
from auth.schemas import UserCreate, UserLogin, Token
from auth.models_user import UserModel
from auth.auth_utils import hash_password, verify_password
from auth.token_utils import create_access_token, verify_token
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

# Oauth
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Annotated dependency for the DB session
db_dependency = Annotated[Session, Depends(get_db)]

# Create To-Do Endpoint


@app.post("/todos/",)
async def create_todo(todo: TodoBase, db: db_dependency):
    db_todo = TodoModel(
        title=todo.title, description=todo.description, done=todo.done)
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


# User Auth Endpoints


# User Registration Endpoint
@app.post("/register", response_model=Token)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(UserModel).filter(
        UserModel.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=400, detail="Username already registered")

    # Create new user with hashed password
    new_user = UserModel(
        username=user.username,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create token for the new user
    access_token = create_access_token(data={"sub": new_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# User Login Endpoint


@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(
        UserModel.username == form_data.username).first()
    if not user:
        raise HTTPException(
            status_code=400, detail="Incorrect username or password")
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=400, detail="Incorrect username or password")

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# Dependency to get the current user from the token


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = verify_token(token, credentials_exception)
    user = db.query(UserModel).filter(
        UserModel.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user

# Protected Endpoint Example


@app.get("/users/me")
async def read_users_me(current_user: UserModel = Depends(get_current_user)):
    return {"username": current_user.username}
