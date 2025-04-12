import React, { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { text: newTask, time: newTaskTime, completed: false }]);
      setNewTask('');
      setNewTaskTime('');
    }
  };

  const toggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Daily Planner</h1>
        <div className="input-container">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            className="task-input"
          />
          <input
            type="time"
            value={newTaskTime}
            onChange={(e) => setNewTaskTime(e.target.value)}
            className="time-input"
          />
          <button onClick={addTask} className="add-button">Add Task</button>
        </div>
        <div className="tasks-container">
          {tasks.map((task, index) => (
            <div key={index} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-content">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(index)}
                  className="task-checkbox"
                />
                <span className="task-text">{task.text}</span>
                <span className="task-time">{task.time}</span>
              </div>
              <button onClick={() => deleteTask(index)} className="delete-button">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App; 