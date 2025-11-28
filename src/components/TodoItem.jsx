import { CheckCircle, Circle, Edit2, Trash2 } from 'lucide-react';

const TodoItem = ({ todo, onToggle, onEdit, onDelete }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-5 mb-3 border-l-4 transition-all hover:shadow-lg ${
      todo.completed ? 'border-green-500 bg-gray-50' : 'border-blue-500'
    }`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(todo.id)}
          className="mt-1 flex-shrink-0 text-gray-400 hover:text-blue-600 transition-colors"
        >
          {todo.completed ? (
            <CheckCircle size={24} className="text-green-600" />
          ) : (
            <Circle size={24} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold mb-1 ${
            todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
          }`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`text-sm mb-2 ${
              todo.completed ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {todo.description}
            </p>
          )}
          <p className="text-xs text-gray-400">
            {new Date(todo.created_at).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(todo)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;