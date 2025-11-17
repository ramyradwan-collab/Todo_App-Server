import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const QA_REPORT_FILE = join(process.cwd(), '..', 'QA_REPORT.md');

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  section?: string;
}

interface TestSection {
  name: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  skipped: number;
}

/**
 * Parses QA_REPORT.md and extracts test results organized by section
 */
export const parseQAReport = (): {
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    passRate: string;
  };
  sections: TestSection[];
} | null => {
  if (!existsSync(QA_REPORT_FILE)) {
    return null;
  }

  try {
    const content = readFileSync(QA_REPORT_FILE, 'utf-8');
    
    // Extract summary
    const totalMatch = content.match(/- \*\*Total Tests:\*\* (\d+)/);
    const passedMatch = content.match(/- \*\*Passed:\*\* (\d+)/);
    const failedMatch = content.match(/- \*\*Failed:\*\* (\d+)/);
    const skippedMatch = content.match(/- \*\*Skipped:\*\* (\d+)/);
    const passRateMatch = content.match(/- \*\*Pass Rate:\*\* ([\d.]+)%/);

    const summary = {
      total: totalMatch ? parseInt(totalMatch[1]) : 0,
      passed: passedMatch ? parseInt(passedMatch[1]) : 0,
      failed: failedMatch ? parseInt(failedMatch[1]) : 0,
      skipped: skippedMatch ? parseInt(skippedMatch[1]) : 0,
      passRate: passRateMatch ? passRateMatch[1] : '0',
    };

    // Extract sections
    const sections: TestSection[] = [];
    
    // Backend API Tests section
    const backendMatch = content.match(/## Backend API Tests\n\n(.*?)(?=## |$)/s);
    if (backendMatch) {
      const backendTests = extractTestsFromSection(backendMatch[1]);
      sections.push({
        name: 'Backend API Tests',
        tests: backendTests,
        passed: backendTests.filter(t => t.status === 'passed').length,
        failed: backendTests.filter(t => t.status === 'failed').length,
        skipped: backendTests.filter(t => t.status === 'skipped').length,
      });
    }

    // Frontend E2E Tests section
    const frontendMatch = content.match(/## Frontend E2E Tests\n\n(.*?)(?=## |$)/s);
    if (frontendMatch) {
      const frontendTests = extractTestsFromSection(frontendMatch[1]);
      sections.push({
        name: 'Frontend E2E Tests',
        tests: frontendTests,
        passed: frontendTests.filter(t => t.status === 'passed').length,
        failed: frontendTests.filter(t => t.status === 'failed').length,
        skipped: frontendTests.filter(t => t.status === 'skipped').length,
      });
    }

    return { summary, sections };
  } catch (error) {
    console.error('Error parsing QA report:', error);
    return null;
  }
};

function extractTestsFromSection(sectionContent: string): TestResult[] {
  const tests: TestResult[] = [];
  
  // Extract failed tests
  const failedMatch = sectionContent.match(/### ❌ Failed Tests.*?\n\n(.*?)(?=### |$)/s);
  if (failedMatch) {
    const failedTests = failedMatch[1].matchAll(/\d+\. \*\*(.*?)\*\*/g);
    for (const match of failedTests) {
      tests.push({ name: match[1], status: 'failed' });
    }
  }

  // Extract passed tests
  const passedMatch = sectionContent.match(/### ✅ Passed Tests.*?\n\n(.*?)(?=### |$)/s);
  if (passedMatch) {
    const passedTests = passedMatch[1].matchAll(/\d+\. \*\*(.*?)\*\*/g);
    for (const match of passedTests) {
      tests.push({ name: match[1], status: 'passed' });
    }
  }

  // Extract skipped tests
  const skippedMatch = sectionContent.match(/### ⏭️ Skipped Tests.*?\n\n(.*?)(?=### |$)/s);
  if (skippedMatch) {
    const skippedTests = skippedMatch[1].matchAll(/\d+\. \*\*(.*?)\*\*/g);
    for (const match of skippedTests) {
      tests.push({ name: match[1], status: 'skipped' });
    }
  }

  return tests;
}

