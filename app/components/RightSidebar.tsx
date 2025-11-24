'use client';

import { useState, useCallback, useRef } from 'react';
import { CanvasElement } from '../page';

interface RightSidebarProps {
  selectedElement: CanvasElement | null;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
}

export default function RightSidebar({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
}: RightSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  if (!selectedElement) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Properties</h2>
          <p className="text-sm text-gray-500">Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
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
                className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
              >
                Delete Element
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}

