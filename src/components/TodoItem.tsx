import React from 'react';

interface TodoItemProps {
  id: number;
  text: string;
  completed: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onAddSubtask: (parentId: number) => void;
  hasChildren: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  id, 
  text, 
  completed, 
  onToggle, 
  onDelete,
  onAddSubtask,
  hasChildren
}) => {
  return (
    <div className="todo-item" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      margin: '8px 0', 
      padding: '8px', 
      backgroundColor: completed ? '#f0f0f0' : 'white', 
      borderRadius: '4px',
      position: 'relative'
    }}>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
        style={{ marginRight: '10px' }}
        disabled={hasChildren && !completed}
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
      <div style={{ display: 'flex' }}>
        <button
          onClick={() => onAddSubtask(id)}
          style={{
            background: 'none',
            border: 'none',
            color: '#4caf50',
            cursor: 'pointer',
            fontSize: '16px',
            marginRight: '8px'
          }}
          title="Add subtask"
        >
          +
        </button>
        <button
          onClick={() => onDelete(id)}
          style={{
            background: 'none',
            border: 'none',
            color: '#ff6b6b',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          title="Delete task"
        >
          ✖
        </button>
      </div>
      {hasChildren && !completed && (
        <div style={{ 
          position: 'absolute', 
          top: '-4px', 
          right: '-4px', 
          backgroundColor: '#ff8800', 
          color: 'white',
          fontSize: '10px',
          padding: '2px 4px',
          borderRadius: '4px',
        }}>
          Has incomplete subtasks
        </div>
      )}
    </div>
  );
};

export default TodoItem; 