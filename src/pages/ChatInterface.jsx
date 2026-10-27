import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Database, ArrowRight } from 'lucide-react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your Schema Analyst Assistant. How can I help you analyze database schemas, metric definitions, or business rules today?' }
  ]);
  const [input, setInput] = useState('');

  const quickPrompts = [
    "Analyze schema drift in customers table",
    "What is the definition of Monthly Active Users?",
    "Generate SQL query for top 5 products"
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: `Analyzing schema metadata for: "${query}". All relational constraints and metric definitions appear consistent with the business glossary.` }
      ]);
    }, 800);
  };

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>
          Chat Interface
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
          Interact with the Schema-Aware AI Assistant using natural language queries.
        </p>
      </div>

      {/* Main Chat Container */}
      <div style={{
        flex: 1,
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
      }}>
        
        {/* Messages Scroll Area */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%'
            }}>
              {msg.sender === 'ai' && (
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#3b82f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0
                }}>
                  <Bot size={18} />
                </div>
              )}
              
              <div style={{
                padding: '0.9rem 1.1rem',
                borderRadius: '12px',
                backgroundColor: msg.sender === 'user' ? '#2563eb' : '#0f172a',
                color: '#f8fafc',
                fontSize: '0.9rem',
                lineHeight: '1.5',
                border: msg.sender === 'ai' ? '1px solid #334155' : 'none'
              }}>
                {msg.text}
              </div>

              {msg.sender === 'user' && (
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#475569',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0
                }}>
                  <User size={18} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0f172a80', borderTop: '1px solid #334155', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '20px',
                padding: '0.35rem 0.75rem',
                color: '#94a3b8',
                fontSize: '0.775rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              ✨ {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '1rem 1.5rem', backgroundColor: '#0f172a', borderTop: '1px solid #334155' }}>
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Ask a question about database schemas or metrics..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '10px',
                padding: '0.8rem 1rem',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.8rem 1.25rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}