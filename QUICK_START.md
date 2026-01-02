# 🚀 Quick Start Guide

## Installation

```bash
npm install
npm run dev
```

Open: **http://localhost:3000**

## How to Use PDF Upload Feature

### Step 1: Start Editor
- Click **"Blank Document"** OR select a **Template**

### Step 2: Upload PDF
- Look for **📤 icon** in the top-right navbar
- Click it to upload a PDF file

### Step 3: Auto-Fill
- PDF data is extracted automatically
- Invoice template loads with data filled in:
  - Name
  - Address
  - Case Number
  - Date

### Step 4: Edit
- Use the editor tools to modify any field
- Adjust colors, fonts, layout as needed

### Step 5: Export
- Click **"Export"** button
- PDF downloads to your device

## Features Available

✅ PDF Upload (📤 button in navbar)  
✅ Auto-extract data from PDF  
✅ Auto-fill template  
✅ Edit all fields  
✅ Undo/Redo  
✅ Zoom in/out  
✅ Export as PDF  
✅ Multiple templates  

## File Structure

```
/app
  /api
    /pdf-extract/route.ts    ← PDF data extraction
  /components
    TopNavbar.tsx            ← PDF upload button here
    StartPage.tsx            ← Homepage
  /pdf-smart-fill/           ← REMOVED (integrated into editor)
  page.tsx                   ← Main editor with PDF handler
```

## API Endpoints

- `POST /api/pdf-extract` - Upload PDF and extract data

## Troubleshooting

### PDF upload button not showing?
- Make sure you're in the editor (not homepage)
- Look in the top-right navbar

### PDF data not extracting?
- Ensure PDF contains readable text (not scanned image)
- Check browser console for errors

### Template not loading?
- Refresh the page
- Try uploading again

## Test PDF Content

Create a test PDF with:
```
Name: John Doe
Address: 123 Main Street, City, State
Case Number: 2024-001
Date: December 5, 2024
```

## Status: ✅ Ready to Use!
