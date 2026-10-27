import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ChatInterface from './pages/ChatInterface';
import Glossary from './pages/Glossary';
import Auth from './pages/Auth';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Entry Point: Full-Screen Login / Register */}
        <Route path="/login" element={<Auth />} />

        {/* Dashboard Layout Views */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chat" element={<ChatInterface />} />
          <Route path="glossary" element={<Glossary />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}