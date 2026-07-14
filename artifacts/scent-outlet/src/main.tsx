import { createRoot } from 'react-dom/client';

import App from './App';
import { registerAdminAuth } from './lib/admin-auth';

import './index.css';

registerAdminAuth();

createRoot(document.getElementById('root')!).render(<App />);
