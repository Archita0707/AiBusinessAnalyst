import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Database } from 'lucide-react';

export default function Auth({ onLogin }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });

  // Handle Form Submission (Sign In / Register)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) onLogin(formData);
    console.log(isLogin ? 'Logging in with:' : 'Registering with:', formData);
    
    // Smooth navigation to Dashboard after authentication
    navigate('/dashboard');
  };

  // Handle Forgot Password Action
  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!formData.email) {
      alert('Please enter your email address first, then click "Forgot password?".');
      return;
    }
    alert(`Password reset instructions have been sent to: ${formData.email}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backgroundColor: '#0b1120',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        padding: 'clamp(1.5rem, 5vw, 2.5rem)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        border: '1px solid #334155',
        color: '#f8fafc',
        boxSizing: 'border-box'
      }}>
        {/* Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            backgroundColor: '#3b82f61a',
            border: '1px solid #3b82f640',
            color: '#60a5fa',
            fontSize: '0.8rem',
            fontWeight: '600',
            marginBottom: '0.75rem'
          }}>
            <Database size={15} /> Schema-Aware AI
          </div>
          <h2 style={{ fontSize: 'clamp(1.35rem, 4vw, 1.75rem)', fontWeight: '700', margin: '0 0 0.5rem 0' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0, lineHeight: '1.4' }}>
            {isLogin 
              ? 'Sign in to access Schema-Aware AI Business Analyst' 
              : 'Register with your email to start analyzing schema data'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          backgroundColor: '#0f172a',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          border: '1px solid #334155'
        }}>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '0.65rem 0.5rem',
              border: 'none',
              borderRadius: '7px',
              backgroundColor: isLogin ? '#2563eb' : 'transparent',
              color: isLogin ? '#ffffff' : '#94a3b8',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '0.65rem 0.5rem',
              border: 'none',
              borderRadius: '7px',
              backgroundColor: !isLogin ? '#2563eb' : 'transparent',
              color: !isLogin ? '#ffffff' : '#94a3b8',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Register
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Email Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '0.7rem 0.85rem'
            }}>
              <Mail size={18} style={{ color: '#64748b', marginRight: '0.75rem', flexShrink: 0 }} />
              <input
                type="email"
                placeholder="name@company.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#cbd5e1' }}>
                Password
              </label>
              {isLogin && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '0.775rem',
                    color: '#60a5fa',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '0.7rem 0.85rem'
            }}>
              <Lock size={18} style={{ color: '#64748b', marginRight: '0.75rem', flexShrink: 0 }} />
              <input
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Action Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.8rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.25rem',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            {isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Security Footer Badge */}
        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1rem',
          borderTop: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          color: '#64748b',
          fontSize: '0.775rem',
          textAlign: 'center'
        }}>
          <ShieldCheck size={16} style={{ color: '#10b981', flexShrink: 0 }} />
          Protected by Enterprise-grade SSL Encryption
        </div>
      </div>
    </div>
  );
}