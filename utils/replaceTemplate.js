/**
 * Replace template placeholders with actual data
 */

export function replaceTemplate(template: string, data: any): string {
  let html = template;

  // Replace each placeholder with corresponding data
  html = html.replace(/\{\{name\}\}/g, data.name || '');
  html = html.replace(/\{\{address\}\}/g, data.address || '');
  html = html.replace(/\{\{caseNumber\}\}/g, data.caseNumber || '');
  html = html.replace(/\{\{date\}\}/g, data.date || '');

  return html;
}
