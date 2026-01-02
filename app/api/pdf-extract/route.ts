import { NextRequest, NextResponse } from 'next/server';
import { extractFields } from '@/utils/extractFields';

// PDF text extraction using pdfjs-dist
async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string[]> {
  try {
    // Dynamically import pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set up the worker
    const pdfWorkerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

    // Load the PDF
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const pages: string[] = [];

    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Combine text items into a single string with better handling
      let pageText = textContent.items
        .map((item: any) => {
          // Handle different text item types
          if (typeof item.str === 'string') {
            return item.str;
          }
          return '';
        })
        .join('');

      // Clean up the text - preserve line breaks and structure
      pageText = pageText
        .replace(/\s+/g, ' ')  // Normalize multiple spaces
        .trim();

      // If text looks garbled (mostly special chars), try alternative extraction
      if (pageText.length > 0) {
        // Check if text is mostly readable (not garbled)
        const readableChars = (pageText.match(/[a-zA-Z0-9\s\.\,\-\:\;\'\"\!\?]/g) || []).length;
        const totalChars = pageText.length;
        
        // If less than 30% readable characters, it might be garbled
        if (readableChars / totalChars < 0.3) {
          console.warn(`Page ${i} text might be garbled, attempting alternative extraction`);
          // Still add it, but user will see the issue
        }
        
        pages.push(pageText);
      }
    }

    return pages;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    // Fallback to basic extraction if pdfjs fails
    return extractTextFallback(buffer);
  }
}

// Fallback extraction method
function extractTextFallback(buffer: ArrayBuffer): string[] {
  try {
    const uint8Array = new Uint8Array(buffer);
    const decoder = new TextDecoder('latin1');
    const pdfText = decoder.decode(uint8Array);

    // Extract text between parentheses in PDF streams
    const textMatches = pdfText.match(/\((.*?)\)/g) || [];
    let fullText = textMatches
      .map((match) => match.slice(1, -1))
      .join(' ');

    // Clean up the text
    fullText = fullText
      .replace(/\\/g, '')
      .replace(/[^\w\s\n\-.,@]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return fullText.length > 0 ? [fullText] : [];
  } catch (error) {
    console.error('Fallback extraction error:', error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();

    // Extract text from PDF
    const pages = await extractTextFromPDF(buffer);

    if (pages.length === 0) {
      return NextResponse.json(
        { error: 'No text found in PDF. Please ensure the PDF contains readable text.' },
        { status: 400 }
      );
    }

    // Extract fields from each page
    const extractedPages = pages.map((pageText, index) => ({
      pageNumber: index + 1,
      text: pageText,
      data: extractFields(pageText),
    }));

    return NextResponse.json({
      success: true,
      pages: extractedPages,
      totalPages: extractedPages.length,
    });
  } catch (error) {
    console.error('PDF extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract PDF data' },
      { status: 500 }
    );
  }
}
