import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

/**
 * Este ficheiro é o ponto de entrada da aplicação.
 * Ele localiza o elemento 'root' no index.html e injeta o sistema lá dentro.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
