import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) onLogin(formData);
    console.log(isLogin ? 'Logging in with:' : 'Registering with:', formData);
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      backgroundColor: '#0b1120'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        padding: '2.5rem 2rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        border: '1px solid #334155',
        color: '#f8fafc'
      }}>
        {/* Header Badge & Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
            marginBottom: '1rem'
          }}>
            <Sparkles size={14} /> Enterprise AI Platform
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', margin: '0 0 0.5rem 0', letterSpacing: '-0.025em' }}>
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
            {isLogin ? 'Sign in to access your business analytics assistant' : 'Register with your email to start analyzing data'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          backgroundColor: '#0f172a',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '1.75rem',
          border: '1px solid #334155'
        }}>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '0.6rem',
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
              padding: '0.6rem',
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

        {/* Form Fields */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Email Address */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '0.7rem 0.9rem',
              transition: 'border-color 0.2s'
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

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#cbd5e1' }}>
                Password
              </label>
              {isLogin && (
                <a href="#forgot" style={{ fontSize: '0.775rem', color: '#60a5fa', textDecoration: 'none' }}>
                  Forgot password?
                </a>
              )}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '0.7rem 0.9rem'
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

          {/* Submit Button */}
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
              marginTop: '0.5rem',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            {isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Footer Security Note */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          color: '#64748b',
          fontSize: '0.775rem'
        }}>
          <ShieldCheck size={16} style={{ color: '#10b981' }} />
          Protected by Enterprise-grade SSL Encryption
        </div>
      </div>
    </div>
  );
}