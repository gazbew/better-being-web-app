import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Debug: log when entrypoint runs
console.log('[DEBUG] main.tsx: createRoot render starting');
createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
);
console.log('[DEBUG] main.tsx: createRoot render called');
