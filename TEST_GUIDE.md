# PDF Upload and Edit System - Test Guide

## Overview
This application allows users to:
1. **Upload PDF files** containing structured data
2. **Extract data** from PDF pages automatically
3. **View extracted data** in an organized edit interface
4. **Edit data** using a professional template
5. **Navigate between pages** and manage multiple PDF pages
6. **Export edited pages** as PDF files

## Features

### 1. PDF Upload
- Upload PDF files from the start page
- Automatic text extraction from PDF
- Multi-page PDF support
- Data extraction from each page

### 2. Multi-Page Navigation
- View all PDF pages in the left sidebar
- Navigate between pages using Previous/Next buttons
- Jump to specific pages by clicking on them
- See extracted data for each page

### 3. Data Extraction
The system automatically extracts:
- **Name** - Customer/Company name
- **Address** - Full address information
- **Case Number** - Reference number or case ID
- **Date** - Invoice or document date

### 4. Template-Based Editing
- Professional invoice template pre-populated with extracted data
- Edit any field directly on the canvas
- Full editing capabilities (text, formatting, positioning)
- Undo/Redo functionality
- Zoom controls for better visibility

### 5. Export
- Export edited pages as PDF
- Download with page number in filename
- Maintains all formatting and styling

## How to Use

### Step 1: Start the Application
```bash
npm run dev
```
Visit `http://localhost:3000`

### Step 2: Upload a PDF
1. Click "Upload PDF" button in the top navigation
2. Select a PDF file from your computer
3. Wait for the extraction process to complete
4. You'll be redirected to the edit page

### Step 3: View Extracted Data
- Left sidebar shows all pages from the PDF
- Each page displays:
  - Page number
  - Extracted customer name
  - Quick preview of extracted data
- Current page shows full extracted information

### Step 4: Edit Data
1. Click on any text element in the canvas to select it
2. Use the right sidebar to edit:
   - Text content
   - Font size and weight
   - Colors
   - Positioning and sizing
3. Changes are applied in real-time

### Step 5: Navigate Pages
- Use "Previous" and "Next" buttons to navigate
- Click on a page in the sidebar to jump directly to it
- Each page loads with its own extracted data

### Step 6: Export
1. Click "Export" button in the top navigation
2. PDF will be downloaded with the page number in the filename
3. Example: `edited-page-1-1733534234567.pdf`

## PDF Format Requirements

For best results, ensure your PDF contains:
- **Readable text** (not scanned images)
- **Structured data** with clear labels:
  - Name field (e.g., "Name: John Doe")
  - Address field (e.g., "Address: 123 Main St")
  - Case/Invoice number (e.g., "Case #: 12345")
  - Date field (e.g., "Date: 2025-12-07")

## Example PDF Content

```
Name: MAPLES HOTEL SUPPLIES L.L.C
Address: AJMAN, UNITED ARAB EMIRATES
Case Number: DX-1168
Date: 27-11-2025
```

## Keyboard Shortcuts

- **Ctrl+Z** - Undo
- **Ctrl+Shift+Z** - Redo
- **Click on element** - Select element
- **Delete key** - Delete selected element

## Troubleshooting

### PDF Upload Fails
- Ensure PDF contains readable text (not scanned images)
- Check file size (should be reasonable)
- Try with a different PDF file

### Data Not Extracted
- PDF may contain scanned images instead of text
- Ensure PDF has clear text content
- Check that field labels match the extraction patterns

### Page Navigation Issues
- Refresh the page if navigation buttons don't work
- Check browser console for errors
- Clear session storage and try again

## Technical Details

### Backend
- **API Route**: `/api/pdf-extract`
- **Method**: POST
- **Input**: FormData with PDF file
- **Output**: JSON with extracted pages and data

### Frontend
- **Main Page**: `/` - Upload and template selection
- **Edit Page**: `/pdf-edit` - Multi-page editing interface
- **Data Storage**: SessionStorage for PDF data during editing

### Data Flow
1. User uploads PDF
2. Backend extracts text from PDF
3. Data stored in SessionStorage
4. Redirect to edit page
5. Edit page loads data and populates template
6. User can edit and export

## File Structure

```
app/
├── page.tsx                 # Main upload page
├── pdf-edit/
│   └── page.tsx            # Multi-page edit interface
├── api/
│   └── pdf-extract/
│       └── route.ts        # PDF extraction API
├── components/
│   ├── EditorCanvas.tsx    # Canvas rendering
│   ├── TopNavbar.tsx       # Navigation bar
│   ├── RightSidebar.tsx    # Element properties
│   └── ...
└── data/
    └── templates.ts        # Invoice templates
```

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Limited support (best on desktop)

## Performance Notes

- Large PDFs (100+ pages) may take longer to process
- Editing large documents may impact performance
- Zoom levels above 150% may cause rendering issues
- Export process takes a few seconds

## Security

- PDF data is stored in SessionStorage (client-side only)
- No data is sent to external servers
- Session data is cleared when page is closed
- All processing happens in the browser

## Future Enhancements

- Support for multiple templates
- Advanced PDF parsing with OCR
- Batch processing multiple PDFs
- Cloud storage integration
- Collaborative editing
- More field extraction patterns
- Custom template creation
