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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', padding: '40px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#f97316', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '36px', height: '36px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', margin: '0' }}>
              Invoice creater
            </h1>
            <p style={{ fontSize: '18px', color: '#bfdbfe', margin: '4px 0 0 0' }}>
              Modern Minimal
            </p>
          </div>
        </div>
        <p style={{ fontSize: '18px', color: '#bfdbfe', margin: 0 }}>
          Create beautiful invoices and documents in minutes
        </p>
      </div>

      {/* Options */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Blank Option */}
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>
            Start Fresh
          </h2>
          <button
            onClick={onCreateBlank}
            style={{
              padding: '60px 40px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '3px dashed rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.3s',
              width: '100%',
              maxWidth: '300px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '15px', color: 'white' }}>+</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>
              Blank Document
            </h3>
            <p style={{ fontSize: '14px', color: '#bfdbfe', margin: 0 }}>
              Start from scratch
            </p>
          </button>
        </div>

        {/* Templates Section */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>
            Choose a Template
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template.id)}
                style={{
                  padding: '60px 40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '2px solid #f97316',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
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
      <div style={{ textAlign: 'center', marginTop: '60px', color: '#bfdbfe', fontSize: '14px' }}>
        <p>💡 Tip: Choose a template to get started quickly or create your own from scratch</p>
      </div>
    </div>
  );
}
