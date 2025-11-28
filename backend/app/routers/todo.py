from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.todo import TodoCreate, TodoUpdate, TodoResponse
from app.models.todo import TodoModel

router = APIRouter(
    prefix="/api/todos",
    tags=["todos"]
)

@router.get("/", response_model=List[TodoResponse])
async def get_todos():
    """Obtener todas las tareas"""
    try:
        return TodoModel.get_all()
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al obtener tareas: {str(e)}"
        )

@router.get("/{todo_id}", response_model=TodoResponse)
async def get_todo(todo_id: int):
    """Obtener tarea por ID"""
    try:
        todo = TodoModel.get_by_id(todo_id)
        if not todo:
            raise HTTPException(status_code=404, detail="Tarea no encontrada")
        return todo
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al obtener tarea: {str(e)}"
        )

@router.post("/", response_model=TodoResponse, status_code=201)
async def create_todo(todo: TodoCreate):
    """Crear nueva tarea"""
    if not todo.title or todo.title.strip() == "":
        raise HTTPException(status_code=400, detail="El título es requerido")
    
    try:
        return TodoModel.create(todo.title, todo.description)
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al crear tarea: {str(e)}"
        )

@router.put("/{todo_id}", response_model=TodoResponse)
async def update_todo(todo_id: int, todo: TodoUpdate):
    """Actualizar tarea existente"""
    try:
        updated = TodoModel.update(
            todo_id, 
            todo.title, 
            todo.description, 
            todo.completed
        )
        if not updated:
            raise HTTPException(status_code=404, detail="Tarea no encontrada")
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al actualizar tarea: {str(e)}"
        )

@router.delete("/{todo_id}")
async def delete_todo(todo_id: int):
    """Eliminar tarea"""
    try:
        deleted = TodoModel.delete(todo_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Tarea no encontrada")
        return {"message": "Tarea eliminada exitosamente", "id": todo_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al eliminar tarea: {str(e)}"
        )

@router.patch("/{todo_id}/toggle", response_model=TodoResponse)
async def toggle_todo(todo_id: int):
    """Alternar estado completado/no completado"""
    try:
        updated = TodoModel.toggle_completed(todo_id)
        if not updated:
            raise HTTPException(status_code=404, detail="Tarea no encontrada")
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al actualizar tarea: {str(e)}"
        )