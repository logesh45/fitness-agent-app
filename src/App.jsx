import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProfileSetup from './components/ProfileSetup/ProfileSetup';
import Dashboard from './components/Dashboard/Dashboard';

// A component to handle the root routing logic
const Home = () => {
  const sessionToken = localStorage.getItem('sessionToken');
  // If token exists, go to dashboard, otherwise go to profile setup
  return sessionToken ? <Navigate to="/dashboard" replace /> : <Navigate to="/profile" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/profile" element={<ProfileSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* The root path will handle redirection logic */}
        <Route path="/" element={<Home />} />
        {/* Add a catch-all to redirect to home if no route matches */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
