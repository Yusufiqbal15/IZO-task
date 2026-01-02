#!/usr/bin/env node

/**
 * Simple script to create a test PDF file for testing the PDF upload system
 * This creates a PDF with sample invoice data that can be extracted
 */

const fs = require('fs');
const path = require('path');

// Simple PDF creation - creates a basic text PDF
function createTestPDF() {
  // PDF header
  let pdf = '%PDF-1.4\n';
  pdf += '1 0 obj\n';
  pdf += '<< /Type /Catalog /Pages 2 0 R >>\n';
  pdf += 'endobj\n';
  
  pdf += '2 0 obj\n';
  pdf += '<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n';
  pdf += 'endobj\n';
  
  pdf += '3 0 obj\n';
  pdf += '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\n';
  pdf += 'endobj\n';
  
  pdf += '5 0 obj\n';
  pdf += '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\n';
  pdf += 'endobj\n';
  
  // Content stream with sample invoice data
  const content = `BT
/F1 12 Tf
50 750 Td
(INVOICE) Tj
0 -30 Td
(Name: MAPLES HOTEL SUPPLIES L.L.C) Tj
0 -20 Td
(Address: AJMAN, UNITED ARAB EMIRATES) Tj
0 -20 Td
(Case Number: DX-1168) Tj
0 -20 Td
(Date: 27-11-2025) Tj
0 -40 Td
(Invoice Details:) Tj
0 -20 Td
(Invoice No. : DX-1168) Tj
0 -20 Td
(Project No. : DX-PRO2025/03742) Tj
0 -20 Td
(Sales Rep : Dubai) Tj
0 -40 Td
(Items:) Tj
0 -20 Td
(1. NP-Q25-2 Pancake Maker - Qty: 2 - Price: 857.15) Tj
0 -20 Td
(Total: 1,714.30) Tj
0 -20 Td
(VAT 5%: 85.72) Tj
0 -20 Td
(Grand Total: 1,800.02) Tj
ET`;

  const contentLength = Buffer.byteLength(content, 'utf8');
  
  pdf += '4 0 obj\n';
  pdf += `<< /Length ${contentLength} >>\n`;
  pdf += 'stream\n';
  pdf += content + '\n';
  pdf += 'endstream\n';
  pdf += 'endobj\n';
  
  // Cross-reference table
  const xref = [
    '0000000000 65535 f ',
    '0000000009 00000 n ',
    '0000000058 00000 n ',
    '0000000115 00000 n ',
    '0000000214 00000 n ',
    '0000000262 00000 n '
  ];
  
  const xrefPos = pdf.length;
  pdf += 'xref\n';
  pdf += '0 6\n';
  xref.forEach(entry => {
    pdf += entry + '\n';
  });
  
  pdf += 'trailer\n';
  pdf += '<< /Size 6 /Root 1 0 R >>\n';
  pdf += 'startxref\n';
  pdf += xrefPos + '\n';
  pdf += '%%EOF\n';
  
  return pdf;
}

// Create the test PDF
const pdfContent = createTestPDF();
const outputPath = path.join(__dirname, 'public', 'sample-invoice.pdf');

// Ensure public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write the PDF file
fs.writeFileSync(outputPath, pdfContent, 'utf8');
console.log(`✅ Test PDF created at: ${outputPath}`);
console.log(`📄 File size: ${Buffer.byteLength(pdfContent, 'utf8')} bytes`);
console.log(`\nYou can now download this file and test the PDF upload feature!`);
