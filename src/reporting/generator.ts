
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateReport(data: any, outputPath: string): Promise<string> {
  const templatePath = path.join(__dirname, 'templates', 'report-template.html');
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found at ${templatePath}`);
  }

  let html = await fs.readFile(templatePath, 'utf-8');

  // Simple template injection
  // We assume the template has a placeholder like <!-- DATA_INJECTION --> or we just append it
  // Looking at the file list, report-template.html exists. 
  // Let's inject the data as a global JS variable so the frontend can render it, 
  // or simple string replacement if the template expects that.
  
  const payload = JSON.stringify(data, null, 2);
  
  // Replace a placeholder if it exists, otherwise inject at the end of body
  if (html.includes('<!-- AUDIT_DATA -->')) {
      html = html.replace('<!-- AUDIT_DATA -->', `<script>window.AUDIT_DATA = ${payload};</script>`);
  } else {
      // Fallback
      html = html.replace('</body>', `<script>window.AUDIT_DATA = ${payload};</script></body>`);
  }

  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, html);
  
  return outputPath;
}
