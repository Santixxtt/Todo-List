from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TodoBase(BaseModel):
    title: str = Field(..., min_length=1, description="Título de la tarea")
    description: Optional[str] = Field(default="", description="Descripción")

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = None
    completed: Optional[bool] = None

class TodoResponse(TodoBase):
    id: int
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
