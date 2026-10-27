import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div style={{
      display: 'flex',
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#0b1120',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content View Container */}
      <main style={{
        flex: 1,
        minWidth: 0, /* Prevents content from overflowing horizontal bounds */
        minHeight: '100vh',
        padding: '2rem',
        boxSizing: 'border-box',
        backgroundColor: '#0b1120'
      }}>
        <Outlet />
      </main>
    </div>
  );
}
