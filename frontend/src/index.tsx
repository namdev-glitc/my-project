import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Ensure dark mode class is present on first load if no preference is set
const savedTheme = localStorage.getItem('theme');
if (!savedTheme || savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
  localStorage.setItem('theme', 'dark');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



