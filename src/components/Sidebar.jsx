import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, BookOpen, LayoutDashboard } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Chat Interface', icon: MessageSquare },
    { path: '/glossary', label: 'Business Glossary', icon: BookOpen },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <aside style={{ width: '240px', backgroundColor: '#1e293b', color: '#fff', height: '100vh', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '2rem', color: '#818cf8' }}>Enterprise AI</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 1rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? '#4f46e5' : 'transparent',
                fontWeight: '500'
              }}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}