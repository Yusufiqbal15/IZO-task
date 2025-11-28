'use client';
import { useState, useEffect } from 'react';

interface TopNavbarProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExport: () => void;
  onNew: () => void;
  onTemplateSelect?: (template: any) => void;
}

export default function TopNavbar({
  zoom,
  onZoomChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExport,
  onNew,
  onTemplateSelect,
}: TopNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.shiftKey ? onRedo() : onUndo();
      e.preventDefault();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown as any);
    return () => window.removeEventListener('keydown', handleKeyDown as any);
  }, [canUndo, canRedo]);

  const handleTemplateSelect = (template: any) => {
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
    setShowTemplates(false);
  };

  return (
    <>
      <div className="h-16 bg-gradient-to-r from-blue-900 to-blue-800 flex items-center justify-between px-4 md:px-6 shadow-lg z-30">
        {/* Left side - Logo and Brand */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 hover:bg-blue-700 rounded-lg"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          )}
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-white">Invoice Creator</h1>
              <p className="text-xs text-blue-200">Modern Minimal</p>
            </div>
          </div>
          
          {!isMobile && (
            <>
              <div className="h-8 w-px bg-blue-700" />
              <div className="relative">
                <button 
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-700 hover:bg-blue-600 rounded-full transition-colors"
                >
                  <span className="text-sm text-white">Templates</span>
                  <svg 
                    className={`w-4 h-4 text-white transform transition-transform ${showTemplates ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showTemplates && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-40 border border-gray-200 overflow-hidden">
                    <div className="p-2">
                      <div 
                        className="p-3 hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-3"
                        onClick={() => handleTemplateSelect('minimal')}
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Minimal</div>
                          <div className="text-xs text-gray-500">Clean and simple design</div>
                        </div>
                      </div>
                      <div 
                        className="p-3 hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-3"
                        onClick={() => handleTemplateSelect('modern')}
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Modern</div>
                          <div className="text-xs text-gray-500">Sleek and professional</div>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 p-2 bg-gray-50">
                      <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View all templates
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Center - Zoom controls (hidden on mobile) */}
        {!isMobile && (
          <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
              <button
                onClick={() => onZoomChange(Math.max(25, zoom - 10))}
                disabled={zoom <= 25}
                className={`p-2 rounded-lg ${zoom > 25 ? 'text-white hover:bg-blue-700' : 'text-blue-400 cursor-not-allowed'}`}
                title="Zoom Out"
                aria-label="Zoom out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Zoom Out (-)
              </div>
            </div>
            
            <span className="text-sm text-white w-14 text-center">{zoom}%</span>
            
            <div className="relative group">
              <button
                onClick={() => onZoomChange(Math.min(200, zoom + 10))}
                disabled={zoom >= 200}
                className={`p-2 rounded-lg ${zoom < 200 ? 'text-white hover:bg-blue-700' : 'text-blue-400 cursor-not-allowed'}`}
                title="Zoom In"
                aria-label="Zoom in"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Zoom In (+)
              </div>
            </div>
          </div>
        )}

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          {!isMobile && (
            <>
              <div className="relative group">
                <button
                  onClick={onUndo}
                  disabled={!canUndo}
                  className={`p-2 rounded-lg transition-colors ${canUndo ? 'text-white hover:bg-blue-700' : 'text-blue-400 cursor-not-allowed'}`}
                  title="Undo"
                  aria-label="Undo"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Undo (Ctrl+Z)
                </div>
              </div>
              
              <div className="relative group">
                <button
                  onClick={onRedo}
                  disabled={!canRedo}
                  className={`p-2 rounded-lg transition-colors ${canRedo ? 'text-white hover:bg-blue-700' : 'text-blue-400 cursor-not-allowed'}`}
                  title="Redo"
                  aria-label="Redo"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Redo (Ctrl+Shift+Z)
                </div>
              </div>
              
              <div className="h-8 w-px bg-blue-700" />
            </>
          )}
          
          <div className="relative group">
            <button
              onClick={onNew}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors text-white"
              title="New Document"
              aria-label="New document"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            {!isMobile && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                New Document
              </div>
            )}
          </div>
          
          <button
            onClick={onExport}
            className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
            aria-label="Export document"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 mt-16" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white shadow-xl rounded-b-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Menu</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <button
                onClick={() => {
                  onNew();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span>New Document</span>
              </button>
              
              <div className="p-4">
                <div className="text-sm font-medium text-gray-500 mb-2">Zoom: {zoom}%</div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onZoomChange(Math.max(25, zoom - 10))}
                    disabled={zoom <= 25}
                    className={`p-2 rounded-lg ${zoom > 25 ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-300'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="25"
                      max="200"
                      step="5"
                      value={zoom}
                      onChange={(e) => onZoomChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <button
                    onClick={() => onZoomChange(Math.min(200, zoom + 10))}
                    disabled={zoom >= 200}
                    className={`p-2 rounded-lg ${zoom < 200 ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-300'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">History</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onUndo();
                      setIsMenuOpen(false);
                    }}
                    disabled={!canUndo}
                    className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center gap-2 ${canUndo ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-400'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Undo</span>
                  </button>
                  <button
                    onClick={() => {
                      onRedo();
                      setIsMenuOpen(false);
                    }}
                    disabled={!canRedo}
                    className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center gap-2 ${canRedo ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-400'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span>Redo</span>
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Templates</h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      handleTemplateSelect('minimal');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-md border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">Minimal</div>
                    <div className="text-xs text-gray-500">Clean and simple design</div>
                  </button>
                  <button 
                    onClick={() => {
                      handleTemplateSelect('modern');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-md border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">Modern</div>
                    <div className="text-xs text-gray-500">Sleek and professional</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
