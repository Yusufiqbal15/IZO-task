'use client';

import { useState } from 'react';
import { CanvasElement } from '../page';
import { templates } from '../data/templates';

interface LeftSidebarProps {
  onAddElement: (element: Omit<CanvasElement, 'id'>) => void;
  onLoadTemplate?: (templateId: string) => void;
}

export default function LeftSidebar({ onAddElement, onLoadTemplate }: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<'fields' | 'templates'>('fields');

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
    <div className="w-72 bg-gray-800 text-white flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-2">Merge Fields</h2>
        <p className="text-sm text-gray-300">Drag & drop or click to insert fields</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('fields')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'fields' 
              ? 'bg-blue-600 text-white border-b-2 border-blue-400' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            All
          </div>
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'templates' 
              ? 'bg-blue-600 text-white border-b-2 border-blue-400' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          Templates
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'fields' ? (
          <div className="space-y-3">
            {/* Customer Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Customer
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors" onClick={handleAddHeading}>
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-white">Customer Name</div>
                    <div className="text-xs text-gray-400">Global Enterprises LLC</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors" onClick={handleAddText}>
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-white">Customer Email</div>
                    <div className="text-xs text-gray-400">billing@globalent.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors" onClick={handleAddText}>
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-white">Customer Phone</div>
                    <div className="text-xs text-gray-400">+1 (555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors" onClick={handleAddText}>
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-white">Customer Address</div>
                    <div className="text-xs text-gray-400">456 Corporate Blvd, New York...</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Company
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors" onClick={handleAddBox}>
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-white">Company</div>
                    <div className="text-xs text-gray-400">TechCorp Solutions Inc.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Financial
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors" onClick={handleAddImage}>
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-white">Dates</div>
                    <div className="text-xs text-gray-400">Invoice date, due date</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {templates.map((template) => (
              <button 
                key={template.id} 
                onClick={() => handleLoadTemplate(template.id)} 
                className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
              >
                <div className="text-sm font-medium text-white">{template.name}</div>
                <div className="text-xs text-gray-400 mt-1">Professional template</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
