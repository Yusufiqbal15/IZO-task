'use client';

import { templates } from '../data/templates';

interface StartPageProps {
  onSelectTemplate: (templateId: string) => void;
  onCreateBlank: () => void;
}

const templateIcons: Record<string, string> = {
  'invoice': '📋',
  'modern-box': '🎨',
  'resume-minimal': '📄',
};

export default function StartPage({
  onSelectTemplate,
  onCreateBlank,
}: StartPageProps) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f9ff', padding: '40px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 10px 0' }}>
          Invoice & Document Designer
        </h1>
        <p style={{ fontSize: '18px', color: '#64748b', margin: 0 }}>
          Create beautiful documents and invoices in minutes
        </p>
      </div>

      {/* Options */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Blank Option */}
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>
            Start Fresh
          </h2>
          <button
            onClick={onCreateBlank}
            style={{
              padding: '60px 40px',
              backgroundColor: '#ffffff',
              border: '3px dashed #cbd5e1',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.3s',
              width: '100%',
              maxWidth: '300px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>+</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>
              Blank Document
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Start from scratch
            </p>
          </button>
        </div>

        {/* Templates Section */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>
            Choose a Template
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template.id)}
                style={{
                  padding: '60px 40px',
                  backgroundColor: '#ffffff',
                  border: '3px solid #2563eb',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.1)';
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '15px' }}>
                  {templateIcons[template.id] || '📝'}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>
                  {template.name}
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                  {template.id === 'invoice' && 'Professional invoice template'}
                  {template.id === 'modern-box' && 'Modern box design with colors'}
                  {template.id === 'resume-minimal' && 'Clean minimalist resume'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '60px', color: '#94a3b8', fontSize: '14px' }}>
        <p>💡 Tip: Choose a template to get started quickly or create your own from scratch</p>
      </div>
    </div>
  );
}
