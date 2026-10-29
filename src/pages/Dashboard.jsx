export default function Dashboard() {
  const stats = [
    { label: 'Total Glossary Terms', value: '24', change: '+12% this month' },
    { label: 'Active AI Queries', value: '1,420', change: '+5% today' },
    { label: 'Verified Definitions', value: '88%', change: 'Target: 90%' },
    { label: 'System Health', value: 'Operational', change: '99.9% uptime' },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Dashboard Overview</h2>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Real-time metrics and system performance.</p>

      {/* Grid of Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map((stat, index) => (
          <div key={index} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem', padding: '1.25rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{stat.label}</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#fff' }}>{stat.value}</h3>
            <span style={{ fontSize: '0.75rem', color: '#34d399' }}>{stat.change}</span>
          </div>
        ))}
      </div>
    </div>
  );
}