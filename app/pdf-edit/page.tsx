'use client';

import { Suspense } from 'react';
import PDFEditPageContent from './PDFEditPageContent';

export default function PDFEditPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading PDF data...</p>
        </div>
      </div>
    }>
      <PDFEditPageContent />
    </Suspense>
  );
}