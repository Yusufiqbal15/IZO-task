'use client';

import { useState, useEffect } from 'react';
import { CanvasElement } from '../page';

interface ExtractedData {
  name: string;
  address: string;
  caseNumber: string;
  date: string;
  fullText?: string;
}

interface PDFPage {
  pageNumber: number;
  text: string;
  data: ExtractedData;
}

interface PDFTemplatePopulatorProps {
  onPopulateTemplate: (elements: Omit<CanvasElement, 'id'>[]) => void;
  onClose: () => void;
}

export default function PDFTemplatePopulator({
  onPopulateTemplate,
  onClose,
}: PDFTemplatePopulatorProps) {
  const [pdfData, setPdfData] = useState<{ pages: PDFPage[]; totalPages: number } | null>(null);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve PDF data from session storage
    const storedData = sessionStorage.getItem('pdfData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setPdfData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing PDF data:', error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const currentPage = pdfData?.pages[selectedPageIndex];
  const currentData: ExtractedData = currentPage?.data || {
    name: '',
    address: '',
    caseNumber: '',
    date: '',
  };

  // Check if text appears to be garbled
  const isTextGarbled = currentPage?.text ? 
    ((currentPage.text.match(/[a-zA-Z0-9\s\.\,\-\:\;\'\"\!\?]/g) || []).length / currentPage.text.length) < 0.3 
    : false;

  const handlePopulateTemplate = () => {
    if (!currentPage) return;

    // Create canvas elements with the exact PDF text
    const elements: Omit<CanvasElement, 'id'>[] = [
      {
        type: 'paragraph',
        x: 50,
        y: 50,
        width: 700,
        height: 700,
        content: currentPage.text || 'No text extracted',
        fontSize: 12,
        color: '#1f2937',
        fontFamily: 'Arial, sans-serif',
        lineHeight: 1.6,
        padding: 20,
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
      },
    ];

    onPopulateTemplate(elements);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-center text-gray-600">Processing PDF data...</p>
        </div>
      </div>
    );
  }

  if (!pdfData || pdfData.pages.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h3 className="text-lg font-bold text-gray-900 mb-4">No Data Extracted</h3>
          <p className="text-gray-600 mb-6">
            Could not extract text from the PDF. Please ensure the PDF contains readable text.
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">PDF Data Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Page Navigation */}
          {pdfData.totalPages > 1 && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedPageIndex(Math.max(0, selectedPageIndex - 1))}
                disabled={selectedPageIndex === 0}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm font-medium text-gray-700">
                Page {selectedPageIndex + 1} of {pdfData.totalPages}
              </span>
              <button
                onClick={() => setSelectedPageIndex(Math.min(pdfData.totalPages - 1, selectedPageIndex + 1))}
                disabled={selectedPageIndex === pdfData.totalPages - 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Extracted Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Extracted Fields</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-600 block mb-2">Name</label>
                <p className="text-gray-900 font-medium break-words">
                  {currentData.name || '—'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-600 block mb-2">Case Number</label>
                <p className="text-gray-900 font-medium break-words">
                  {currentData.caseNumber || '—'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                <label className="text-sm font-medium text-gray-600 block mb-2">Address</label>
                <p className="text-gray-900 font-medium break-words">
                  {currentData.address || '—'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-600 block mb-2">Date</label>
                <p className="text-gray-900 font-medium break-words">
                  {currentData.date || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Full Text Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Full Text Content</h3>
              {isTextGarbled && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  ⚠️ Text may be encoded
                </span>
              )}
            </div>
            {isTextGarbled && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                <p className="font-medium mb-1">⚠️ Note: This PDF appears to have encoded or special formatting</p>
                <p>The text extraction may not be perfect. You can manually edit it in the template after populating.</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
              <p className="text-sm text-gray-700 whitespace-pre-wrap break-words font-mono">
                {currentPage?.text || 'No text available'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handlePopulateTemplate}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Populate Template
          </button>
        </div>
      </div>
    </div>
  );
}
