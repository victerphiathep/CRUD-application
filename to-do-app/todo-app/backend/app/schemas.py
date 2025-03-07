# Pydantic Models todo
from pydantic import BaseModel


class TodoBase(BaseModel):
    title: str
    description: str = ""
    done: bool = False