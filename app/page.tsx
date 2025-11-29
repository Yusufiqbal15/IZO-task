'use client';

import { useState, useCallback, useRef } from 'react';
import EditorCanvas from './components/EditorCanvas';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import TopNavbar from './components/TopNavbar';
import StartPage from './components/StartPage';
import { templates, Template } from './data/templates';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface TableCell {
  content: string;
  rowSpan?: number;
  colSpan?: number;
}

export interface CanvasElement {
  id: string;
  type: 'text' | 'heading' | 'paragraph' | 'image' | 'shape' | 'icon' | 'block' | 'table';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: 'normal' | 'italic';
  color?: string;
  backgroundColor?: string;
  border?: string;
  borderRadius?: number;
  padding?: number;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number;
  opacity?: number;
  src?: string;
  shapeType?: 'rectangle' | 'circle' | 'line';
  zIndex?: number;
  // Table properties
  rows?: number;
  cols?: number;
  tableData?: TableCell[][];
  rowHeights?: number[];
  colWidths?: number[];
  tableBorder?: string;
  tableHeaderBg?: string;
  tableCellBg?: string;
}

export default function Home() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
  const [zoom, setZoom] = useState(100);
  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showEditor, setShowEditor] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const saveToHistory = useCallback((newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleAddElement = useCallback((element: Omit<CanvasElement, 'id'>) => {
    const newElement: CanvasElement = {
      ...element,
      id: `element-${Date.now()}-${Math.random()}`,
      zIndex: elements.length,
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    saveToHistory(newElements);
    setSelectedElement(newElement);
  }, [elements, saveToHistory]);

  const handleUpdateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    if (selectedElement?.id === id) {
      setSelectedElement({ ...selectedElement, ...updates });
    }
  }, [elements, selectedElement]);

  const handleDeleteElement = useCallback((id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }
    saveToHistory(newElements);
  }, [elements, selectedElement, saveToHistory]);

  const handleLoadTemplate = useCallback((templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;
    // Clone elements with new IDs so they can be edited independently
    const clonedElements = template.elements.map(el => ({
      ...el,
      id: `elem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));
    setElements(clonedElements);
    setSelectedElement(null);
    setHistory([clonedElements]);
    setHistoryIndex(0);
    setShowEditor(true);
  }, []);

  const handleCreateBlankDocument = useCallback(() => {
    setElements([]);
    setSelectedElement(null);
    setHistory([[]]);
    setHistoryIndex(0);
    setShowEditor(true);
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements([...history[newIndex]]);
      setSelectedElement(null);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements([...history[newIndex]]);
      setSelectedElement(null);
    }
  }, [history, historyIndex]);

  const handleExport = useCallback(async () => {
    if (elements.length === 0) {
      alert('Please add content to your document first!');
      return;
    }

    try {
      // Create a temporary container to render content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '595px';
      tempDiv.style.height = '842px';
      tempDiv.style.backgroundColor = '#ffffff';
      tempDiv.style.overflow = 'hidden';
      document.body.appendChild(tempDiv);

      // Render all elements into the temporary container
      elements.forEach(element => {
        const elementDiv = document.createElement('div');
        elementDiv.style.position = 'absolute';
        elementDiv.style.left = `${element.x}px`;
        elementDiv.style.top = `${element.y}px`;
        elementDiv.style.width = `${element.width}px`;
        elementDiv.style.minHeight = `${element.height}px`;
        elementDiv.style.zIndex = `${element.zIndex || 0}`;
        elementDiv.style.boxSizing = 'border-box';

        // Apply styling
        if (element.backgroundColor) {
          elementDiv.style.backgroundColor = element.backgroundColor;
        }
        if (element.border) {
          elementDiv.style.border = element.border;
        }
        if (element.borderRadius) {
          elementDiv.style.borderRadius = `${element.borderRadius}px`;
        }
        if (element.padding) {
          elementDiv.style.padding = `${element.padding}px`;
        }
        if (element.opacity !== undefined) {
          elementDiv.style.opacity = `${element.opacity}`;
        }

        // Handle different element types
        if (element.type === 'heading' || element.type === 'paragraph' || element.type === 'text') {
          elementDiv.style.fontSize = `${element.fontSize || 14}px`;
          elementDiv.style.fontFamily = element.fontFamily || 'Arial, sans-serif';
          elementDiv.style.fontWeight = element.fontWeight || 'normal';
          elementDiv.style.fontStyle = element.fontStyle || 'normal';
          elementDiv.style.color = element.color || '#000000';
          elementDiv.style.textAlign = element.textAlign || 'left';
          elementDiv.style.lineHeight = `${element.lineHeight || 1.4}`;
          elementDiv.style.wordWrap = 'break-word';
          elementDiv.style.whiteSpace = 'normal';
          elementDiv.style.overflow = 'visible';
          elementDiv.textContent = element.content || '';
        } else if (element.type === 'image' && element.src) {
          const img = document.createElement('img');
          img.src = element.src;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'contain';
          elementDiv.appendChild(img);
        } else if (element.type === 'table') {
          const table = document.createElement('table');
          table.style.width = '100%';
          table.style.height = '100%';
          table.style.borderCollapse = 'collapse';
          table.style.border = element.tableBorder || '1px solid #ccc';
          table.style.fontSize = '12px';
          
          const rows = element.rows || 3;
          const cols = element.cols || 3;
          const tableData = element.tableData || [];
          const rowHeights = element.rowHeights || Array(rows).fill(element.height / rows);
          const colWidths = element.colWidths || Array(cols).fill(element.width / cols);
          
          for (let r = 0; r < rows; r++) {
            const tr = document.createElement('tr');
            tr.style.height = `${rowHeights[r] || 40}px`;
            
            for (let c = 0; c < cols; c++) {
              const td = document.createElement('td');
              td.style.border = element.tableBorder || '1px solid #ccc';
              td.style.padding = '8px';
              td.style.width = `${colWidths[c] || element.width / cols}px`;
              td.style.backgroundColor = r === 0 ? (element.tableHeaderBg || '#e5e7eb') : (element.tableCellBg || '#ffffff');
              td.style.textAlign = 'left';
              td.style.verticalAlign = 'middle';
              td.textContent = tableData[r]?.[c]?.content || '';
              tr.appendChild(td);
            }
            table.appendChild(tr);
          }
          elementDiv.appendChild(table);
        } else if (element.type === 'shape') {
          if (element.shapeType === 'circle') {
            elementDiv.style.borderRadius = '50%';
          }
        }

        tempDiv.appendChild(elementDiv);
      });

      // Convert to image
      const imageCanvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
      });

      // Remove temporary container
      document.body.removeChild(tempDiv);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate dimensions
      const imgWidth = imageCanvas.width;
      const imgHeight = imageCanvas.height;
      const scaledHeight = (imgHeight * pdfWidth) / imgWidth;

      // Add image to PDF
      const imgData = imageCanvas.toDataURL('image/png');
      let yPosition = 0;

      while (yPosition < scaledHeight) {
        if (yPosition > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, -yPosition, pdfWidth, scaledHeight);
        yPosition += pdfHeight;
      }

      // Download PDF
      pdf.save(`invoice-${Date.now()}.pdf`);
      alert('✅ PDF downloaded successfully!');

    } catch (error: any) {
      console.error('Export failed:', error);
      alert('Failed to download PDF. Please try again.');
    }
  }, [elements]);

  // Show start page if no editor is active
  if (!showEditor) {
    return (
      <StartPage
        onSelectTemplate={handleLoadTemplate}
        onCreateBlank={handleCreateBlankDocument}
      />
    );
  }

  // Show editor
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
      <TopNavbar
        zoom={zoom}
        onZoomChange={setZoom}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onExport={handleExport}
        onNew={() => {
          setShowEditor(false);
        }}
        />
      <div className="flex flex-1 overflow-hidden gap-0">
        {/* Left Sidebar */}
        <div className="hidden lg:block">
          <LeftSidebar
            onAddElement={handleAddElement}
            onLoadTemplate={handleLoadTemplate}
          />
        </div>
        
        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-white flex items-start justify-center p-0" ref={canvasContainerRef}>
          <EditorCanvas
            elements={elements}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            zoom={zoom}
          />
        </div>
        
        {/* Right Sidebar */}
        <div className="hidden md:block">
          <RightSidebar
            selectedElement={selectedElement}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            onAddElement={handleAddElement}
          />
        </div>
      </div>
    </div>
  );
}
