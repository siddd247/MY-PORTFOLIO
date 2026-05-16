import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const urls = [
  { url: 'https://stc-red.vercel.app/', name: 'stc-preview.jpg' },
  { url: 'https://dental-web-two.vercel.app/', name: 'dental-preview.jpg' },
  { url: 'https://c9-runclub.vercel.app/', name: 'runclub-preview.jpg' },
  { url: 'https://best-dose.vercel.app/', name: 'bestdose-preview.jpg' }
];

const outputDir = path.join(process.cwd(), 'public', 'previews');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function takeScreenshots() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();
  
  // iPhone 14 Viewport
  await page.setViewport({ 
    width: 390, 
    height: 844, 
    isMobile: true, 
    hasTouch: true,
    deviceScaleFactor: 3
  });

  for (const item of urls) {
    console.log(`Navigating to ${item.url}...`);
    try {
      await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 60000 });
      console.log(`Waiting 3 seconds for ${item.url}...`);
      await new Promise(r => setTimeout(r, 3000));
      
      const outputPath = path.join(outputDir, item.name);
      await page.screenshot({
        path: outputPath,
        type: 'jpeg',
        quality: 90
      });
      console.log(`Saved screenshot to ${outputPath}`);
    } catch (err) {
      console.error(`Failed to take screenshot of ${item.url}:`, err.message);
    }
  }

  await browser.close();
  console.log('Screenshot task complete!');
}

takeScreenshots().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
