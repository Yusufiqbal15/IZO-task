'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { CanvasElement } from '../page';

interface EditorCanvasProps {
  elements: CanvasElement[];
  selectedElement: CanvasElement | null;
  onSelectElement: (element: CanvasElement | null) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  zoom: number;
}

interface SelectedCell {
  tableId: string;
  cellIndex: number;
}

interface CellMergeGroup {
  id: string;
  cellIndices: number[];
  width: number;
  height: number;
  backgroundColor: string;
  textColor: string;
  content: string;
}

const PAGE_WIDTH = 595; // A4 width in pixels at 72 DPI
const PAGE_HEIGHT = 842; // A4 height in pixels at 72 DPI

// Image Element Component
function ImageElement({ 
  element, 
  onUpdate 
}: { 
  element: CanvasElement; 
  onUpdate: (src: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onUpdate(dataUrl);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div 
        className="w-full h-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={handleImageClick}
      >
        {element.src ? (
          <img src={element.src} alt="" className="max-w-full max-h-full object-contain" />
        ) : (
          <div className="text-center p-4">
            <div className="text-2xl mb-2">📷</div>
            <span className="text-xs text-gray-500 block">Click to upload image</span>
            <span className="text-[10px] text-gray-400 block mt-1">from your device</span>
          </div>
        )}
      </div>
    </>
  );
}

export default function EditorCanvas({
  elements,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  zoom,
}: EditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
  const [selectedCells, setSelectedCells] = useState<Set<number>>(new Set());
  const [resizingCell, setResizingCell] = useState<{ tableId: string; cellIndex: number; direction: string } | null>(null);
  const [cellResizeStart, setCellResizeStart] = useState({ x: 0, y: 0 });
  const [isDraggingSelection, setIsDraggingSelection] = useState(false);
  const [dragSelectionStart, setDragSelectionStart] = useState({ x: 0, y: 0 });
  const [isTableCellMode, setIsTableCellMode] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent, element: CanvasElement) => {
    if (e.target instanceof HTMLElement && e.target.classList.contains('resize-handle')) {
      return; // Let resize handler take over
    }
    
    e.stopPropagation();
    onSelectElement(element);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const scale = zoom / 100;
      const x = (e.clientX - rect.left) / scale - element.x;
      const y = (e.clientY - rect.top) / scale - element.y;
      setDragOffset({ x, y });
      setIsDragging(true);
    }
  }, [zoom, onSelectElement]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scale = zoom / 100;

    if (isResizing && selectedElement && resizeHandle) {
      const currentX = (e.clientX - rect.left) / scale;
      const currentY = (e.clientY - rect.top) / scale;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = resizeStart.x;
      let newY = resizeStart.y;

      if (resizeHandle.includes('e')) {
        newWidth = Math.max(50, currentX - resizeStart.x);
      }
      if (resizeHandle.includes('w')) {
        const diff = resizeStart.x - currentX;
        newWidth = Math.max(50, resizeStart.width + diff);
        newX = Math.min(resizeStart.x, currentX);
      }
      if (resizeHandle.includes('s')) {
        newHeight = Math.max(30, currentY - resizeStart.y);
      }
      if (resizeHandle.includes('n')) {
        const diff = resizeStart.y - currentY;
        newHeight = Math.max(30, resizeStart.height + diff);
        newY = Math.min(resizeStart.y, currentY);
      }

      onUpdateElement(selectedElement.id, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    } else if (isDragging && selectedElement) {
      const x = (e.clientX - rect.left) / scale - dragOffset.x;
      const y = (e.clientY - rect.top) / scale - dragOffset.y;
      
      // Snap to grid (10px grid)
      const snappedX = Math.round(x / 10) * 10;
      const snappedY = Math.round(y / 10) * 10;
      
      onUpdateElement(selectedElement.id, {
        x: Math.max(0, Math.min(snappedX, PAGE_WIDTH - selectedElement.width)),
        y: Math.max(0, Math.min(snappedY, PAGE_HEIGHT - selectedElement.height)),
      });
    }
  }, [isDragging, isResizing, selectedElement, dragOffset, resizeHandle, resizeStart, zoom, onUpdateElement]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleResizeStart = useCallback((e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    if (selectedElement) {
      setIsResizing(true);
      setResizeHandle(handle);
      setResizeStart({
        x: selectedElement.x,
        y: selectedElement.y,
        width: selectedElement.width,
        height: selectedElement.height,
      });
    }
  }, [selectedElement]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onSelectElement(null);
    }
  }, [onSelectElement]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    const isTypingTarget =
      target &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable);

    if (isTypingTarget) {
      return;
    }

    if (selectedElement && (e.key === 'Delete' || e.key === 'Backspace')) {
      e.preventDefault();
      onDeleteElement(selectedElement.id);
    }
  }, [selectedElement, onDeleteElement]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderElement = (element: CanvasElement) => {
    const isSelected = selectedElement?.id === element.id;
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      zIndex: element.zIndex || 0,
      cursor: isDragging ? 'grabbing' : 'grab',
    };

    if (element.backgroundColor) {
      style.backgroundColor = element.backgroundColor;
    }
    if (element.border) {
      style.border = element.border;
    }
    if (element.borderRadius) {
      style.borderRadius = `${element.borderRadius}px`;
    }
    if (element.padding) {
      style.padding = `${element.padding}px`;
    }
    if (element.opacity !== undefined) {
      style.opacity = element.opacity;
    }

    let content: React.ReactNode = null;

    if (element.type === 'heading' || element.type === 'paragraph' || element.type === 'text') {
      const textStyle: React.CSSProperties = {
        fontSize: `${element.fontSize || 14}px`,
        fontFamily: element.fontFamily || 'inherit',
        fontWeight: element.fontWeight || 'normal',
        fontStyle: element.fontStyle || 'normal',
        color: element.color || '#000000',
        textAlign: element.textAlign || 'left',
        lineHeight: element.lineHeight || 1.4,
        margin: 0,
        width: '100%',
        height: '100%',
      };
      content = (
        <div style={textStyle}>
          {element.content || ''}
        </div>
      );
    } else if (element.type === 'image') {
      content = (
        <ImageElement 
          element={element} 
          onUpdate={(src) => onUpdateElement(element.id, { src })} 
        />
      );
    } else if (element.type === 'shape') {
      if (element.shapeType === 'circle') {
        style.borderRadius = '50%';
      } else if (element.shapeType === 'line') {
        style.height = '2px';
        style.transformOrigin = 'left center';
      }
      content = null;
    } else if (element.type === 'table') {
      const rows = element.rows || 4;
      const cols = element.cols || 4;
      const cells = element.cells || Array.from({ length: rows * cols }).map((_, idx) => ({
        id: `cell-${idx}`,
        content: idx === 0 ? 'Header' : `Cell ${idx}`,
        width: 1,
        height: 1,
        backgroundColor: '#ffffff',
        textColor: '#666666',
      }));
      
      content = (
        <div 
          className="w-full h-full relative"
          style={{ display: 'grid', gridTemplateColumns: cells.slice(0, cols).map(c => `${(c.width || 1) * 100 / cols}%`).join(' '), gridTemplateRows: `repeat(${rows}, 1fr)`, gap: 0 }}
          onMouseDown={(e) => {
            // Prevent table dragging when clicking inside cells
            if (e.target instanceof HTMLElement && !e.target.classList.contains('resize-handle')) {
              e.stopPropagation();
              setIsTableCellMode(true);
              setIsDraggingSelection(true);
              setDragSelectionStart({ x: e.clientX, y: e.clientY });
            }
          }}
          onMouseMove={(e) => {
            if (resizingCell) {
              const deltaX = e.clientX - cellResizeStart.x;
              const deltaY = e.clientY - cellResizeStart.y;
              const newCells = [...cells];
              
              // Resize all selected cells proportionally
              selectedCells.forEach(cellIdx => {
                const cell = newCells[cellIdx];
                if (resizingCell.direction === 'width') {
                  cell.width = Math.max(0.2, (cell.width || 1) + deltaX * 0.005);
                } else if (resizingCell.direction === 'height') {
                  cell.height = Math.max(0.2, (cell.height || 1) + deltaY * 0.005);
                } else if (resizingCell.direction === 'both') {
                  cell.width = Math.max(0.2, (cell.width || 1) + deltaX * 0.005);
                  cell.height = Math.max(0.2, (cell.height || 1) + deltaY * 0.005);
                }
              });
              
              // Normalize cells to fit in table
              const totalWidth = newCells.reduce((sum, c) => sum + (c.width || 1), 0);
              const totalHeight = newCells.reduce((sum, c, idx) => {
                if (idx % cols === 0) return sum + (c.height || 1);
                return sum;
              }, 0);
              
              // Scale cells to maintain table size
              newCells.forEach(cell => {
                cell.width = (cell.width || 1) * (cols / totalWidth);
                cell.height = (cell.height || 1) * (rows / totalHeight);
              });
              
              onUpdateElement(element.id, { cells: newCells });
              setCellResizeStart({ x: e.clientX, y: e.clientY });
            }
          }}
          onMouseUp={() => {
            setResizingCell(null);
            setIsDraggingSelection(false);
            setIsTableCellMode(false);
          }}
          onMouseLeave={() => {
            setResizingCell(null);
            setIsDraggingSelection(false);
            setIsTableCellMode(false);
          }}
        >
          {cells.map((cell, idx) => {
            const isSingleSelected = selectedCell?.tableId === element.id && selectedCell?.cellIndex === idx;
            const isMultiSelected = selectedCells.has(idx);
            const isAnySelected = isSingleSelected || isMultiSelected;
            
            return (
              <div
                key={cell.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.ctrlKey || e.metaKey) {
                    // Multi-select with Ctrl/Cmd
                    const newSelected = new Set(selectedCells);
                    if (newSelected.has(idx)) {
                      newSelected.delete(idx);
                    } else {
                      newSelected.add(idx);
                    }
                    setSelectedCells(newSelected);
                  } else {
                    // Single select
                    setSelectedCell({ tableId: element.id, cellIndex: idx });
                    setSelectedCells(new Set([idx]));
                  }
                  onSelectElement(element);
                }}
                onMouseEnter={(e) => {
                  // Drag-to-select: hold mouse button and drag across cells
                  if (isDraggingSelection && isTableCellMode) {
                    const newSelected = new Set(selectedCells);
                    newSelected.add(idx);
                    setSelectedCells(newSelected);
                  }
                }}
                className={`border-2 p-2 flex items-center justify-center text-xs cursor-pointer transition-all overflow-hidden ${
                  isMultiSelected
                    ? 'border-purple-500 shadow-inner bg-purple-50'
                    : isSingleSelected 
                    ? 'border-blue-500 shadow-inner bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{
                  backgroundColor: isMultiSelected ? 'rgba(168, 85, 247, 0.15)' : isSingleSelected ? 'rgba(59, 130, 246, 0.15)' : (cell.backgroundColor || '#ffffff'),
                  color: cell.textColor || '#666666',
                  position: 'relative',
                  minHeight: '40px',
                }}
                title={`Cell ${idx + 1} - Click to select, Ctrl+Click to multi-select, drag edges to resize`}
              >
                <div className="truncate text-center w-full font-medium">{cell.content}</div>
                
                {/* Resize handles for selected cells */}
                {isAnySelected && (
                  <>
                    {/* Right edge resize */}
                    <div
                      className="absolute right-0 top-0 bottom-0 w-2 bg-blue-500 cursor-col-resize hover:bg-blue-700 hover:w-3"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setResizingCell({ tableId: element.id, cellIndex: idx, direction: 'width' });
                        setCellResizeStart({ x: e.clientX, y: e.clientY });
                      }}
                      style={{ opacity: 0.8, transition: 'all 0.2s' }}
                    />
                    
                    {/* Bottom edge resize */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-2 bg-blue-500 cursor-row-resize hover:bg-blue-700 hover:h-3"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setResizingCell({ tableId: element.id, cellIndex: idx, direction: 'height' });
                        setCellResizeStart({ x: e.clientX, y: e.clientY });
                      }}
                      style={{ opacity: 0.8, transition: 'all 0.2s' }}
                    />
                    
                    {/* Corner resize */}
                    <div
                      className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-nwse-resize hover:bg-blue-700"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setResizingCell({ tableId: element.id, cellIndex: idx, direction: 'both' });
                        setCellResizeStart({ x: e.clientX, y: e.clientY });
                      }}
                      style={{ opacity: 0.8, transition: 'all 0.2s' }}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      );
    } else if (element.type === 'icon') {
      const iconStyle: React.CSSProperties = {
        fontSize: `${element.fontSize || 32}px`,
        color: element.color || '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      };
      content = <div style={iconStyle}>{element.content || '★'}</div>;
    } else if (element.type === 'block') {
      content = (
        <div className="w-full h-full border border-gray-200 rounded bg-white">
          <div className="p-2 text-xs text-gray-500">Pre-made Block</div>
        </div>
      );
    }

    return (
      <div
        key={element.id}
        style={style}
        onMouseDown={(e) => handleMouseDown(e, element)}
        className={`${isSelected ? 'ring-4 ring-blue-500 ring-offset-2 shadow-lg' : 'hover:ring-2 hover:ring-gray-300'} transition-all cursor-move`}
      >
        {content}
        {isSelected && (
          <>
            {/* Selection border overlay */}
            <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />
            {/* Resize handles */}
            <div
              className="resize-handle absolute -top-1.5 -left-1.5 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize shadow-md hover:bg-blue-600 hover:scale-110 transition-all z-10"
              onMouseDown={(e) => handleResizeStart(e, 'nw')}
            />
            <div
              className="resize-handle absolute -top-1.5 right-0 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize shadow-md hover:bg-blue-600 hover:scale-110 transition-all z-10"
              onMouseDown={(e) => handleResizeStart(e, 'ne')}
            />
            <div
              className="resize-handle absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize shadow-md hover:bg-blue-600 hover:scale-110 transition-all z-10"
              onMouseDown={(e) => handleResizeStart(e, 'sw')}
            />
            <div
              className="resize-handle absolute -bottom-1.5 right-0 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize shadow-md hover:bg-blue-600 hover:scale-110 transition-all z-10"
              onMouseDown={(e) => handleResizeStart(e, 'se')}
            />
            <div
              className="resize-handle absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-ns-resize shadow-md hover:bg-blue-600 hover:scale-110 transition-all z-10"
              onMouseDown={(e) => handleResizeStart(e, 'n')}
            />
            <div
              className="resize-handle absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-ns-resize shadow-md hover:bg-blue-600 hover:scale-110 transition-all z-10"
              onMouseDown={(e) => handleResizeStart(e, 's')}
            />
            <div
              className="resize-handle absolute -left-1.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-ew-resize shadow-md hover:bg-blue-600 hover:scale-110 transition-all z-10"
              onMouseDown={(e) => handleResizeStart(e, 'w')}
            />
            <div
              className="resize-handle absolute -right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-ew-resize shadow-md hover:bg-blue-600 hover:scale-110 transition-all z-10"
              onMouseDown={(e) => handleResizeStart(e, 'e')}
            />
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex items-center justify-center overflow-auto">
      <div
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="relative bg-gray-200 p-8 rounded-lg shadow-2xl"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'center center',
          width: `${PAGE_WIDTH}px`,
          height: `${PAGE_HEIGHT}px`,
          minWidth: `${PAGE_WIDTH}px`,
          minHeight: `${PAGE_HEIGHT}px`,
        }}
      >
        {/* Page background */}
        <div className="absolute inset-0 bg-white shadow-inner rounded" />
        
        {/* Grid overlay (subtle) */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ccc 1px, transparent 1px),
              linear-gradient(to bottom, #ccc 1px, transparent 1px)
            `,
            backgroundSize: '10px 10px',
          }}
        />

        {/* Elements */}
        {elements.map(renderElement)}

        {/* Guidelines (show when dragging) */}
        {isDragging && selectedElement && (
          <>
            <div
              className="absolute bg-blue-400 opacity-30"
              style={{
                left: `${selectedElement.x}px`,
                top: 0,
                width: '1px',
                height: `${PAGE_HEIGHT}px`,
              }}
            />
            <div
              className="absolute bg-blue-400 opacity-30"
              style={{
                left: 0,
                top: `${selectedElement.y}px`,
                width: `${PAGE_WIDTH}px`,
                height: '1px',
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

