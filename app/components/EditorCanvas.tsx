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

  // Table Element Component
  const TableElement = ({ element }: { element: CanvasElement }) => {
    const rows = element.rows || 3;
    const cols = element.cols || 3;
    const tableData = element.tableData || [];
    const rowHeights = element.rowHeights || Array(rows).fill(element.height / rows);
    const colWidths = element.colWidths || Array(cols).fill(element.width / cols);
    const tableBorder = element.tableBorder || '1px solid #ccc';
    const tableHeaderBg = element.tableHeaderBg || '#e5e7eb';
    const tableCellBg = element.tableCellBg || '#ffffff';

    const handleCellChange = (rowIdx: number, colIdx: number, content: string) => {
      const newTableData = tableData.map((row, r) => 
        r === rowIdx 
          ? row.map((cell, c) => 
              c === colIdx 
                ? { ...cell, content } 
                : cell
            )
          : row
      );
      
      // Ensure array structure exists
      while (newTableData.length <= rowIdx) {
        newTableData.push([]);
      }
      while (newTableData[rowIdx].length <= colIdx) {
        newTableData[rowIdx].push({ content: '' });
      }
      
      onUpdateElement(element.id, { tableData: newTableData });
    };

    return (
      <table
        style={{
          width: '100%',
          height: '100%',
          borderCollapse: 'collapse',
          border: tableBorder,
          fontSize: '12px',
          pointerEvents: 'none',
        }}
      >
        <tbody>
          {Array(rows).fill(null).map((_, rowIdx) => (
            <tr key={rowIdx} style={{ height: `${rowHeights[rowIdx] || 40}px` }}>
              {Array(cols).fill(null).map((_, colIdx) => {
                const cellData = tableData[rowIdx]?.[colIdx];
                const isHeader = rowIdx === 0;
                return (
                  <td
                    key={`${rowIdx}-${colIdx}`}
                    style={{
                      border: tableBorder,
                      padding: '8px',
                      width: `${colWidths[colIdx] || element.width / cols}px`,
                      backgroundColor: isHeader ? tableHeaderBg : tableCellBg,
                      textAlign: 'left',
                      verticalAlign: 'middle',
                      wordWrap: 'break-word',
                      overflow: 'hidden',
                      cursor: 'default',
                      minHeight: '100%',
                      fontSize: '13px',
                      fontFamily: 'Arial, sans-serif',
                      outline: 'none',
                      userSelect: 'none',
                    }}
                  >
                    {cellData?.content || ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

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
    } else if (element.type === 'table') {
      content = <TableElement element={element} />;
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
    <div className="w-full flex items-start justify-center overflow-auto">
      <div
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="relative bg-white"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          width: `${PAGE_WIDTH}px`,
          height: `${PAGE_HEIGHT}px`,
          minWidth: `${PAGE_WIDTH}px`,
          minHeight: `${PAGE_HEIGHT}px`,
        }}
      >
        {/* Page background */}
        <div className="absolute inset-0 bg-white" />
        
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

