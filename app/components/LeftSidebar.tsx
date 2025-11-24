'use client';

import { useState } from 'react';
import { CanvasElement } from '../page';
import { templates } from '../data/templates';

interface LeftSidebarProps {
  onAddElement: (element: Omit<CanvasElement, 'id'>) => void;
  onLoadTemplate?: (templateId: string) => void;
}

export default function LeftSidebar({ onAddElement, onLoadTemplate }: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<'add' | 'templates'>('add');

  const handleAddHeading = () => {
    onAddElement({
      type: 'heading',
      x: 100,
      y: 100,
      width: 300,
      height: 40,
      content: 'Heading Text',
      fontSize: 24,
      fontWeight: 'bold',
      fontStyle: 'normal',
      color: '#000000',
      zIndex: 0,
    });
  };

  const handleAddText = () => {
    onAddElement({
      type: 'paragraph',
      x: 100,
      y: 150,
      width: 400,
      height: 60,
      content: 'Paragraph text goes here...',
      fontSize: 14,
      fontWeight: 'normal',
      fontStyle: 'normal',
      color: '#333333',
      zIndex: 0,
    });
  };

  const handleAddBox = () => {
    onAddElement({
      type: 'shape',
      x: 100,
      y: 200,
      width: 150,
      height: 150,
      shapeType: 'rectangle',
      backgroundColor: '#3b82f6',
      zIndex: 0,
    });
  };

  const handleAddImage = () => {
    onAddElement({
      type: 'image',
      x: 100,
      y: 300,
      width: 200,
      height: 200,
      zIndex: 0,
    });
  };

  const handleLoadTemplate = (templateId: string) => {
    onLoadTemplate?.(templateId);
  };

  return (
    <div style={{
      width: '280px',
      backgroundColor: '#f8fafc',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
      }}>
        <button
          onClick={() => setActiveTab('add')}
          style={{
            flex: 1,
            padding: '12px 16px',
            backgroundColor: activeTab === 'add' ? '#2563eb' : '#f8fafc',
            color: activeTab === 'add' ? '#ffffff' : '#64748b',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          + Add
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          style={{
            flex: 1,
            padding: '12px 16px',
            backgroundColor: activeTab === 'templates' ? '#2563eb' : '#f8fafc',
            color: activeTab === 'templates' ? '#ffffff' : '#64748b',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
           Templates
        </button>
      </div>

      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {activeTab === 'add' ? (
          <>
            <button onClick={handleAddHeading} style={{ padding: '12px 16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', color: '#1e293b' }}>
               Heading
            </button>
            <button onClick={handleAddText} style={{ padding: '12px 16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', color: '#1e293b' }}>
               Text
            </button>
            <button onClick={handleAddBox} style={{ padding: '12px 16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', color: '#1e293b' }}>
               Box
            </button>
            <button onClick={handleAddImage} style={{ padding: '12px 16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', color: '#1e293b' }}>
               📷 Image
            </button>
          </>
        ) : (
          <>
            {templates.map((template) => (
              <button key={template.id} onClick={() => handleLoadTemplate(template.id)} style={{ padding: '12px 16px', backgroundColor: '#ffffff', border: '2px solid #2563eb', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', color: '#2563eb' }}>
                {template.name}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
