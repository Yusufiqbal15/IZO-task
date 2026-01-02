'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EditorCanvas from '../components/EditorCanvas';
import RightSidebar from '../components/RightSidebar';
import TopNavbar from '../components/TopNavbar';
import type { CanvasElement } from '../page';
import { templates } from '../data/templates';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface PDFPageData {
  pageNumber: number;
  text: string;
  data: {
    name: string;
    address: string;
    caseNumber: string;
    date: string;
  };
}

interface PDFEditState {
  pages: PDFPageData[];
  currentPageIndex: number;
  elements: CanvasElement[];
  selectedElement: CanvasElement | null;
  zoom: number;
  history: CanvasElement[][];
  historyIndex: number;
}

export default function PDFEditPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<PDFEditState>({
    pages: [],
    currentPageIndex: 0,
    elements: [],
    selectedElement: null,
    zoom: 100,
    history: [],
    historyIndex: -1,
  });

  // Load PDF data from session storage
  useEffect(() => {
    try {
      const pdfDataStr = sessionStorage.getItem('pdfData');
      if (!pdfDataStr) {
        router.push('/');
        return;
      }

      const pdfData = JSON.parse(pdfDataStr);
      const pages = pdfData.pages || [];

      if (pages.length === 0) {
        router.push('/');
        return;
      }

      // Load first page
      loadPage(pages, 0);
      setState(prev => ({
        ...prev,
        pages,
      }));
    } catch (error) {
      console.error('Error loading PDF data:', error);
      router.push('/');
    }
  }, [router]);

  const loadPage = (pages: PDFPageData[], pageIndex: number) => {
    const page = pages[pageIndex];
    if (!page) return;

    // Load invoice template
    const invoiceTemplate = templates.find((t) => t.id === 'invoice');
    if (!invoiceTemplate) return;

    // Clone template elements
    const clonedElements = invoiceTemplate.elements.map(el => ({
      ...el,
      id: `elem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));

    // Auto-fill template with extracted data
    const filledElements = clonedElements.map(el => {
      let updatedContent = el.content || '';

      // Replace placeholders with extracted data
      if (updatedContent.includes('{{name}}')) {
        updatedContent = updatedContent.replace('{{name}}', page.data.name || '');
      }
      if (updatedContent.includes('{{address}}')) {
        updatedContent = updatedContent.replace('{{address}}', page.data.address || '');
      }
      if (updatedContent.includes('{{caseNumber}}')) {
        updatedContent = updatedContent.replace('{{caseNumber}}', page.data.caseNumber || '');
      }
      if (updatedContent.includes('{{date}}')) {
        updatedContent = updatedContent.replace('{{date}}', page.data.date || '');
      }

      return {
        ...el,
        content: updatedContent,
      };
    });

    setState(prev => ({
      ...prev,
      currentPageIndex: pageIndex,
      elements: filledElements,
      selectedElement: null,
      history: [filledElements],
      historyIndex: 0,
    }));
  };

  const handleNextPage = useCallback(() => {
    if (state.currentPageIndex < state.pages.length - 1) {
      loadPage(state.pages, state.currentPageIndex + 1);
    }
  }, [state.currentPageIndex, state.pages]);

  const handlePreviousPage = useCallback(() => {
    if (state.currentPageIndex > 0) {
      loadPage(state.pages, state.currentPageIndex - 1);
    }
  }, [state.currentPageIndex, state.pages]);

  const handleGoToPage = useCallback((pageNumber: number) => {
    const pageIndex = pageNumber - 1;
    if (pageIndex >= 0 && pageIndex < state.pages.length) {
      loadPage(state.pages, pageIndex);
    }
  }, [state.pages]);

  const saveToHistory = useCallback((newElements: CanvasElement[]) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push([...newElements]);
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const handleUpdateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setState(prev => {
      const newElements = prev.elements.map(el =>
        el.id === id ? { ...el, ...updates } : el
      );

      if (prev.selectedElement?.id === id) {
        return {
          ...prev,
          elements: newElements,
          selectedElement: { ...prev.selectedElement, ...updates },
        };
      }

      return {
        ...prev,
        elements: newElements,
      };
    });
  }, []);

  const handleDeleteElement = useCallback((id: string) => {
    setState(prev => {
      const newElements = prev.elements.filter(el => el.id !== id);
      saveToHistory(newElements);

      return {
        ...prev,
        elements: newElements,
        selectedElement: prev.selectedElement?.id === id ? null : prev.selectedElement,
      };
    });
  }, [saveToHistory]);

  const handleUndo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        return {
          ...prev,
          historyIndex: newIndex,
          elements: [...prev.history[newIndex]],
          selectedElement: null,
        };
      }
      return prev;
    });
  }, []);

  const handleRedo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        return {
          ...prev,
          historyIndex: newIndex,
          elements: [...prev.history[newIndex]],
          selectedElement: null,
        };
      }
      return prev;
    });
  }, []);

  const handleExport = useCallback(async () => {
    if (state.elements.length === 0) {
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
      state.elements.forEach(element => {
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
      pdf.save(`edited-page-${state.currentPageIndex + 1}-${Date.now()}.pdf`);
      alert('✅ PDF downloaded successfully!');

    } catch (error: any) {
      console.error('Export failed:', error);
      alert('Failed to download PDF. Please try again.');
    }
  }, [state.elements, state.currentPageIndex]);

  if (state.pages.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading PDF data...</p>
        </div>
      </div>
    );
  }

  const currentPage = state.pages[state.currentPageIndex];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
      <TopNavbar
        zoom={state.zoom}
        onZoomChange={(zoom) => setState(prev => ({ ...prev, zoom }))}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={state.historyIndex > 0}
        canRedo={state.historyIndex < state.history.length - 1}
        onExport={handleExport}
        onNew={() => {
          sessionStorage.removeItem('pdfData');
          router.push('/');
        }}
        onPDFUpload={() => {}}
      />

      <div className="flex flex-1 overflow-hidden gap-0">
        {/* Left Sidebar - Page Navigation */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-bold text-lg mb-4 text-gray-800">PDF Pages</h3>
            <div className="space-y-2">
              {state.pages.map((page, index) => (
                <button
                  key={index}
                  onClick={() => handleGoToPage(page.pageNumber)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    state.currentPageIndex === index
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-semibold">Page {page.pageNumber}</div>
                  <div className="text-xs mt-1 opacity-75 truncate">
                    {page.data.name || 'No name'}
                  </div>
                </button>
              ))}
            </div>

            {/* Page Navigation Buttons */}
            <div className="mt-6 space-y-2">
              <button
                onClick={handlePreviousPage}
                disabled={state.currentPageIndex === 0}
                className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
              >
                ← Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={state.currentPageIndex === state.pages.length - 1}
                className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
              >
                Next →
              </button>
            </div>

            {/* Current Page Info */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-semibold text-blue-900">
                Page {state.currentPageIndex + 1} of {state.pages.length}
              </p>
              <div className="mt-2 text-xs text-blue-800 space-y-1">
                <p><strong>Name:</strong> {currentPage.data.name || 'N/A'}</p>
                <p><strong>Address:</strong> {currentPage.data.address || 'N/A'}</p>
                <p><strong>Case #:</strong> {currentPage.data.caseNumber || 'N/A'}</p>
                <p><strong>Date:</strong> {currentPage.data.date || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-white flex items-start justify-center p-0">
          <EditorCanvas
            elements={state.elements}
            selectedElement={state.selectedElement}
            onSelectElement={(el) => setState(prev => ({ ...prev, selectedElement: el }))}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            zoom={state.zoom}
          />
        </div>

        {/* Right Sidebar */}
        <div className="hidden md:block">
          <RightSidebar
            selectedElement={state.selectedElement}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            onAddElement={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
