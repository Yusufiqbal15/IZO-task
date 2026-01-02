import { NextRequest, NextResponse } from 'next/server';
import { replaceTemplate } from '@/utils/replaceTemplate';
import { readFileSync } from 'fs';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const puppeteer = require('puppeteer');

export async function POST(request: NextRequest) {
  let browser;
  try {
    const body = await request.json();
    const { name, address, caseNumber, date } = body;

    // Read template file
    const templatePath = join(process.cwd(), 'templates', 'smart-template.html');
    const template = readFileSync(templatePath, 'utf-8');

    // Replace placeholders with data
    const data = { name, address, caseNumber, date };
    const html = replaceTemplate(template, data);

    // Launch Puppeteer browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.createPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });

    await browser.close();

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="generated-document.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    if (browser) {
      await browser.close();
    }
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
