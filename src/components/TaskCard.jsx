import { useState } from 'react';
import { format } from '../utils/date';
import { Trash2, Pencil, CheckCircle2, Circle, CalendarDays, Flag } from 'lucide-react';

const PRIORITY_STYLES = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

export default function TaskCard({ task, onDelete, onEdit, onToggleStatus }) {
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete(task._id);
    }
  };

  const isCompleted = task.status === 'completed';

  return (
    <div
      className={`bg-white rounded-xl border p-4 flex flex-col gap-3 shadow-sm transition-opacity ${
        isCompleted ? 'opacity-60' : 'opacity-100'
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <button
            id={`toggle-${task._id}`}
            onClick={() => onToggleStatus(task._id)}
            className="mt-0.5 flex-shrink-0 text-blue-600 hover:text-blue-800 transition-colors"
            title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          >
            {isCompleted ? (
              <CheckCircle2 size={20} />
            ) : (
              <Circle size={20} className="text-gray-400 hover:text-blue-600" />
            )}
          </button>
          <h3
            className={`text-sm font-semibold leading-snug break-words ${
              isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
          >
            {task.title}
          </h3>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            id={`edit-${task._id}`}
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit task"
          >
            <Pencil size={14} />
          </button>
          <button
            id={`delete-${task._id}`}
            onClick={handleDelete}
            className={`p-1.5 rounded-lg transition-colors ${
              confirming
                ? 'bg-red-100 text-red-600'
                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
            }`}
            title={confirming ? 'Click again to confirm' : 'Delete task'}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 pl-7">
          {task.description}
        </p>
      )}

      {/* Footer: priority + due date */}
      <div className="flex items-center gap-2 pl-7 flex-wrap">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}
        >
          <Flag size={10} />
          {task.priority}
        </span>

        {task.dueDate && (
          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <CalendarDays size={11} />
            {format(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
}
