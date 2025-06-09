
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from '../src/components/ThemeContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <ThemeProvider>
     <App />
     <ToastContainer />
  </ThemeProvider>
   
  // </StrictMode>,
)
