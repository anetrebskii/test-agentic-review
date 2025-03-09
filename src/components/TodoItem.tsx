import React from 'react';

interface TodoItemProps {
  id: number;
  text: string;
  completed: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, text, completed, onToggle, onDelete }) => {
  return (
    <div className="todo-item" style={{ display: 'flex', alignItems: 'center', margin: '8px 0', padding: '8px', backgroundColor: completed ? '#f0f0f0' : 'white', borderRadius: '4px' }}>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
        style={{ marginRight: '10px' }}
      />
      <span
        style={{
          flex: 1,
          textDecoration: completed ? 'line-through' : 'none',
          color: completed ? '#888' : '#000'
        }}
      >
        {text}
      </span>
      <button
        onClick={() => onDelete(id)}
        style={{
          background: 'none',
          border: 'none',
          color: '#ff6b6b',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        ✖
      </button>
    </div>
  );
};

export default TodoItem; 