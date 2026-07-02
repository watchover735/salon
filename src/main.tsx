import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// StrictMode intentionally omitted: its dev double-invoke of effects
// creates duplicate Lenis instances and doubled GSAP ScrollTriggers.
createRoot(document.getElementById('root')!).render(<App />)
