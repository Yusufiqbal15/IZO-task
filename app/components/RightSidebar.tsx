'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { CanvasElement } from '../page';

interface RightSidebarProps {
  selectedElement: CanvasElement | null;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  onAddElement?: (element: Omit<CanvasElement, 'id'>) => void;
}

export default function RightSidebar({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onAddElement,
}: RightSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleUpdate = useCallback((updates: Partial<CanvasElement>) => {
    if (selectedElement) {
      onUpdateElement(selectedElement.id, updates);
    }
  }, [selectedElement, onUpdateElement]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/') && selectedElement) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        handleUpdate({ src: dataUrl });
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [selectedElement, handleUpdate]);

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-20 right-6 z-40 p-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
          aria-label="Toggle properties"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
          ? `fixed right-0 top-16 bottom-0 w-80 z-40 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}` 
          : 'w-80'
      } bg-gradient-to-b from-white to-gray-50 border-l border-gray-300 flex flex-col h-full shadow-2xl`}>
        <div className="p-4 border-b border-gray-300 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {selectedElement ? 'Element Properties' : 'Add Elements'}
          </h2>
          <p className="text-xs text-purple-100">{selectedElement ? 'Customize selected element' : 'Choose layout and elements'}</p>
        </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!selectedElement && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Layout Options
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {/* 1 Column */}
                <button 
                  onClick={() => onAddElement?.({ type: 'shape', x: 100, y: 100, width: 500, height: 400, shapeType: 'rectangle', backgroundColor: '#f3f4f6', zIndex: 0 })}
                  className="flex flex-col items-center p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all active:scale-95"
                >
                  <div className="w-5 h-5 bg-gray-300 rounded mb-1"></div>
                  <span className="text-xs font-medium text-gray-700">1 Column</span>
                </button>

                {/* 1/2 Section */}
                <button 
                  onClick={() => {
                    onAddElement?.({ type: 'shape', x: 100, y: 100, width: 240, height: 400, shapeType: 'rectangle', backgroundColor: '#f3f4f6', zIndex: 0 });
                    onAddElement?.({ type: 'shape', x: 360, y: 100, width: 240, height: 400, shapeType: 'rectangle', backgroundColor: '#f3f4f6', zIndex: 0 });
                  }}
                  className="flex flex-col items-center p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all active:scale-95"
                >
                  <div className="flex gap-0.5 mb-1">
                    <div className="w-2 h-5 bg-gray-300 rounded"></div>
                    <div className="w-2 h-5 bg-gray-300 rounded"></div>
                  </div>
                  <span className="text-xs font-medium text-gray-700">1/2 Section</span>
                </button>

                {/* 3/7 Section */}
                <button 
                  onClick={() => {
                    onAddElement?.({ type: 'shape', x: 100, y: 100, width: 180, height: 400, shapeType: 'rectangle', backgroundColor: '#f3f4f6', zIndex: 0 });
                    onAddElement?.({ type: 'shape', x: 300, y: 100, width: 300, height: 400, shapeType: 'rectangle', backgroundColor: '#f3f4f6', zIndex: 0 });
                  }}
                  className="flex flex-col items-center p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all active:scale-95"
                >
                  <div className="flex gap-0.5 mb-1">
                    <div className="w-1.5 h-5 bg-gray-300 rounded"></div>
                    <div className="w-3 h-5 bg-gray-300 rounded"></div>
                  </div>
                  <span className="text-xs font-medium text-gray-700">3/7 Section</span>
                </button>

                {/* 1/3 Section */}
                <button 
                  onClick={() => {
                    onAddElement?.({ type: 'shape', x: 100, y: 100, width: 150, height: 400, shapeType: 'rectangle', backgroundColor: '#f3f4f6', zIndex: 0 });
                    onAddElement?.({ type: 'shape', x: 270, y: 100, width: 150, height: 400, shapeType: 'rectangle', backgroundColor: '#f3f4f6', zIndex: 0 });
                    onAddElement?.({ type: 'shape', x: 440, y: 100, width: 150, height: 400, shapeType: 'rectangle', backgroundColor: '#f3f4f6', zIndex: 0 });
                  }}
                  className="flex flex-col items-center p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all active:scale-95"
                >
                  <div className="flex gap-0.5 mb-1">
                    <div className="w-1 h-5 bg-gray-300 rounded"></div>
                    <div className="w-1 h-5 bg-gray-300 rounded"></div>
                    <div className="w-1 h-5 bg-gray-300 rounded"></div>
                  </div>
                  <span className="text-xs font-medium text-gray-700">1/3 Section</span>
                </button>

                {/* Divider */}
                <button 
                  onClick={() => onAddElement?.({ type: 'shape', x: 100, y: 100, width: 500, height: 2, shapeType: 'rectangle', backgroundColor: '#9ca3af', zIndex: 0 })}
                  className="flex flex-col items-center p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all active:scale-95"
                >
                  <div className="w-5 h-0.5 bg-gray-400 mb-1"></div>
                  <span className="text-xs font-medium text-gray-700">Divider</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Text Elements
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => onAddElement?.({ type: 'heading', x: 100, y: 100, width: 300, height: 40, content: 'Heading Text', fontSize: 28, fontWeight: 'bold', fontStyle: 'normal', color: '#000000', zIndex: 0 })}
                  className="p-2 bg-white border border-gray-200 rounded hover:bg-purple-50 hover:border-purple-300 transition-all text-sm font-medium text-gray-700 active:scale-95"
                >
                  Heading
                </button>
                <button 
                  onClick={() => onAddElement?.({ type: 'paragraph', x: 100, y: 150, width: 400, height: 60, content: 'Paragraph text goes here...', fontSize: 14, fontWeight: 'normal', fontStyle: 'normal', color: '#333333', zIndex: 0 })}
                  className="p-2 bg-white border border-gray-200 rounded hover:bg-purple-50 hover:border-purple-300 transition-all text-sm font-medium text-gray-700 active:scale-95"
                >
                  Paragraph
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v6m0 0v6m0-6h6m0 0h6m-6 0V3m0 6v6" />
                </svg>
                Table Options
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => {
                    const rows = 3, cols = 3;
                    const tableData = Array(rows).fill(null).map((_, r) => 
                      Array(cols).fill(null).map((_, c) => ({ content: `R${r+1}C${c+1}` }))
                    );
                    const rowHeights = Array(rows).fill(40);
                    const colWidths = Array(cols).fill(500/cols);
                    onAddElement?.({ 
                      type: 'table', 
                      x: 50, 
                      y: 100, 
                      width: 500, 
                      height: 120,
                      rows,
                      cols,
                      tableData,
                      rowHeights,
                      colWidths,
                      tableBorder: '1px solid #ccc',
                      tableHeaderBg: '#e5e7eb',
                      tableCellBg: '#ffffff',
                      zIndex: 0 
                    })
                  }}
                  className="p-2 bg-white border border-gray-200 rounded hover:bg-purple-50 hover:border-purple-300 transition-all text-xs font-medium text-gray-700 active:scale-95"
                >
                  3x3
                </button>
                <button 
                  onClick={() => {
                    const rows = 4, cols = 4;
                    const tableData = Array(rows).fill(null).map((_, r) => 
                      Array(cols).fill(null).map((_, c) => ({ content: `R${r+1}C${c+1}` }))
                    );
                    const rowHeights = Array(rows).fill(40);
                    const colWidths = Array(cols).fill(500/cols);
                    onAddElement?.({ 
                      type: 'table', 
                      x: 50, 
                      y: 100, 
                      width: 500, 
                      height: 160,
                      rows,
                      cols,
                      tableData,
                      rowHeights,
                      colWidths,
                      tableBorder: '1px solid #ccc',
                      tableHeaderBg: '#e5e7eb',
                      tableCellBg: '#ffffff',
                      zIndex: 0 
                    })
                  }}
                  className="p-2 bg-white border border-gray-200 rounded hover:bg-purple-50 hover:border-purple-300 transition-all text-xs font-medium text-gray-700 active:scale-95"
                >
                  4x4
                </button>
                <button 
                  onClick={() => {
                    const rows = 5, cols = 5;
                    const tableData = Array(rows).fill(null).map((_, r) => 
                      Array(cols).fill(null).map((_, c) => ({ content: `R${r+1}C${c+1}` }))
                    );
                    const rowHeights = Array(rows).fill(40);
                    const colWidths = Array(cols).fill(500/cols);
                    onAddElement?.({ 
                      type: 'table', 
                      x: 50, 
                      y: 100, 
                      width: 500, 
                      height: 200,
                      rows,
                      cols,
                      tableData,
                      rowHeights,
                      colWidths,
                      tableBorder: '1px solid #ccc',
                      tableHeaderBg: '#e5e7eb',
                      tableCellBg: '#ffffff',
                      zIndex: 0 
                    })
                  }}
                  className="p-2 bg-white border border-gray-200 rounded hover:bg-purple-50 hover:border-purple-300 transition-all text-xs font-medium text-gray-700 active:scale-95"
                >
                  5x5
                </button>
              </div>
            </div>
          </div>
        )}
        {selectedElement && (
          <div className="space-y-6">
            {/* Position & Size */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Position & Size</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">X</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.x)}
                    onChange={(e) => handleUpdate({ x: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Y</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.y)}
                    onChange={(e) => handleUpdate({ y: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.width)}
                    onChange={(e) => handleUpdate({ width: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Height</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.height)}
                    onChange={(e) => handleUpdate({ height: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Text Properties */}
            {(selectedElement.type === 'heading' || selectedElement.type === 'paragraph' || selectedElement.type === 'text') && (
              <>
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Text</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
                      <textarea
                        value={selectedElement.content || ''}
                        onChange={(e) => handleUpdate({ content: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Font Size: {selectedElement.fontSize || 14}px
                      </label>
                      <input
                        type="range"
                        min="8"
                        max="72"
                        value={selectedElement.fontSize || 14}
                        onChange={(e) => handleUpdate({ fontSize: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Font Weight</label>
                      <select
                        value={selectedElement.fontWeight || 'normal'}
                        onChange={(e) => handleUpdate({ fontWeight: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="normal">Normal</option>
                        <option value="500">Medium</option>
                        <option value="600">Semi Bold</option>
                        <option value="bold">Bold</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Font Style</label>
                      <div className="flex gap-2">
                        {(['normal', 'italic'] as const).map((style) => (
                          <button
                            key={style}
                            onClick={() => handleUpdate({ fontStyle: style })}
                            className={`flex-1 px-3 py-2 text-sm border rounded-lg transition-colors ${
                              selectedElement.fontStyle === style
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                            style={{ fontStyle: style as any }}
                          >
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Text Align</label>
                      <div className="flex gap-2">
                        {(['left', 'center', 'right'] as const).map((align) => (
                          <button
                            key={align}
                            onClick={() => handleUpdate({ textAlign: align })}
                            className={`flex-1 px-3 py-2 text-sm border rounded-lg transition-colors ${
                              selectedElement.textAlign === align
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {align.charAt(0).toUpperCase() + align.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Text Color</label>
                      <div className="mb-2">
                        <input
                          type="color"
                          value={selectedElement.color || '#000000'}
                          onChange={(e) => handleUpdate({ color: e.target.value })}
                          className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div className="grid grid-cols-8 gap-1.5">
                        {['#000000', '#1f2937', '#374151', '#6b7280', '#9ca3af', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#14b8a6'].map((color) => (
                          <button
                            key={color}
                            onClick={() => handleUpdate({ color })}
                            className={`w-8 h-8 rounded border-2 transition-all ${
                              selectedElement.color === color ? 'border-blue-500 scale-110' : 'border-gray-200 hover:border-gray-400'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium text-gray-700">Box Fill</label>
                        <button
                          onClick={() => handleUpdate({ backgroundColor: undefined })}
                          className="text-[11px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="mb-2">
                        <input
                          type="color"
                          value={selectedElement.backgroundColor || '#ffffff'}
                          onChange={(e) => handleUpdate({ backgroundColor: e.target.value })}
                          className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div className="grid grid-cols-8 gap-1.5">
                        {['#ffffff', '#f8f9fa', '#e5e7eb', '#d1d5db', '#fde68a', '#fcd34d', '#fbbf24', '#f97316', '#fee2e2', '#fecdd3', '#e0f2fe', '#d9f99d', '#bbf7d0', '#ddd6fe', '#f5d0fe', '#cbd5f5'].map((color) => (
                          <button
                            key={color}
                            onClick={() => handleUpdate({ backgroundColor: color })}
                            className={`w-8 h-8 rounded border-2 transition-all ${
                              selectedElement.backgroundColor === color ? 'border-blue-500 scale-110' : 'border-gray-200 hover:border-gray-400'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Line Height: {selectedElement.lineHeight || 1.4}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={selectedElement.lineHeight || 1.4}
                        onChange={(e) => handleUpdate({ lineHeight: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Box/Shape Properties */}
            {(selectedElement.type === 'shape' || selectedElement.type === 'block') && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Appearance</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Background Color</label>
                    <div className="mb-2">
                      <input
                        type="color"
                        value={selectedElement.backgroundColor || '#ffffff'}
                        onChange={(e) => handleUpdate({ backgroundColor: e.target.value })}
                        className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div className="grid grid-cols-8 gap-1.5">
                      {['#ffffff', '#f8f9fa', '#e5e7eb', '#d1d5db', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#14b8a6', '#000000'].map((color) => (
                        <button
                          key={color}
                          onClick={() => handleUpdate({ backgroundColor: color })}
                          className={`w-8 h-8 rounded border-2 transition-all ${
                            selectedElement.backgroundColor === color ? 'border-blue-500 scale-110' : 'border-gray-200 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Border</label>
                    <input
                      type="text"
                      value={selectedElement.border || ''}
                      onChange={(e) => handleUpdate({ border: e.target.value })}
                      placeholder="e.g., 1px solid #ccc"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Border Radius: {selectedElement.borderRadius || 0}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={selectedElement.borderRadius || 0}
                      onChange={(e) => handleUpdate({ borderRadius: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Padding: {selectedElement.padding || 0}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={selectedElement.padding || 0}
                      onChange={(e) => handleUpdate({ padding: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Image Properties */}
            {selectedElement.type === 'image' && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Image</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Upload Image</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Upload from Device
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={selectedElement.src || ''}
                      onChange={(e) => handleUpdate({ src: e.target.value })}
                      placeholder="Enter image URL"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Opacity: {selectedElement.opacity !== undefined ? Math.round(selectedElement.opacity * 100) : 100}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={selectedElement.opacity !== undefined ? selectedElement.opacity : 1}
                      onChange={(e) => handleUpdate({ opacity: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Border Radius: {selectedElement.borderRadius || 0}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={selectedElement.borderRadius || 0}
                      onChange={(e) => handleUpdate({ borderRadius: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Table Properties */}
            {selectedElement.type === 'table' && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Table Layout</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Rows: {selectedElement.rows || 3}</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={selectedElement.rows || 3}
                      onChange={(e) => {
                        const newRows = parseInt(e.target.value);
                        const currentRows = selectedElement.rows || 3;
                        const cols = selectedElement.cols || 3;
                        let newTableData = selectedElement.tableData || [];
                        
                        if (newRows > currentRows) {
                          for (let i = currentRows; i < newRows; i++) {
                            newTableData.push(Array(cols).fill(null).map(() => ({ content: '' })));
                          }
                        } else {
                          newTableData = newTableData.slice(0, newRows);
                        }
                        
                        const newRowHeights = Array(newRows).fill(40);
                        handleUpdate({ rows: newRows, tableData: newTableData, rowHeights: newRowHeights });
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Columns: {selectedElement.cols || 3}</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={selectedElement.cols || 3}
                      onChange={(e) => {
                        const newCols = parseInt(e.target.value);
                        const currentCols = selectedElement.cols || 3;
                        const rows = selectedElement.rows || 3;
                        let newTableData = selectedElement.tableData || [];
                        
                        newTableData = newTableData.map(row => {
                          if (newCols > currentCols) {
                            return [...row, ...Array(newCols - currentCols).fill(null).map(() => ({ content: '' }))];
                          } else {
                            return row.slice(0, newCols);
                          }
                        });
                        
                        const newColWidths = Array(newCols).fill((selectedElement.width || 500) / newCols);
                        handleUpdate({ cols: newCols, tableData: newTableData, colWidths: newColWidths });
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Row Height: {Math.round(selectedElement.rowHeights?.[0] || 40)}px</label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={selectedElement.rowHeights?.[0] || 40}
                      onChange={(e) => {
                        const newHeight = parseFloat(e.target.value);
                        const rows = selectedElement.rows || 3;
                        const newRowHeights = Array(rows).fill(newHeight);
                        handleUpdate({ rowHeights: newRowHeights, height: newHeight * rows });
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Table Border</label>
                    <input
                      type="text"
                      value={selectedElement.tableBorder || '1px solid #ccc'}
                      onChange={(e) => handleUpdate({ tableBorder: e.target.value })}
                      placeholder="e.g., 1px solid #ccc"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Header Background</label>
                    <input
                      type="color"
                      value={selectedElement.tableHeaderBg || '#e5e7eb'}
                      onChange={(e) => handleUpdate({ tableHeaderBg: e.target.value })}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Cell Background</label>
                    <input
                      type="color"
                      value={selectedElement.tableCellBg || '#ffffff'}
                      onChange={(e) => handleUpdate({ tableCellBg: e.target.value })}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Table Content Editor */}
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Edit Content</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {Array(selectedElement.rows || 3).fill(null).map((_, rowIdx) => (
                      <div key={rowIdx} className="mb-3 pb-3 border-b border-gray-300 last:border-b-0">
                        <div className="text-xs font-semibold text-gray-600 mb-2">Row {rowIdx + 1}</div>
                        <div className="space-y-2">
                          {Array(selectedElement.cols || 3).fill(null).map((_, colIdx) => (
                            <input
                              key={`${rowIdx}-${colIdx}`}
                              type="text"
                              value={selectedElement.tableData?.[rowIdx]?.[colIdx]?.content || ''}
                              onChange={(e) => {
                                const newTableData = [...(selectedElement.tableData || [])];
                                if (!newTableData[rowIdx]) {
                                  newTableData[rowIdx] = [];
                                }
                                newTableData[rowIdx][colIdx] = {
                                  content: e.target.value,
                                };
                                handleUpdate({ tableData: newTableData });
                              }}
                              placeholder={`Col ${colIdx + 1}`}
                              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div>
              <button
                onClick={() => onDeleteElement(selectedElement.id)}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 border border-red-700 rounded-lg transition-colors font-semibold"
              >
                🗑️ Delete Element
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
