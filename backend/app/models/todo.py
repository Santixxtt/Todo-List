from typing import Optional, List, Dict, Any
from mysql.connector import Error
from app.database import get_db_connection  # ← Importación corregida

class TodoModel:
    """Modelo para operaciones CRUD de todos"""
    
    @staticmethod
    def get_all() -> List[Dict[str, Any]]:
        """Obtener todas las tareas"""
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        try:
            cursor.execute("SELECT * FROM todos ORDER BY created_at DESC")
            return cursor.fetchall()
        finally:
            cursor.close()
            connection.close()
    
    @staticmethod
    def get_by_id(todo_id: int) -> Optional[Dict[str, Any]]:
        """Obtener tarea por ID"""
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        try:
            cursor.execute("SELECT * FROM todos WHERE id = %s", (todo_id,))
            return cursor.fetchone()
        finally:
            cursor.close()
            connection.close()
    
    @staticmethod
    def create(title: str, description: str = "") -> Dict[str, Any]:
        """Crear nueva tarea"""
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        try:
            query = "INSERT INTO todos (title, description, completed) VALUES (%s, %s, %s)"
            cursor.execute(query, (title, description, False))
            connection.commit()
            
            cursor.execute("SELECT * FROM todos WHERE id = %s", (cursor.lastrowid,))
            return cursor.fetchone()
        except Error as e:
            connection.rollback()
            raise e
        finally:
            cursor.close()
            connection.close()
    
    @staticmethod
    def update(todo_id: int, title: Optional[str] = None, 
               description: Optional[str] = None, 
               completed: Optional[bool] = None) -> Optional[Dict[str, Any]]:
        """Actualizar tarea existente"""
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        try:
            cursor.execute("SELECT * FROM todos WHERE id = %s", (todo_id,))
            if not cursor.fetchone():
                return None
            
            updates = []
            params = []
            
            if title is not None:
                updates.append("title = %s")
                params.append(title)
            if description is not None:
                updates.append("description = %s")
                params.append(description)
            if completed is not None:
                updates.append("completed = %s")
                params.append(completed)
            
            if updates:
                updates.append("updated_at = NOW()")
                query = f"UPDATE todos SET {', '.join(updates)} WHERE id = %s"
                params.append(todo_id)
                cursor.execute(query, params)
                connection.commit()
            
            cursor.execute("SELECT * FROM todos WHERE id = %s", (todo_id,))
            return cursor.fetchone()
        except Error as e:
            connection.rollback()
            raise e
        finally:
            cursor.close()
            connection.close()
    
    @staticmethod
    def delete(todo_id: int) -> bool:
        """Eliminar tarea"""
        connection = get_db_connection()
        cursor = connection.cursor()
        
        try:
            cursor.execute("DELETE FROM todos WHERE id = %s", (todo_id,))
            connection.commit()
            return cursor.rowcount > 0
        except Error as e:
            connection.rollback()
            raise e
        finally:
            cursor.close()
            connection.close()
    
    @staticmethod
    def toggle_completed(todo_id: int) -> Optional[Dict[str, Any]]:
        """Alternar estado completado"""
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        try:
            cursor.execute("SELECT completed FROM todos WHERE id = %s", (todo_id,))
            todo = cursor.fetchone()
            
            if not todo:
                return None
            
            new_status = not todo['completed']
            cursor.execute(
                "UPDATE todos SET completed = %s, updated_at = NOW() WHERE id = %s",
                (new_status, todo_id)
            )
            connection.commit()
            
            cursor.execute("SELECT * FROM todos WHERE id = %s", (todo_id,))
            return cursor.fetchone()
        except Error as e:
            connection.rollback()
            raise e
        finally:
            cursor.close()
            connection.close()
