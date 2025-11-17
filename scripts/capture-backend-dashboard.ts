import { chromium } from 'playwright';
import { join } from 'path';

const SCREENSHOTS_DIR = join(process.cwd(), 'docs', 'screenshots');
const BACKEND_URL = 'http://localhost:3000';

async function captureBackendDashboard() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  try {
    console.log('📸 Capturing backend dashboard...');
    await page.goto(BACKEND_URL, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000); // Wait for page to fully render
    
    await page.screenshot({
      path: join(SCREENSHOTS_DIR, 'backend-dashboard.png'),
      fullPage: true,
    });
    console.log('✅ Backend dashboard captured');
  } catch (error) {
    console.error('❌ Error capturing backend dashboard:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

captureBackendDashboard().catch((error) => {
  console.error('Failed to capture backend dashboard:', error);
  process.exit(1);
});

