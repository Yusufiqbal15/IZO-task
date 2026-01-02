# Quick Start - PDF Upload & Edit System

## 🚀 Get Started in 3 Steps

### Step 1: Start the Application
```bash
cd my-app
npm install
npm run dev
```
Open: **http://localhost:3000**

### Step 2: Create a Test PDF
```bash
node create-test-pdf.js
```
This creates `public/sample-invoice.pdf`

### Step 3: Upload and Edit
1. Click **"Upload PDF"** button
2. Select `sample-invoice.pdf`
3. Wait for extraction
4. Edit data on the canvas
5. Click **"Export"** to download

---

## 📋 What You Can Do

### Upload PDFs
- Click the upload button
- Select any PDF with text content
- System automatically extracts data

### Edit Data
- Click any text element to select it
- Use right sidebar to edit:
  - Text content
  - Font size and style
  - Colors
  - Position and size

### Navigate Pages
- Left sidebar shows all pages
- Click page to jump to it
- Use Previous/Next buttons
- See extracted data for each page

### Export
- Click Export button
- PDF downloads automatically
- Filename includes page number

---

## 🎯 Key Features

✅ **Multi-Page Support** - Handle PDFs with multiple pages
✅ **Auto Data Extraction** - Automatically extract Name, Address, Case #, Date
✅ **Professional Templates** - Pre-designed invoice template
✅ **Full Editing** - Edit text, fonts, colors, positioning
✅ **Undo/Redo** - Ctrl+Z to undo, Ctrl+Shift+Z to redo
✅ **Export** - Download edited pages as PDF

---

## 📊 Extracted Data Fields

The system automatically extracts:
- **Name** - Customer/Company name
- **Address** - Full address
- **Case Number** - Reference number
- **Date** - Document date

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| PDF upload fails | Ensure PDF has readable text (not scanned images) |
| Data not extracted | Check PDF contains field labels like "Name:", "Address:" |
| Page navigation broken | Refresh page or clear SessionStorage |
| Export takes long | Reduce zoom level or simplify document |

---

## 📁 File Locations

- **Main App**: `app/page.tsx`
- **Edit Page**: `app/pdf-edit/page.tsx`
- **API**: `app/api/pdf-extract/route.ts`
- **Test PDF**: `public/sample-invoice.pdf`
- **Templates**: `app/data/templates.ts`

---

## 🌐 Browser Support

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Mobile (Limited)

---

## 💡 Tips

1. **Best Results**: Use PDFs with clear text and structured data
2. **Field Labels**: Include labels like "Name:", "Address:" in PDF
3. **Multiple Pages**: Each page is processed independently
4. **Editing**: Use right sidebar for detailed element control
5. **Export**: Page number is included in filename

---

## 🔐 Data Privacy

- All data stored locally (SessionStorage)
- No data sent to servers
- Session cleared when tab closes
- No persistent storage

---

## 📞 Support

Check these files for detailed information:
- `TEST_GUIDE.md` - Detailed testing guide
- `PDF_SYSTEM_DOCUMENTATION.md` - Complete technical documentation
- `README.md` - General information

---

**Ready to use!** Start with Step 1 above. 🎉
