'use client';

import { useState, useEffect } from 'react';
import { CanvasElement } from '../page';
import { templates } from '../data/templates';

interface LeftSidebarProps {
  onAddElement: (element: Omit<CanvasElement, 'id'>) => void;
  onLoadTemplate?: (templateId: string) => void;
}

export default function LeftSidebar({ onAddElement, onLoadTemplate }: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<'fields' | 'templates'>('fields');
  const [activeFieldTab, setActiveFieldTab] = useState<'customer' | 'company' | 'financial' | 'dates'>('customer');
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleAddElement = (element: Omit<CanvasElement, 'id'>) => {
    onAddElement(element);
    if (isMobile) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 left-6 z-40 p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        isMobile 
          ? `fixed left-0 top-16 bottom-0 w-80 z-40 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}` 
          : 'w-72'
      } bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col h-full overflow-hidden shadow-2xl`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Merge Fields
          </h2>
          <p className="text-xs text-blue-100">Click to add elements to canvas</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 bg-slate-800">
          <button
            onClick={() => setActiveTab('fields')}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === 'fields' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg' 
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              </svg>
              Fields
            </div>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === 'templates' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg' 
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Templates
            </div>
          </button>
        </div>

        {/* Merge Fields Tabs */}
        {activeTab === 'fields' && (
          <div className="border-b border-slate-700 flex gap-0 mb-4">
            <button
              onClick={() => setActiveFieldTab('customer')}
              className={`flex-1 px-2 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                activeFieldTab === 'customer'
                  ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setActiveFieldTab('company')}
              className={`flex-1 px-2 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                activeFieldTab === 'company'
                  ? 'bg-green-600 text-white border-b-2 border-green-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Company
            </button>
            <button
              onClick={() => setActiveFieldTab('financial')}
              className={`flex-1 px-2 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                activeFieldTab === 'financial'
                  ? 'bg-yellow-600 text-white border-b-2 border-yellow-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Financial
            </button>
            <button
              onClick={() => setActiveFieldTab('dates')}
              className={`flex-1 px-2 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                activeFieldTab === 'dates'
                  ? 'bg-purple-600 text-white border-b-2 border-purple-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Dates
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          {activeTab === 'fields' ? (
            <div className="space-y-2">
              {/* Customer Fields */}
              {activeFieldTab === 'customer' && (
                <>
                  <button onClick={() => handleAddElement({ type: 'heading', x: 100, y: 100, width: 300, height: 40, content: 'Customer Name', fontSize: 24, fontWeight: 'bold', fontStyle: 'normal', color: '#000000', zIndex: 0 })} className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-blue-600 rounded-lg transition-all hover:translate-x-1 cursor-pointer group">
                    <svg className="w-4 h-4 text-blue-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">Customer Name</div>
                      <div className="text-xs text-slate-300">Global Enterprises LLC</div>
                    </div>
                  </button>
                  <button onClick={() => handleAddElement({ type: 'paragraph', x: 100, y: 150, width: 400, height: 60, content: 'billing@globalent.com', fontSize: 14, fontWeight: 'normal', fontStyle: 'normal', color: '#333333', zIndex: 0 })} className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-blue-600 rounded-lg transition-all hover:translate-x-1 cursor-pointer group">
                    <svg className="w-4 h-4 text-blue-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">Customer Email</div>
                      <div className="text-xs text-slate-300">billing@globalent.com</div>
                    </div>
                  </button>
                  <button onClick={() => handleAddElement({ type: 'paragraph', x: 100, y: 220, width: 400, height: 60, content: '+1 (555) 123-4567', fontSize: 14, fontWeight: 'normal', fontStyle: 'normal', color: '#333333', zIndex: 0 })} className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-blue-600 rounded-lg transition-all hover:translate-x-1 cursor-pointer group">
                    <svg className="w-4 h-4 text-blue-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">Customer Phone</div>
                      <div className="text-xs text-slate-300">+1 (555) 123-4567</div>
                    </div>
                  </button>
                  <button onClick={() => handleAddElement({ type: 'paragraph', x: 100, y: 290, width: 400, height: 60, content: '456 Corporate Blvd, New York', fontSize: 14, fontWeight: 'normal', fontStyle: 'normal', color: '#333333', zIndex: 0 })} className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-blue-600 rounded-lg transition-all hover:translate-x-1 cursor-pointer group">
                    <svg className="w-4 h-4 text-blue-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">Customer Address</div>
                      <div className="text-xs text-slate-300">456 Corporate Blvd, New York</div>
                    </div>
                  </button>
                  <button onClick={() => handleAddElement({ type: 'paragraph', x: 100, y: 360, width: 400, height: 60, content: 'New York', fontSize: 14, fontWeight: 'normal', fontStyle: 'normal', color: '#333333', zIndex: 0 })} className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-blue-600 rounded-lg transition-all hover:translate-x-1 cursor-pointer group">
                    <svg className="w-4 h-4 text-blue-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">Customer City</div>
                      <div className="text-xs text-slate-300">New York</div>
                    </div>
                  </button>
                </>
              )}

              {/* Company Fields */}
              {activeFieldTab === 'company' && (
                <>
                  <button onClick={() => handleAddElement({ type: 'heading', x: 100, y: 100, width: 300, height: 40, content: 'TechCorp Solutions Inc.', fontSize: 24, fontWeight: 'bold', fontStyle: 'normal', color: '#000000', zIndex: 0 })} className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-green-600 rounded-lg transition-all hover:translate-x-1 cursor-pointer group">
                    <svg className="w-4 h-4 text-green-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">Company Name</div>
                      <div className="text-xs text-slate-300">TechCorp Solutions Inc.</div>
                    </div>
                  </button>
                  <button onClick={() => handleAddElement({ type: 'paragraph', x: 100, y: 150, width: 400, height: 60, content: '123 Business Ave, Suite 100, San Francisco, CA 94105', fontSize: 14, fontWeight: 'normal', fontStyle: 'normal', color: '#333333', zIndex: 0 })} className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-green-600 rounded-lg transition-all hover:translate-x-1 cursor-pointer group">
                    <svg className="w-4 h-4 text-green-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">Company Address</div>
                      <div className="text-xs text-slate-300">123 Business Ave, Suite 100...</div>
                    </div>
                  </button>
                  <button onClick={() => handleAddElement({ type: 'paragraph', x: 100, y: 220, width: 400, height: 60, content: 'info@techcorp.com', fontSize: 14, fontWeight: 'normal', fontStyle: 'normal', color: '#333333', zIndex: 0 })} className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-green-600 rounded-lg transition-all hover:translate-x-1 cursor-pointer group">
                    <svg className="w-4 h-4 text-green-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">Company Email</div>
                      <div className="text-xs text-slate-300">info@techcorp.com</div>
                    </div>
                  </button>
                  <button onClick={() => handleAddElement({ type: 'paragraph', x: 100, y: 290, width: 400, height: 60, content: '+1 (415) 555-0123', fontSize: 14, fontWeight: 'normal', fontStyle: 'normal', color: '#333333', zIndex: 0 })} className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-green-600 rounded-lg transition-all hover:translate-x-1 cursor-pointer group">
                    <svg className="w-4 h-4 text-green-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">Company Phone</div>
                      <div className="text-xs text-slate-300">+1 (415) 555-0123</div>
                    </div>
                  </button>
                </>
              )}

              {/* Financial Fields */}
              {activeFieldTab === 'financial' && (
                <>
                  <button onClick={() => handleAddElement({ type: 'paragraph', x: 100, y: 100, width: 400, height: 60, content: 'INV-2025-0001', fontSize: 14, fontWeight: 'bold', fontStyle: 'normal', color: '#333333', zIndex: 0 })} className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-yellow-600 rounded-lg transition-all hover:translate-x-1 cursor-pointer group">
                    <svg className="w-4 h-4 text-yellow-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">Invoice Number</div>
                      <div className="text-xs text-slate-300">INV-2025-0001</div>
                    </div>
                  </button>
                  <button onClick={() => handleAddElement({ type: 'paragraph', x: 100, y: 170, width: 400, height: 60, content: '$4,500.00', fontSize: 14, fontWeight: 'bold', fontStyle: 'normal', color: '#333333', zIndex: 0 })} className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-yellow-600 rounded-lg transition-all hover:translate-x-1 cursor-pointer group">
                    <svg className="w-4 h-4 text-yellow-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">Total Amount</div>
                      <div className="text-xs text-slate-300">$4,500.00</div>
                    </div>
                  </button>
                  <button onClick={() => handleAddElement({ type: 'paragraph', x: 100, y: 240, width: 400, height: 60, content: '$0.00', fontSize: 14, fontWeight: 'normal', fontStyle: 'normal', color: '#333333', zIndex: 0 })} className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-yellow-600 rounded-lg transition-all hover:translate-x-1 cursor-pointer group">
                    <svg className="w-4 h-4 text-yellow-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">Tax Amount</div>
                      <div className="text-xs text-slate-300">$0.00</div>
                    </div>
                  </button>
                  <button onClick={() => handleAddElement({ type: 'paragraph', x: 100, y: 310, width: 400, height: 60, content: 'Subtotal: $4,500.00', fontSize: 14, fontWeight: 'normal', fontStyle: 'normal', color: '#333333', zIndex: 0 })} className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-yellow-600 rounded-lg transition-all hover:translate-x-1 cursor-pointer group">
                    <svg className="w-4 h-4 text-yellow-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">Subtotal</div>
                      <div className="text-xs text-slate-300">$4,500.00</div>
                    </div>
                  </button>
                </>
              )}

              {/* Dates Fields */}
              {activeFieldTab === 'dates' && (
                <>
                  <button onClick={() => handleAddElement({ type: 'paragraph', x: 100, y: 100, width: 400, height: 60, content: 'November 23, 2025', fontSize: 14, fontWeight: 'normal', fontStyle: 'normal', color: '#333333', zIndex: 0 })} className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-purple-600 rounded-lg transition-all hover:translate-x-1 cursor-pointer group">
                    <svg className="w-4 h-4 text-purple-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">Invoice Date</div>
                      <div className="text-xs text-slate-300">November 23, 2025</div>
                    </div>
                  </button>
                  <button onClick={() => handleAddElement({ type: 'paragraph', x: 100, y: 170, width: 400, height: 60, content: 'Due December 23, 2025', fontSize: 14, fontWeight: 'normal', fontStyle: 'normal', color: '#333333', zIndex: 0 })} className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-purple-600 rounded-lg transition-all hover:translate-x-1 cursor-pointer group">
                    <svg className="w-4 h-4 text-purple-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">Due Date</div>
                      <div className="text-xs text-slate-300">Due December 23, 2025</div>
                    </div>
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <button 
                  key={template.id} 
                  onClick={() => {
                    handleLoadTemplate(template.id);
                    if (isMobile) setIsOpen(false);
                  }} 
                  className="w-full p-4 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-blue-600 hover:to-blue-500 rounded-lg transition-all hover:shadow-lg hover:translate-x-1 text-left group"
                >
                  <div className="text-sm font-semibold text-white group-hover:text-white">{template.name}</div>
                  <div className="text-xs text-slate-300 mt-1">Professional template</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
