import React from 'react';
import './App.css';
import ToDoItem from './ToDoItem';
import AddItemInput from './AddItemInput';

function App() {
  return (
    <>
    <div>
      <h1>To-Do List</h1>
      <AddItemInput />
      <ToDoItem />
    </div>
    </>
  );
}

export default App;
