/**
 * Extract fields from PDF text using regex patterns
 */

export function extractFields(text) {
  const fields = {
    name: '',
    address: '',
    caseNumber: '',
    date: '',
  };

  // Extract name - look for "Name:" or "name:" followed by text
  const nameMatch = text.match(/(?:name|Name|NAME)\s*:?\s*([^\n]+)/i);
  if (nameMatch) {
    fields.name = nameMatch[1].trim();
  }

  // Extract address - look for "Address:" or "address:" followed by text
  const addressMatch = text.match(/(?:address|Address|ADDRESS)\s*:?\s*([^\n]+)/i);
  if (addressMatch) {
    fields.address = addressMatch[1].trim();
  }

  // Extract case number - look for "Case Number:", "Case #", etc.
  const caseMatch = text.match(/(?:case\s*(?:number|#|no\.?)|case\s*id)\s*:?\s*([^\n]+)/i);
  if (caseMatch) {
    fields.caseNumber = caseMatch[1].trim();
  }

  // Extract date - look for common date patterns
  const dateMatch = text.match(/(?:date|Date|DATE)\s*:?\s*([^\n]+)/i);
  if (dateMatch) {
    fields.date = dateMatch[1].trim();
  }

  return fields;
}
