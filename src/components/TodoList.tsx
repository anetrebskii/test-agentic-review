import React, { useState } from 'react';
import TodoItem from './TodoItem';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  parentId: number | null;
  children: number[];
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() === '') return;
    
    const newTodo: Todo = {
      id: Date.now(),
      text: inputText,
      completed: false,
      parentId: parentId,
      children: []
    };
    
    setTodos(prevTodos => {
      // If this is a subtask, update the parent's children array
      if (parentId !== null) {
        return prevTodos.map(todo => 
          todo.id === parentId 
            ? { ...todo, children: [...todo.children, newTodo.id] } 
            : todo
        ).concat(newTodo);
      }
      
      return [...prevTodos, newTodo];
    });
    
    setInputText('');
  };

  const handleToggleTodo = (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    // Check if all children are completed (if any)
    const canBeToggled = todo.children.length === 0 || 
      todo.children.every(childId => 
        todos.find(t => t.id === childId)?.completed
      );
    
    // Only toggle if it's not a parent task or if all children are completed
    if (!todo.completed || canBeToggled) {
      setTodos(prevTodos => {
        // Update the todo and potentially its children
        const updatedTodos = prevTodos.map(t => {
          if (t.id === id) {
            return { ...t, completed: !t.completed };
          }
          
          // If parent is being unchecked, uncheck all children recursively
          if (t.parentId === id && !todo.completed) {
            return { ...t, completed: false };
          }
          
          return t;
        });
        
        // If this todo has a parent, check if parent needs to be updated
        if (todo.parentId !== null) {
          const parentTodo = updatedTodos.find(t => t.id === todo.parentId);
          if (parentTodo) {
            // Check if all siblings are now completed
            const allSiblingsCompleted = parentTodo.children.every(childId => 
              updatedTodos.find(t => t.id === childId)?.completed
            );
            
            // If all siblings are completed, update parent too
            if (allSiblingsCompleted) {
              return updatedTodos.map(t => 
                t.id === todo.parentId ? { ...t, completed: true } : t
              );
            }
            
            // If any sibling is not completed, ensure parent is not completed
            return updatedTodos.map(t => 
              t.id === todo.parentId ? { ...t, completed: false } : t
            );
          }
        }
        
        return updatedTodos;
      });
    }
  };

  const handleDeleteTodo = (id: number) => {
    const todoToDelete = todos.find(t => t.id === id);
    if (!todoToDelete) return;
    
    setTodos(prevTodos => {
      // First, remove this todo from its parent's children array
      let updatedTodos = prevTodos;
      if (todoToDelete.parentId !== null) {
        updatedTodos = updatedTodos.map(todo => 
          todo.id === todoToDelete.parentId
            ? { ...todo, children: todo.children.filter(childId => childId !== id) }
            : todo
        );
      }
      
      // Get all descendant IDs to be removed
      const idsToRemove = getDescendantIds(id, prevTodos);
      idsToRemove.push(id); // Add the current ID
      
      // Filter out the deleted todo and all its descendants
      return updatedTodos.filter(todo => !idsToRemove.includes(todo.id));
    });
  };
  
  // Helper function to get all descendant IDs recursively
  const getDescendantIds = (parentId: number, todoList: Todo[]): number[] => {
    const childIds: number[] = [];
    const children = todoList.filter(t => t.parentId === parentId);
    
    children.forEach(child => {
      childIds.push(child.id);
      childIds.push(...getDescendantIds(child.id, todoList));
    });
    
    return childIds;
  };
  
  // Add subtask to a specific parent
  const handleAddSubtask = (parentId: number) => {
    setParentId(parentId);
    setInputText('');
  };
  
  // Reset parent ID when canceling add subtask
  const handleCancelAddSubtask = () => {
    setParentId(null);
  };

  // Render todos in a hierarchical structure
  const renderTodos = (parentId: number | null = null, level: number = 0) => {
    const filteredTodos = todos.filter(todo => todo.parentId === parentId);
    
    if (filteredTodos.length === 0 && parentId === null) {
      return (
        <p style={{ textAlign: 'center', color: '#888' }}>No tasks yet. Add one above!</p>
      );
    }
    
    return filteredTodos.map(todo => (
      <div key={todo.id} style={{ marginLeft: `${level * 20}px` }}>
        <TodoItem
          id={todo.id}
          text={todo.text}
          completed={todo.completed}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          onAddSubtask={handleAddSubtask}
          hasChildren={todo.children.length > 0}
        />
        {/* Render children recursively */}
        {renderTodos(todo.id, level + 1)}
      </div>
    ));
  };

  return (
    <div className="todo-list" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Todo List</h1>
      
      <form onSubmit={handleAddTodo} style={{ display: 'flex', marginBottom: '20px', flexDirection: 'column' }}>
        {parentId !== null && (
          <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#555' }}>
              Adding subtask to: {todos.find(t => t.id === parentId)?.text}
            </span>
            <button 
              type="button" 
              onClick={handleCancelAddSubtask}
              style={{
                marginLeft: '8px',
                padding: '2px 6px',
                fontSize: '12px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        )}
        
        <div style={{ display: 'flex' }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={parentId === null ? "Add a new task..." : "Add a new subtask..."}
            style={{
              flex: 1,
              padding: '8px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px 0 0 4px'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer'
            }}
          >
            Add
          </button>
        </div>
      </form>
      
      <div className="todos-container">
        {renderTodos()}
      </div>
    </div>
  );
};

export default TodoList; 