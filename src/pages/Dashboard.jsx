import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Activity, CheckCircle2, ArrowUpRight, Sparkles, MessageSquare, BookOpen, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%', color: '#f8fafc', boxSizing: 'border-box' }}>
      
      {/* 1. Welcome Enterprise Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.75rem', borderRadius: '20px', backgroundColor: '#3b82f61a', border: '1px solid #3b82f640', color: '#60a5fa', fontSize: '0.775rem', fontWeight: '600', marginBottom: '0.75rem' }}>
          <Sparkles size={14} /> AI-Powered Analytics Active
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 'bold', margin: '0 0 0.5rem 0', letterSpacing: '-0.025em' }}>
          Welcome back, Analyst
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0 0 1.5rem 0', maxWidth: '600px', lineHeight: '1.5' }}>
          Your schema-aware business analyst is synchronized with enterprise databases. Monitor live metrics, query schemas, or explore verified definitions below.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/chat')}
            style={{
              padding: '0.65rem 1.25rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <MessageSquare size={16} /> Start AI Query <ArrowUpRight size={16} />
          </button>
          <button
            onClick={() => navigate('/glossary')}
            style={{
              padding: '0.65rem 1.25rem',
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <BookOpen size={16} /> Explore Glossary
          </button>
        </div>
      </div>

      {/* 2. Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Card 1 */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '1.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500' }}>Total Glossary Terms</span>
            <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#3b82f61a', color: '#60a5fa' }}>
              <BookOpen size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.25rem' }}>24</div>
          <div style={{ color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>↑ +12% this month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500' }}>Active AI Queries</span>
            <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#8b5cf61a', color: '#a78bfa' }}>
              <Activity size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.25rem' }}>1,420</div>
          <div style={{ color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>↑ +5% today</span>
          </div>
        </div>

        {/* Card 3 */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500' }}>Verified Definitions</span>
            <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#10b9811a', color: '#34d399' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.25rem' }}>88%</div>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Target threshold: 90%</div>
        </div>

        {/* Card 4 */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500' }}>System Health</span>
            <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#10b9811a', color: '#10b981' }}>
              <Database size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.25rem' }}>Operational</div>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>99.9% uptime guaranteed</div>
        </div>
      </div>

    </div>
  );
}