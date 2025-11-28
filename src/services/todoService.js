const API_URL = 'http://127.0.0.1:8000/api';

const todoService = {
  async getAll() {
    const res = await fetch(`${API_URL}/todos`);
    if (!res.ok) throw new Error('Error al obtener tareas');
    return res.json();
  },

  async create(todo) {
    const res = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    });
    if (!res.ok) throw new Error('Error al crear tarea');
    return res.json();
  },

  async update(id, todo) {
    const res = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    });
    if (!res.ok) throw new Error('Error al actualizar tarea');
    return res.json();
  },

  async delete(id) {
    const res = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar tarea');
    return res.json();
  },

  async toggle(id) {
    const res = await fetch(`${API_URL}/todos/${id}/toggle`, {
      method: 'PATCH'
    });
    if (!res.ok) throw new Error('Error al actualizar tarea');
    return res.json();
  }
};

export default todoService;