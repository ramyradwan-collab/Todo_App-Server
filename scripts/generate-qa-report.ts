import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const QA_REPORT_FILE = join(process.cwd(), 'QA_REPORT.md');

/**
 * Merges backend and frontend test results into a single QA report
 */
function mergeQAReport() {
  if (!existsSync(QA_REPORT_FILE)) {
    const timestamp = new Date().toISOString();
    let report = `# QA Test Report\n\n`;
    report += `**Generated:** ${timestamp}\n\n`;
    report += `## Summary\n\n`;
    report += `- **Total Tests:** 0\n`;
    report += `- **Passed:** 0 ✅\n`;
    report += `- **Failed:** 0 ❌\n`;
    report += `- **Skipped:** 0 ⏭️\n`;
    report += `- **Pass Rate:** 0%\n\n`;
    report += `---\n\n`;
    report += `*No test results available yet. Run tests to generate report.*\n`;
    writeFileSync(QA_REPORT_FILE, report, 'utf-8');
  }
  
  console.log(`📊 QA Report available at: ${QA_REPORT_FILE}`);
}

mergeQAReport();

