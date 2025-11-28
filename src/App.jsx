import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Trash2, Edit2, Save, X } from 'lucide-react';
import todoService from './services/todoService'; // o la ruta correcta
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await todoService.getAll();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las tareas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (todoData) => {
    try {
      const newTodo = await todoService.create(todoData);
      setTodos([newTodo, ...todos]);
    } catch (err) {
      setError('Error al crear la tarea');
      console.error(err);
    }
  };

  const handleUpdate = async (todoData) => {
    try {
      const updated = await todoService.update(editingTodo.id, todoData);
      setTodos(todos.map(t => t.id === editingTodo.id ? updated : t));
      setEditingTodo(null);
    } catch (err) {
      setError('Error al actualizar la tarea');
      console.error(err);
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await todoService.toggle(id);
      setTodos(todos.map(t => t.id === id ? updated : t));
    } catch (err) {
      setError('Error al actualizar la tarea');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;
    
    try {
      await todoService.delete(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError('Error al eliminar la tarea');
      console.error(err);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Todo List</h1>
          <p className="text-gray-600">Organiza tus tareas de manera eficiente</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completadas</div>
          </div>
        </div>

        {/* Form */}
        {editingTodo ? (
          <TodoForm
            onSubmit={handleUpdate}
            onCancel={() => setEditingTodo(null)}
            initialData={editingTodo}
          />
        ) : (
          <TodoForm onSubmit={handleCreate} />
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Completadas
          </button>
        </div>

        {/* Todo List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando tareas...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filter === 'all' ? 'No hay tareas' : `No hay tareas ${filter === 'active' ? 'pendientes' : 'completadas'}`}
            </h3>
            <p className="text-gray-500">
              {filter === 'all' ? '¡Comienza agregando tu primera tarea!' : 'Cambia el filtro para ver otras tareas'}
            </p>
          </div>
        ) : (
          <div>
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onEdit={setEditingTodo}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}