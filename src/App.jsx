import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ChatInterface from './pages/ChatInterface';
import Glossary from './pages/Glossary';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<ChatInterface />} />
          <Route path="glossary" element={<Glossary />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;