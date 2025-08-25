import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Ultra-minimal entry point for debugging
const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Clean Entry Point Test</h1>
      <p>If you can see this, the build system is working correctly.</p>
      <p>Time: {new Date().toISOString()}</p>
    </div>
  )
} else {
  console.error('Root element not found')
}