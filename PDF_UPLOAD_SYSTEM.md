# PDF Upload and Template Population System

## Overview

This system allows users to upload PDF files, automatically extract text content from all pages, and populate a pre-designed template with the extracted data. The system maintains clean formatting and provides a smooth user experience with visual feedback at each step.

## Features

### 1. **PDF Upload Interface**
- **Drag-and-Drop**: Users can drag PDF files directly onto the upload area
- **File Browser**: Alternative file selection via browse button
- **File Validation**: Only accepts PDF files
- **File Information**: Displays file name and size before upload
- **Loading State**: Shows processing indicator during upload

### 2. **Text Extraction**
- **Multi-Page Support**: Extracts text from every page of the PDF
- **Robust Extraction**: Uses pdfjs-dist library for reliable text extraction
- **Fallback Method**: Includes regex-based fallback if primary method fails
- **Field Recognition**: Automatically identifies and extracts:
  - Name
  - Address
  - Case Number
  - Date

### 3. **Template Population**
- **Data Preview**: Shows all extracted data before populating
- **Page Navigation**: Browse through multi-page PDFs
- **Field Display**: Clean presentation of extracted fields
- **Full Text Preview**: Shows complete text content from each page
- **Automatic Formatting**: Creates properly formatted canvas elements

### 4. **Editor Integration**
- **Seamless Flow**: Extracted data flows directly into the editor
- **Editable Elements**: All populated elements can be edited
- **Export Ready**: Populated templates can be exported as PDF

## User Flow

### Step 1: Upload PDF
1. Click the **"Upload PDF"** button in the top navigation bar
2. A modal dialog opens with upload options

### Step 2: Select PDF
Choose one of two methods:
- **Drag & Drop**: Drag a PDF file onto the dashed area
- **Browse**: Click "Browse Files" to select from your computer

### Step 3: Confirm Upload
- Review the selected file name and size
- Click **"Upload & Extract"** to process the PDF

### Step 4: Review Extracted Data
The system displays:
- **Extracted Fields**: Name, Address, Case Number, Date
- **Full Text Content**: Complete text from the PDF page
- **Page Navigation**: If PDF has multiple pages, navigate between them

### Step 5: Populate Template
Click **"Populate Template"** to:
- Create canvas elements with extracted data
- Open the editor with the populated template
- Allow further editing and customization

### Step 6: Export
- Edit the populated template as needed
- Click **"Export"** to download as PDF

## Technical Architecture

### Backend API: `/api/pdf-extract`

**Endpoint**: `POST /api/pdf-extract`

**Request**:
```
Content-Type: multipart/form-data
Body: { file: File }
```

**Response**:
```json
{
  "success": true,
  "pages": [
    {
      "pageNumber": 1,
      "text": "Full text content from page...",
      "data": {
        "name": "John Doe",
        "address": "123 Main St",
        "caseNumber": "CASE-2024-001",
        "date": "2024-01-15"
      }
    }
  ],
  "totalPages": 1
}
```

**Error Response**:
```json
{
  "error": "No text found in PDF. Please ensure the PDF contains readable text."
}
```

### Frontend Components

#### 1. **PDFUploadModal** (`app/components/PDFUploadModal.tsx`)
- Handles file selection (drag-drop and browse)
- Validates file type
- Shows file information
- Triggers upload process

**Props**:
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Close handler
- `onUpload: (file: File) => Promise<void>` - Upload handler
- `isLoading?: boolean` - Loading state

#### 2. **PDFTemplatePopulator** (`app/components/PDFTemplatePopulator.tsx`)
- Displays extracted data preview
- Handles multi-page navigation
- Creates canvas elements from extracted data
- Populates editor template

**Props**:
- `onPopulateTemplate: (elements: Omit<CanvasElement, 'id'>[]) => void` - Populate handler
- `onClose: () => void` - Close handler

#### 3. **Integration in Main App** (`app/page.tsx`)
- Manages modal states
- Handles PDF upload process
- Integrates extracted data into editor
- Creates canvas elements with proper IDs and z-index

## Data Flow

```
User Upload PDF
    ↓
PDFUploadModal (file selection)
    ↓
handlePDFUpload (send to API)
    ↓
/api/pdf-extract (extract text)
    ↓
PDFTemplatePopulator (preview data)
    ↓
handlePopulateTemplate (create elements)
    ↓
EditorCanvas (display and edit)
    ↓
Export as PDF
```

## Extracted Elements

When populating the template, the system creates the following canvas elements:

1. **Heading** (32px, bold)
   - Content: "Document Information"
   - Centered alignment

2. **Paragraph** (14px)
   - Contains: Name, Address, Case Number, Date
   - Formatted with line breaks

3. **Paragraph** (12px)
   - Contains: Full text content from PDF
   - Light gray background with padding
   - Scrollable if content is long

4. **Footer Text** (11px)
   - Shows page information
   - Centered, light gray color

## Error Handling

The system handles various error scenarios:

### PDF Upload Errors
- **No file selected**: Shows validation message
- **Wrong file type**: Alerts user to select PDF
- **Upload failure**: Shows error message with details
- **No text found**: Informs user PDF may be image-based

### Data Processing Errors
- **Extraction failure**: Falls back to regex-based method
- **Parsing error**: Shows user-friendly error message
- **Session storage error**: Handles missing data gracefully

## Formatting and Styling

### Extracted Data Display
- **Field Labels**: Bold, uppercase, gray text
- **Field Values**: Regular weight, dark text
- **Containers**: Light gray background with left border

### Populated Template Elements
- **Heading**: Bold, centered, dark color
- **Content**: Regular weight, readable line height
- **Background**: Subtle gray for text blocks
- **Padding**: Consistent spacing for readability

## Browser Compatibility

- Modern browsers with ES6+ support
- Requires JavaScript enabled
- Supports drag-and-drop API
- Uses HTML5 File API

## Performance Considerations

- **Large PDFs**: Text extraction may take a few seconds
- **Multi-page PDFs**: Each page is processed sequentially
- **Session Storage**: Data stored temporarily in browser
- **Memory**: Large PDFs may consume significant memory

## Security

- **Client-side Processing**: PDFs processed in browser
- **No Server Storage**: Files not permanently stored
- **Session-based**: Data cleared on browser close
- **File Validation**: Only PDF files accepted

## Future Enhancements

Potential improvements:
- OCR support for image-based PDFs
- Custom field extraction patterns
- Template selection before population
- Batch PDF processing
- PDF preview before extraction
- Field mapping customization
- Export to multiple formats

## Troubleshooting

### PDF Upload Fails
- Ensure file is a valid PDF
- Check file size (should be under 50MB)
- Try a different PDF file

### No Text Extracted
- PDF may be image-based (scanned document)
- Try OCR-enabled PDF if available
- Check PDF is not password-protected

### Fields Not Recognized
- Extracted fields follow specific patterns
- Check PDF contains expected field labels
- Manual editing available in template

### Template Not Populating
- Check browser console for errors
- Ensure JavaScript is enabled
- Clear browser cache and try again

## API Reference

### POST /api/pdf-extract

Extracts text and structured data from PDF files.

**Parameters**:
- `file` (File, required): PDF file to extract from

**Returns**:
- `success` (boolean): Operation success status
- `pages` (array): Array of extracted pages
  - `pageNumber` (number): Page number (1-indexed)
  - `text` (string): Full text content
  - `data` (object): Extracted fields
    - `name` (string): Extracted name
    - `address` (string): Extracted address
    - `caseNumber` (string): Extracted case number
    - `date` (string): Extracted date
- `totalPages` (number): Total pages in PDF

**Status Codes**:
- `200`: Success
- `400`: No file provided or no text found
- `500`: Server error during extraction

## Code Examples

### Using the PDF Upload System

```typescript
// In your component
import PDFUploadModal from './components/PDFUploadModal';

const [showModal, setShowModal] = useState(false);

const handleUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/pdf-extract', {
    method: 'POST',
    body: formData,
  });
  
  const data = await response.json();
  // Use extracted data...
};

return (
  <>
    <button onClick={() => setShowModal(true)}>Upload PDF</button>
    <PDFUploadModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onUpload={handleUpload}
    />
  </>
);
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for error messages
3. Ensure all dependencies are installed
4. Try with a different PDF file
