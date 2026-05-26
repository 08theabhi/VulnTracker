import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// No StrictMode - prevents double renders that cause API spam
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
