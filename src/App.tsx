import { AuthProvider } from './auth/AuthContext';
import Router from './routes/Router';
import './index.css'; // ודאי שהקובץ הזה מיובא כאן

function App() {
  return (
    <AuthProvider>
      <Router />     
    </AuthProvider>
  );
}

export default App;