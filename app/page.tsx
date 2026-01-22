import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Launchpad HubSpot API',
  description: 'Backend API for Launchpad HubSpot integration',
};

export default function Home() {
  return (
    <main style={{ 
      padding: '2rem', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto' 
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        🚀 Launchpad HubSpot API
      </h1>
      
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Backend API for managing Launchpad incubator data in HubSpot.
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>API Endpoints</h2>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '1rem', 
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.9rem'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>GET</strong> /api/auth - Verify connection
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>GET</strong> /api/contacts - List all contacts
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>POST</strong> /api/contacts - Search contacts
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>GET</strong> /api/contacts/[id] - Get contact by ID
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>PUT</strong> /api/contacts/[id] - Update contact
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>GET</strong> /api/founders - Get founders
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>POST</strong> /api/founders - Search founders
          </div>
          <div>
            <strong>GET</strong> /api/associations - Get associations
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Quick Test</h2>
        <p style={{ color: '#666', marginBottom: '0.5rem' }}>
          Test the authentication endpoint:
        </p>
        <code style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          curl {typeof window !== 'undefined' ? window.location.origin : ''}/api/auth
        </code>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Documentation</h2>
        <p style={{ color: '#666' }}>
          For full documentation, see the README.md file in the backend directory.
        </p>
      </section>
    </main>
  );
}