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
  const [selectedCellIndex, setSelectedCellIndex] = useState<number | null>(null);

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
                {/* Table */}
                <button 
                  onClick={() => onAddElement?.({ type: 'table', x: 100, y: 100, width: 500, height: 250, rows: 4, cols: 4, backgroundColor: '#ffffff', border: '1px solid #d1d5db', zIndex: 0 })}
                  className="flex flex-col items-center p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all active:scale-95"
                >
                  <svg className="w-5 h-5 text-gray-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700">Table</span>
                </button>

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
            {(selectedElement.type === 'shape' || selectedElement.type === 'block' || selectedElement.type === 'table') && (
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

            {/* Table Properties */}
            {selectedElement.type === 'table' && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Table Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Rows: {selectedElement.rows || 4}
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdate({ rows: Math.max(1, (selectedElement.rows || 4) - 1) })}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        −
                      </button>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={selectedElement.rows || 4}
                        onChange={(e) => handleUpdate({ rows: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <button
                        onClick={() => handleUpdate({ rows: Math.min(10, (selectedElement.rows || 4) + 1) })}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Columns: {selectedElement.cols || 4}
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdate({ cols: Math.max(1, (selectedElement.cols || 4) - 1) })}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        −
                      </button>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={selectedElement.cols || 4}
                        onChange={(e) => handleUpdate({ cols: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <button
                        onClick={() => handleUpdate({ cols: Math.min(10, (selectedElement.cols || 4) + 1) })}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Table Cell Management */}
            {selectedElement.type === 'table' && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Cell Management</h3>
                <p className="text-xs text-gray-600 mb-2">Click a cell to select and customize</p>
                
                {/* Cell Grid Selector */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Select Cell</label>
                  <div className="grid grid-cols-4 gap-1 max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
                    {Array.from({ length: (selectedElement.rows || 4) * (selectedElement.cols || 4) }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedCellIndex(idx)}
                        className={`p-2 text-xs rounded border transition-all font-medium ${
                          selectedCellIndex === idx
                            ? 'bg-blue-500 text-white border-blue-600 shadow-md'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cell Content Editor */}
                {selectedCellIndex !== null && (
                  <div className="space-y-3 border-t pt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Cell Content</label>
                      <input
                        type="text"
                        defaultValue={`Cell ${selectedCellIndex + 1}`}
                        onChange={(e) => {
                          const cells = selectedElement.cells || Array.from({ length: (selectedElement.rows || 4) * (selectedElement.cols || 4) }).map((_, i) => ({
                            id: `cell-${i}`,
                            content: i === 0 ? 'Header' : `Cell ${i}`,
                            width: 1,
                            height: 1,
                            backgroundColor: '#ffffff',
                            textColor: '#666666',
                          }));
                          cells[selectedCellIndex].content = e.target.value;
                          handleUpdate({ cells });
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter cell content"
                      />
                    </div>

                    {/* Cell Width Control */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Cell Width</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const cells = selectedElement.cells || Array.from({ length: (selectedElement.rows || 4) * (selectedElement.cols || 4) }).map((_, i) => ({
                              id: `cell-${i}`,
                              content: i === 0 ? 'Header' : `Cell ${i}`,
                              width: 1,
                              height: 1,
                              backgroundColor: '#ffffff',
                              textColor: '#666666',
                            }));
                            cells[selectedCellIndex].width = Math.max(0.5, (cells[selectedCellIndex].width || 1) - 0.5);
                            handleUpdate({ cells });
                          }}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs font-medium"
                        >
                          −
                        </button>
                        <input
                          type="range"
                          min="0.5"
                          max="3"
                          step="0.5"
                          defaultValue="1"
                          onChange={(e) => {
                            const cells = selectedElement.cells || Array.from({ length: (selectedElement.rows || 4) * (selectedElement.cols || 4) }).map((_, i) => ({
                              id: `cell-${i}`,
                              content: i === 0 ? 'Header' : `Cell ${i}`,
                              width: 1,
                              height: 1,
                              backgroundColor: '#ffffff',
                              textColor: '#666666',
                            }));
                            cells[selectedCellIndex].width = parseFloat(e.target.value);
                            handleUpdate({ cells });
                          }}
                          className="flex-1"
                        />
                        <button
                          onClick={() => {
                            const cells = selectedElement.cells || Array.from({ length: (selectedElement.rows || 4) * (selectedElement.cols || 4) }).map((_, i) => ({
                              id: `cell-${i}`,
                              content: i === 0 ? 'Header' : `Cell ${i}`,
                              width: 1,
                              height: 1,
                              backgroundColor: '#ffffff',
                              textColor: '#666666',
                            }));
                            cells[selectedCellIndex].width = Math.min(3, (cells[selectedCellIndex].width || 1) + 0.5);
                            handleUpdate({ cells });
                          }}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-xs font-medium"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Width: 0.5x to 3x</p>
                    </div>

                    {/* Cell Height Control */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Cell Height</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const cells = selectedElement.cells || Array.from({ length: (selectedElement.rows || 4) * (selectedElement.cols || 4) }).map((_, i) => ({
                              id: `cell-${i}`,
                              content: i === 0 ? 'Header' : `Cell ${i}`,
                              width: 1,
                              height: 1,
                              backgroundColor: '#ffffff',
                              textColor: '#666666',
                            }));
                            cells[selectedCellIndex].height = Math.max(0.5, (cells[selectedCellIndex].height || 1) - 0.5);
                            handleUpdate({ cells });
                          }}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs font-medium"
                        >
                          −
                        </button>
                        <input
                          type="range"
                          min="0.5"
                          max="3"
                          step="0.5"
                          defaultValue="1"
                          onChange={(e) => {
                            const cells = selectedElement.cells || Array.from({ length: (selectedElement.rows || 4) * (selectedElement.cols || 4) }).map((_, i) => ({
                              id: `cell-${i}`,
                              content: i === 0 ? 'Header' : `Cell ${i}`,
                              width: 1,
                              height: 1,
                              backgroundColor: '#ffffff',
                              textColor: '#666666',
                            }));
                            cells[selectedCellIndex].height = parseFloat(e.target.value);
                            handleUpdate({ cells });
                          }}
                          className="flex-1"
                        />
                        <button
                          onClick={() => {
                            const cells = selectedElement.cells || Array.from({ length: (selectedElement.rows || 4) * (selectedElement.cols || 4) }).map((_, i) => ({
                              id: `cell-${i}`,
                              content: i === 0 ? 'Header' : `Cell ${i}`,
                              width: 1,
                              height: 1,
                              backgroundColor: '#ffffff',
                              textColor: '#666666',
                            }));
                            cells[selectedCellIndex].height = Math.min(3, (cells[selectedCellIndex].height || 1) + 0.5);
                            handleUpdate({ cells });
                          }}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-xs font-medium"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Height: 0.5x to 3x</p>
                    </div>

                    {/* Cell Background Color */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
                      <input
                        type="color"
                        defaultValue="#ffffff"
                        onChange={(e) => {
                          const cells = selectedElement.cells || Array.from({ length: (selectedElement.rows || 4) * (selectedElement.cols || 4) }).map((_, i) => ({
                            id: `cell-${i}`,
                            content: i === 0 ? 'Header' : `Cell ${i}`,
                            width: 1,
                            height: 1,
                            backgroundColor: '#ffffff',
                            textColor: '#666666',
                          }));
                          cells[selectedCellIndex].backgroundColor = e.target.value;
                          handleUpdate({ cells });
                        }}
                        className="w-full h-8 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Cell Text Color */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Text Color</label>
                      <input
                        type="color"
                        defaultValue="#666666"
                        onChange={(e) => {
                          const cells = selectedElement.cells || Array.from({ length: (selectedElement.rows || 4) * (selectedElement.cols || 4) }).map((_, i) => ({
                            id: `cell-${i}`,
                            content: i === 0 ? 'Header' : `Cell ${i}`,
                            width: 1,
                            height: 1,
                            backgroundColor: '#ffffff',
                            textColor: '#666666',
                          }));
                          cells[selectedCellIndex].textColor = e.target.value;
                          handleUpdate({ cells });
                        }}
                        className="w-full h-8 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Merge Cells */}
                    <div className="pt-2 border-t space-y-2">
                      <p className="text-xs text-gray-600 font-medium">💡 Tip: Click and drag to select multiple cells</p>
                      <p className="text-xs text-green-600 font-medium">✓ Or use Ctrl+Click for multi-select</p>
                      <button
                        onClick={() => {
                          const cells = selectedElement.cells || Array.from({ length: (selectedElement.rows || 4) * (selectedElement.cols || 4) }).map((_, i) => ({
                            id: `cell-${i}`,
                            content: i === 0 ? 'Header' : `Cell ${i}`,
                            width: 1,
                            height: 1,
                            backgroundColor: '#ffffff',
                            textColor: '#666666',
                          }));
                          
                          // Merge current cell with next cell
                          if (selectedCellIndex < cells.length - 1) {
                            cells[selectedCellIndex].width = (cells[selectedCellIndex].width || 1) + (cells[selectedCellIndex + 1].width || 1);
                            cells[selectedCellIndex].height = Math.max(cells[selectedCellIndex].height || 1, cells[selectedCellIndex + 1].height || 1);
                            cells.splice(selectedCellIndex + 1, 1);
                            handleUpdate({ cells, cols: (selectedElement.cols || 4) - 1 });
                            setSelectedCellIndex(selectedCellIndex);
                          }
                        }}
                        className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        🔗 Merge with Next Cell
                      </button>
                      
                      <button
                        onClick={() => {
                          const cells = selectedElement.cells || Array.from({ length: (selectedElement.rows || 4) * (selectedElement.cols || 4) }).map((_, i) => ({
                            id: `cell-${i}`,
                            content: i === 0 ? 'Header' : `Cell ${i}`,
                            width: 1,
                            height: 1,
                            backgroundColor: '#ffffff',
                            textColor: '#666666',
                          }));
                          
                          // Merge current cell with cell below
                          const cols = selectedElement.cols || 4;
                          const nextRowIdx = selectedCellIndex + cols;
                          if (nextRowIdx < cells.length) {
                            cells[selectedCellIndex].height = (cells[selectedCellIndex].height || 1) + (cells[nextRowIdx].height || 1);
                            cells[selectedCellIndex].width = Math.max(cells[selectedCellIndex].width || 1, cells[nextRowIdx].width || 1);
                            cells.splice(nextRowIdx, 1);
                            handleUpdate({ cells, rows: (selectedElement.rows || 4) - 1 });
                            setSelectedCellIndex(selectedCellIndex);
                          }
                        }}
                        className="w-full px-3 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                      >
                        🔗 Merge with Cell Below
                      </button>
                      
                      <button
                        onClick={() => {
                          const cells = selectedElement.cells || Array.from({ length: (selectedElement.rows || 4) * (selectedElement.cols || 4) }).map((_, i) => ({
                            id: `cell-${i}`,
                            content: i === 0 ? 'Header' : `Cell ${i}`,
                            width: 1,
                            height: 1,
                            backgroundColor: '#ffffff',
                            textColor: '#666666',
                          }));
                          
                          // Merge all adjacent cells in a rectangle
                          const cols = selectedElement.cols || 4;
                          const rows = selectedElement.rows || 4;
                          
                          // Find min and max indices
                          const indices = Array.from({ length: cells.length }, (_, i) => i).filter((_, i) => {
                            // Simple merge: merge selected cell with neighbors
                            return i === selectedCellIndex || 
                                   (i === selectedCellIndex + 1 && (selectedCellIndex + 1) % cols !== 0) ||
                                   (i === selectedCellIndex + cols && selectedCellIndex + cols < cells.length);
                          });
                          
                          if (indices.length > 1) {
                            const minIdx = Math.min(...indices);
                            const maxIdx = Math.max(...indices);
                            
                            // Combine widths and heights
                            let totalWidth = 0;
                            let totalHeight = 0;
                            
                            indices.forEach(idx => {
                              totalWidth += cells[idx].width || 1;
                              totalHeight += cells[idx].height || 1;
                            });
                            
                            cells[minIdx].width = totalWidth / indices.length;
                            cells[minIdx].height = totalHeight / indices.length;
                            
                            // Remove merged cells (in reverse order to maintain indices)
                            indices.slice(1).reverse().forEach(idx => {
                              cells.splice(idx, 1);
                            });
                            
                            handleUpdate({ cells });
                            setSelectedCellIndex(minIdx);
                          }
                        }}
                        className="w-full px-3 py-2 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                      >
                        🔗 Merge Adjacent Cells
                      </button>
                    </div>
                  </div>
                )}
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
