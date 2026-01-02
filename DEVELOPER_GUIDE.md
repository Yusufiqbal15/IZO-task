# Developer's Guide - PDF Upload & Edit System

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Initial Setup
```bash
# Clone or navigate to project
cd my-app

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

---

## 📂 Project Structure

```
my-app/
├── app/
│   ├── page.tsx                    # Main upload page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── pdf-edit/
│   │   └── page.tsx               # Multi-page edit interface
│   ├── api/
│   │   └── pdf-extract/
│   │       └── route.ts           # PDF extraction API
│   ├── components/
│   │   ├── EditorCanvas.tsx       # Canvas rendering
│   │   ├── TopNavbar.tsx          # Top navigation
│   │   ├── RightSidebar.tsx       # Properties panel
│   │   ├── LeftSidebar.tsx        # Tools panel
│   │   └── StartPage.tsx          # Start page
│   └── data/
│       └── templates.ts           # Invoice templates
├── utils/
│   ├── extractFields.ts           # Field extraction
│   └── replaceTemplate.ts         # Template replacement
├── public/
│   ├── sample-invoice.pdf         # Test PDF
│   └── ...
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

---

## 🔧 Key Components

### 1. PDF Extraction API (`app/api/pdf-extract/route.ts`)

**How it works**:
```typescript
// 1. Receive PDF file
const file = formData.get('file') as File;

// 2. Convert to buffer
const buffer = await file.arrayBuffer();

// 3. Extract text
const pages = await extractTextFromPDF(buffer);

// 4. Extract fields from each page
const extractedPages = pages.map((pageText, index) => ({
  pageNumber: index + 1,
  text: pageText,
  data: extractFields(pageText),
}));

// 5. Return JSON response
return NextResponse.json({
  success: true,
  pages: extractedPages,
  totalPages: extractedPages.length,
});
```

**To extend**:
- Modify `extractTextFromPDF()` for better PDF parsing
- Add OCR support using Tesseract.js
- Implement multi-page detection
- Add image extraction

### 2. PDF Edit Page (`app/pdf-edit/page.tsx`)

**Key functions**:
```typescript
// Load page data
const loadPage = (pages, pageIndex) => {
  // Get page data
  // Load template
  // Populate with extracted data
  // Update state
}

// Navigate pages
const handleNextPage = () => { /* ... */ }
const handlePreviousPage = () => { /* ... */ }
const handleGoToPage = (pageNumber) => { /* ... */ }

// Edit elements
const handleUpdateElement = (id, updates) => { /* ... */ }
const handleDeleteElement = (id) => { /* ... */ }

// History management
const handleUndo = () => { /* ... */ }
const handleRedo = () => { /* ... */ }

// Export
const handleExport = async () => { /* ... */ }
```

**To extend**:
- Add more templates
- Implement custom field mapping
- Add element templates
- Support for multiple exports

### 3. Field Extraction (`utils/extractFields.ts`)

**Current patterns**:
```typescript
// Name extraction
const nameMatch = text.match(/(?:name|Name|NAME)\s*:?\s*([^\n]+)/i);

// Address extraction
const addressMatch = text.match(/(?:address|Address|ADDRESS)\s*:?\s*([^\n]+)/i);

// Case number extraction
const caseMatch = text.match(/(?:case\s*(?:number|#|no\.?)|case\s*id)\s*:?\s*([^\n]+)/i);

// Date extraction
const dateMatch = text.match(/(?:date|Date|DATE)\s*:?\s*([^\n]+)/i);
```

**To extend**:
- Add more field types
- Improve regex patterns
- Add fuzzy matching
- Support multiple languages

---

## 🎨 Styling & UI

### Tailwind CSS
- Configuration: `tailwind.config.ts`
- Global styles: `app/globals.css`
- Component styles: Inline Tailwind classes

### Color Palette
```typescript
// Primary colors
primary: '#1e40af'    // Blue
secondary: '#2196f3'  // Light blue
accent: '#ff6b35'     // Orange
magenta: '#d946ef'    // Magenta

// Neutral colors
gray-50: '#f9fafb'
gray-100: '#f3f4f6'
gray-200: '#e5e7eb'
gray-700: '#374151'
gray-800: '#1f2937'
```

### Responsive Breakpoints
```typescript
// Tailwind breakpoints
sm: '640px'   // Small devices
md: '768px'   // Tablets
lg: '1024px'  // Desktops
xl: '1280px'  // Large screens
```

---

## 📝 State Management

### Main Page State
```typescript
const [elements, setElements] = useState<CanvasElement[]>([]);
const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
const [zoom, setZoom] = useState(100);
const [history, setHistory] = useState<CanvasElement[][]>([]);
const [historyIndex, setHistoryIndex] = useState(-1);
const [showEditor, setShowEditor] = useState(false);
```

### PDF Edit Page State
```typescript
const [state, setState] = useState<PDFEditState>({
  pages: [],
  currentPageIndex: 0,
  elements: [],
  selectedElement: null,
  zoom: 100,
  history: [],
  historyIndex: -1,
});
```

### SessionStorage
```typescript
// Store PDF data
sessionStorage.setItem('pdfData', JSON.stringify(result));

// Retrieve PDF data
const pdfData = JSON.parse(sessionStorage.getItem('pdfData'));

// Clear PDF data
sessionStorage.removeItem('pdfData');
```

---

## 🔄 Data Types

### CanvasElement
```typescript
interface CanvasElement {
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
```

### ExtractedFields
```typescript
interface ExtractedFields {
  name: string;
  address: string;
  caseNumber: string;
  date: string;
}
```

### PDFPageData
```typescript
interface PDFPageData {
  pageNumber: number;
  text: string;
  data: ExtractedFields;
}
```

---

## 🚀 Adding New Features

### Add a New Template

1. **Define template in `app/data/templates.ts`**:
```typescript
{
  id: 'my-template',
  name: 'My Template',
  elements: [
    {
      type: 'heading',
      x: 30,
      y: 20,
      width: 300,
      height: 30,
      content: 'My Template Title',
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000000',
      zIndex: 1,
    },
    // ... more elements
  ],
}
```

2. **Update template selection in `app/page.tsx`**:
```typescript
const handleLoadTemplate = useCallback((templateId: string) => {
  const template = templates.find((t) => t.id === templateId);
  // ... load template
}, []);
```

### Add a New Field Type

1. **Update extraction pattern in `utils/extractFields.ts`**:
```typescript
// Extract email
const emailMatch = text.match(/(?:email|Email|EMAIL)\s*:?\s*([^\n]+)/i);
if (emailMatch) {
  fields.email = emailMatch[1].trim();
}
```

2. **Update interface**:
```typescript
interface ExtractedFields {
  name: string;
  address: string;
  caseNumber: string;
  date: string;
  email: string;  // New field
}
```

3. **Use in template**:
```typescript
if (updatedContent.includes('{{email}}')) {
  updatedContent = updatedContent.replace('{{email}}', page.data.email || '');
}
```

### Add a New Element Type

1. **Update CanvasElement interface**:
```typescript
interface CanvasElement {
  // ... existing properties
  customProperty?: string;
}
```

2. **Handle in EditorCanvas**:
```typescript
if (element.type === 'myType') {
  // Render custom element
}
```

3. **Add to RightSidebar**:
```typescript
{element.type === 'myType' && (
  <div>
    {/* Custom property controls */}
  </div>
)}
```

---

## 🧪 Testing

### Unit Testing Setup
```bash
npm install --save-dev jest @testing-library/react
```

### Example Test
```typescript
import { extractFields } from '@/utils/extractFields';

describe('extractFields', () => {
  it('should extract name from text', () => {
    const text = 'Name: John Doe\nAddress: 123 Main St';
    const result = extractFields(text);
    expect(result.name).toBe('John Doe');
  });
});
```

### Manual Testing
```bash
# 1. Generate test PDF
node create-test-pdf.js

# 2. Start dev server
npm run dev

# 3. Test upload and editing
# 4. Check browser console for errors
# 5. Test all features
```

---

## 🐛 Debugging

### Browser DevTools
1. **Console**: Check for errors and logs
2. **Network**: Monitor API calls
3. **Storage**: View SessionStorage data
4. **Elements**: Inspect DOM structure

### Common Issues

**Issue**: PDF upload fails
```typescript
// Check API response
console.log('API Response:', response);
console.log('Response Status:', response.status);
```

**Issue**: Data not extracted
```typescript
// Check extracted text
console.log('Extracted Text:', text);
console.log('Extracted Fields:', extractedData);
```

**Issue**: Template not populating
```typescript
// Check template loading
console.log('Template:', invoiceTemplate);
console.log('Filled Elements:', filledElements);
```

### Logging
```typescript
// Add debug logs
console.log('Current state:', state);
console.log('Selected element:', selectedElement);
console.log('History:', history);
```

---

## 📦 Dependencies

### Core Dependencies
- **Next.js 16.0.3**: React framework
- **React 19.2.0**: UI library
- **Tailwind CSS 4**: Styling
- **html2canvas 1.4.1**: Canvas to image
- **jsPDF 3.0.4**: PDF generation
- **pdfjs-dist 4.0.379**: PDF parsing

### Dev Dependencies
- **TypeScript 5**: Type safety
- **ESLint 9**: Code linting
- **Autoprefixer 10.4.22**: CSS prefixing

### Adding Dependencies
```bash
npm install package-name
npm install --save-dev package-name
```

---

## 🚢 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Create `.env.local`:
```
# No environment variables required for basic functionality
# Add as needed for your deployment
```

### Deployment Platforms
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker**
- **Self-hosted**

---

## 📚 Code Style

### TypeScript
- Use strict mode
- Define interfaces for data types
- Use type annotations
- Avoid `any` type

### React
- Use functional components
- Use hooks for state management
- Use useCallback for memoization
- Keep components focused

### Naming Conventions
```typescript
// Components: PascalCase
function MyComponent() {}

// Functions: camelCase
function myFunction() {}

// Constants: UPPER_SNAKE_CASE
const MAX_SIZE = 100;

// Interfaces: PascalCase with I prefix (optional)
interface IMyInterface {}
```

---

## 🔐 Security Best Practices

### Input Validation
```typescript
// Validate file type
if (!file.type.startsWith('application/pdf')) {
  throw new Error('Invalid file type');
}

// Validate file size
if (file.size > 50 * 1024 * 1024) {
  throw new Error('File too large');
}
```

### Data Handling
```typescript
// Use SessionStorage (not localStorage)
sessionStorage.setItem('key', value);

// Clear sensitive data
sessionStorage.removeItem('pdfData');

// Avoid storing sensitive data
// Don't store passwords, tokens, etc.
```

### Error Handling
```typescript
try {
  // Operation
} catch (error) {
  console.error('Error:', error);
  // Show user-friendly message
  alert('An error occurred. Please try again.');
}
```

---

## 📈 Performance Optimization

### Code Splitting
```typescript
// Dynamic imports
const Component = dynamic(() => import('./Component'), {
  loading: () => <div>Loading...</div>,
});
```

### Memoization
```typescript
// Memoize callbacks
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);

// Memoize components
const MyComponent = React.memo(function MyComponent(props) {
  // ...
});
```

### Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/image.png"
  alt="Description"
  width={300}
  height={200}
/>
```

---

## 🎓 Learning Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

### Tutorials
- Next.js App Router
- React Hooks
- TypeScript Basics
- Tailwind CSS

### Tools
- VS Code
- Chrome DevTools
- Postman (for API testing)
- Git

---

## 🤝 Contributing

### Code Review Checklist
- ✅ Code follows style guide
- ✅ No console errors
- ✅ Tests pass
- ✅ Documentation updated
- ✅ Performance acceptable

### Commit Messages
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
```

---

## 📞 Support

### Getting Help
1. Check documentation files
2. Review code comments
3. Check browser console
4. Review API responses
5. Test with sample data

### Reporting Issues
- Describe the issue clearly
- Include error messages
- Provide steps to reproduce
- Include browser/OS info

---

## 🎉 Ready to Develop!

You now have everything needed to:
- Understand the codebase
- Add new features
- Fix bugs
- Deploy the application
- Extend functionality

**Happy coding!** 🚀

---

**Last Updated**: December 7, 2025
**Version**: 1.0.0
