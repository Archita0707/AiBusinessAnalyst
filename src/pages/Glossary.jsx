import React, { useState } from 'react';
import { Search, BookOpen, Tag } from 'lucide-react';

// Built-in mock data so it never fails to load
const initialGlossaryTerms = [
  { id: 1, term: 'Schema Drift', definition: 'Unexpected changes in database schema structures that can break downstream AI analytical models.', category: 'Database' },
  { id: 2, term: 'Entity Resolution', definition: 'The process of determining whether distinct records in different data sources refer to the same real-world entity.', category: 'Analytics' },
  { id: 3, term: 'Semantic Layer', definition: 'A business representation of corporate data that helps users query data using common business terminology.', category: 'Architecture' },
  { id: 4, term: 'Metadata Repository', definition: 'A centralized database storing descriptions, lineage, and structural definitions of enterprise data assets.', category: 'Governance' },
  { id: 5, term: 'Data Lineage', definition: 'The lifecycle of data that highlights its origins and where it moves over time across business pipelines.', category: 'Governance' }
];

export default function Glossary() {
  const [terms] = useState(initialGlossaryTerms);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter terms based on search input and category selection
  const filteredTerms = terms.filter((item) => {
    const matchesSearch = 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for filter tabs
  const categories = ['All', ...new Set(terms.map((item) => item.category))];

  return (
    <div style={{ width: '100%', color: '#f8fafc', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
          Business Glossary
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
          Centralized dictionary for schema terms, metric definitions, and enterprise rules.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        {/* Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '0.6rem 0.85rem',
          width: '100%',
          maxWidth: '380px'
        }}>
          <Search size={18} style={{ color: '#64748b', marginRight: '0.75rem', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search glossary terms or definitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid #334155',
                fontSize: '0.825rem',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: selectedCategory === cat ? '#2563eb' : '#1e293b',
                color: selectedCategory === cat ? '#ffffff' : '#94a3b8',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary Table */}
      <div style={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: '600', width: '25%' }}>Term</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: '600', width: '55%' }}>Definition</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: '600', width: '20%' }}>Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredTerms.length > 0 ? (
                filteredTerms.map((item, index) => (
                  <tr
                    key={item.id || index}
                    style={{
                      borderBottom: index === filteredTerms.length - 1 ? 'none' : '1px solid #334155',
                      backgroundColor: 'transparent'
                    }}
                  >
                    {/* Term */}
                    <td style={{ padding: '1rem 1.25rem', fontWeight: '600', color: '#60a5fa' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BookOpen size={16} style={{ color: '#3b82f6', flexShrink: 0 }} />
                        <span>{item.term}</span>
                      </div>
                    </td>

                    {/* Definition */}
                    <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                      {item.definition}
                    </td>

                    {/* Category */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        color: '#94a3b8',
                        fontSize: '0.775rem',
                        fontWeight: '500'
                      }}>
                        <Tag size={12} />
                        {item.category}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    No terms found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}