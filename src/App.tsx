import React from 'react';
import './App.css';
import TodoList from './components/TodoList';

function App() {
  return (
    <div className="App">
      <div style={{ padding: '20px' }}>
        <TodoList />
      </div>
    </div>
  );
}

export default App;
