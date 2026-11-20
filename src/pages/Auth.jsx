import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Database,
  Sparkles,
  BarChart3,
  BrainCircuit
} from 'lucide-react';

import './Auth.css';

export default function Auth({ onLogin }) {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Handle Login and Registration
  const handleSubmit = (e) => {
    e.preventDefault();

    if (onLogin) {
      onLogin(formData);
    }

    console.log(
      isLogin ? 'Logging in with:' : 'Registering with:',
      formData
    );

    navigate('/dashboard');
  };

  // Handle Forgot Password
  const handleForgotPassword = (e) => {
    e.preventDefault();

    if (!formData.email) {
      alert('Please enter your email address first.');
      return;
    }

    alert(
      `Password reset instructions have been sent to: ${formData.email}`
    );
  };

  return (
    <div className="auth-page">

      {/* LEFT VISUAL SECTION */}

      <div className="auth-visual">

        <div className="visual-content">

          {/* Heading Badge */}

          <div className="visual-badge">
            <Sparkles size={17} />
            AI-Powered Analytics
          </div>

          {/* Main Heading */}

          <h1>
            Transform Data
            <br />
            Into <span>Intelligence.</span>
          </h1>

          <p className="visual-description">
            Unlock the power of AI to analyze,
            visualize and grow your business.
            Make smarter decisions with intelligent insights.
          </p>


          {/* AI ILLUSTRATION */}

          <div
            className="illustration-container"
            style={{ position: 'relative' }}
          >

            


            {/* SQL Query Floating Card */}

            <div className="sql-card">

              <div className="sql-header">

                <Database size={17} />

                <span>AI Generated SQL</span>

                <span className="sql-status"></span>

              </div>

              <div className="sql-code">

                <span>SELECT</span> * <span>FROM</span>

                <br />

                <span>customers</span>

                <br />

                <span>WHERE</span> revenue &gt; 50000;

              </div>

              <div className="sql-success">
                ✓ Query Generated Successfully
              </div>

            </div>


            {/* Smart Database Card */}

            <div className="floating-card card-one">

              <Database size={22} />

              <div>
                <strong>Smart Database</strong>
                <small>Schema Connected</small>
              </div>

            </div>


            {/* Data Analytics Card */}

            <div className="floating-card card-two">

              <BarChart3 size={23} />

              <div>
                <strong>Data Analytics</strong>
                <small>Insights Generated</small>
              </div>

            </div>


            {/* AI Processing Card */}

            <div className="floating-card card-three">

              <BrainCircuit size={23} />

              <div>
                <strong>AI Processing</strong>
                <small>Intelligent Analysis</small>
              </div>

            </div>


            {/* Revenue Insights Chart */}

            <div className="chart-card">

              <div className="chart-title">

                <BarChart3 size={16} />

                <span>Revenue Insights</span>

              </div>

              <div className="chart-bars">

                <span style={{ height: '35%' }}></span>

                <span style={{ height: '60%' }}></span>

                <span style={{ height: '45%' }}></span>

                <span style={{ height: '80%' }}></span>

                <span style={{ height: '65%' }}></span>

                <span style={{ height: '95%' }}></span>

              </div>

            </div>

          </div>


          {/* Visual Footer */}

          <div className="visual-footer">

            <span></span>

            Intelligent Analytics • Smarter Decisions

          </div>

        </div>

      </div>


      {/* RIGHT LOGIN SECTION */}

      <div className="auth-form-section">

        <div className="auth-card">


          {/* Branding */}

          <div className="auth-header">

            <div className="auth-brand">

              <Database size={16} />

              Schema-Aware AI

            </div>

            <h2>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>

            <p>
              {isLogin
                ? 'Sign in to access Schema-Aware AI Business Analyst'
                : 'Register with your email to start analyzing schema data'}
            </p>

          </div>


          {/* Login / Register Tabs */}

          <div className="auth-tabs">

            <button
              type="button"
              className={isLogin ? 'active' : ''}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>

            <button
              type="button"
              className={!isLogin ? 'active' : ''}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>

          </div>


          {/* Authentication Form */}

          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >

            {/* Email */}

            <div className="form-group">

              <label>Email Address</label>

              <div className="input-wrapper">

                <Mail size={18} />

                <input
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value
                    })
                  }
                />

              </div>

            </div>


            {/* Password */}

            <div className="form-group">

              <div className="password-label">

                <label>Password</label>

                {isLogin && (

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="forgot-password"
                  >
                    Forgot password?
                  </button>

                )}

              </div>

              <div className="input-wrapper">

                <Lock size={18} />

                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value
                    })
                  }
                />

              </div>

            </div>


            {/* Submit Button */}

            <button
              type="submit"
              className="submit-button"
            >

              {isLogin ? 'Sign In' : 'Create Account'}

              <ArrowRight size={19} />

            </button>

          </form>


          {/* Security Footer */}

          <div className="auth-security">

            <ShieldCheck size={17} />

            <span>
              Protected by Enterprise-grade SSL Encryption
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}