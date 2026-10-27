import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MessageSquare, BookOpen, LayoutDashboard, LogOut, Database } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/chat', label: 'Chat Interface', icon: MessageSquare },
    { path: '/glossary', label: 'Business Glossary', icon: BookOpen }
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/login', { replace: true });
  };

  return (
    <aside style={{ 
      width: '240px', 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      borderRight: '1px solid #1e293b', 
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        {/* Updated Project Branding */}
        <div style={{ 
          color: '#60a5fa', 
          fontSize: '1.1rem', 
          fontWeight: '700', 
          marginBottom: '2rem', 
          paddingLeft: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Database size={20} style={{ color: '#3b82f6' }} />
          <span>Business Analyst</span>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  backgroundColor: isActive ? '#3b82f6' : 'transparent',
                  transition: 'all 0.2s ease'
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            fontWeight: '500',
            fontSize: '0.9rem',
            color: '#ef4444',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}