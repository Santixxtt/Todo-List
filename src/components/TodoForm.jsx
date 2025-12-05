import { useState } from 'react';
import { Save, X } from 'lucide-react';

const TodoForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Título de la tarea..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
          autoFocus
        />
      </div>
      <div className="mb-4">
        <textarea
          placeholder="Descripción (opcional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          rows={3}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save size={18} />
          {initialData ? 'Actualizar' : 'Agregar'}
        </button>
        {initialData && (
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            <X size={18} />
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoForm;