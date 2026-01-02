'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

interface ExtractedData {
  name: string;
  address: string;
  caseNumber: string;
  date: string;
}

export default function PDFSmartFill() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [editedData, setEditedData] = useState<ExtractedData>({
    name: '',
    address: '',
    caseNumber: '',
    date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
      setSuccess('');
      setExtractedData(null);
      setPdfGenerated(false);
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const handleExtractData = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/pdf-extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract data from PDF');
      }

      const result = await response.json();
      setExtractedData(result.data);
      setEditedData(result.data);
      setSuccess('Data extracted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = (field: keyof ExtractedData, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGeneratePDF = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/pdf-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'generated-document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setPdfGenerated(true);
      setSuccess('PDF generated and downloaded successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            PDF Smart Fill
          </h1>
          <p className="text-gray-600 mb-8">
            Upload a PDF, extract data, edit it, and generate a new PDF
          </p>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-semibold">Error</p>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold">Success</p>
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {/* Step 1: Upload PDF */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Step 1: Upload PDF
            </h2>
            <form onSubmit={handleExtractData} className="space-y-4">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-input"
                />
                <label
                  htmlFor="pdf-input"
                  className="cursor-pointer block"
                >
                  <div className="text-blue-600 font-semibold mb-2">
                    Click to upload or drag and drop
                  </div>
                  <div className="text-gray-500 text-sm">
                    {file ? file.name : 'PDF files only'}
                  </div>
                </label>
              </div>
              <button
                type="submit"
                disabled={!file || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                {loading ? 'Extracting...' : 'Extract Data'}
              </button>
            </form>
          </div>

          {/* Step 2: Edit Extracted Data */}
          {extractedData && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Step 2: Edit Extracted Data
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => handleDataChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Address
                  </label>
                  <textarea
                    value={editedData.address}
                    onChange={(e) => handleDataChange('address', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    placeholder="Enter address"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Case Number
                  </label>
                  <input
                    type="text"
                    value={editedData.caseNumber}
                    onChange={(e) => handleDataChange('caseNumber', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter case number"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Date
                  </label>
                  <input
                    type="text"
                    value={editedData.date}
                    onChange={(e) => handleDataChange('date', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter date"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Generate PDF */}
          {extractedData && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Step 3: Generate Final PDF
              </h2>
              <form onSubmit={handleGeneratePDF}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  {loading ? 'Generating...' : 'Generate & Download PDF'}
                </button>
              </form>
              {pdfGenerated && (
                <p className="mt-4 text-center text-gray-600">
                  ✓ PDF has been generated and downloaded
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
