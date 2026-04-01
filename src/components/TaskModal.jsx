import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const defaultForm = {
  title: '',
  description: '',
  priority: 'low',
  status: 'pending',
  dueDate: '',
};

export default function TaskModal({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'low',
        status: initialData.status || 'pending',
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split('T')[0]
          : '',
      });
    } else {
      setForm(defaultForm);
    }
    setError('');
    
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEditing ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1" htmlFor="modal-title">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="modal-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Task title"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1" htmlFor="modal-desc">
              Description
            </label>
            <textarea
              id="modal-desc"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional details..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Priority + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1" htmlFor="modal-priority">
                Priority
              </label>
              <select
                id="modal-priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1" htmlFor="modal-status">
                Status
              </label>
              <select
                id="modal-status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1" htmlFor="modal-due">
              Due Date
            </label>
            <input
              id="modal-due"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
