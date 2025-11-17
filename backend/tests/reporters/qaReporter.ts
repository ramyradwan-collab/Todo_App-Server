import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  suggestions: string[];
}

class QAReporter {
  private tests: TestResult[] = [];
  private outputFile = join(process.cwd(), '..', 'QA_REPORT.md');

  addTest(name: string, status: 'passed' | 'failed' | 'skipped', duration: number, error?: any) {
    const suggestions: string[] = [];
    
    if (status === 'failed') {
      suggestions.push('❌ Test failed - review error details');
      if (error?.message?.includes('timeout')) {
        suggestions.push('⏱️ Consider increasing timeout');
      }
      if (error?.message?.includes('404') || error?.message?.includes('not found')) {
        suggestions.push('🔍 Verify API endpoint exists and data is seeded correctly');
      }
      if (error?.message?.includes('400')) {
        suggestions.push('✅ Verify request validation is working as expected');
      }
    }
    
    if (status === 'passed') {
      if (duration > 1000) {
        suggestions.push('⚠️ Test is slow - consider optimization');
      }
    }
    
    // Check for common patterns
    const testName = name.toLowerCase();
    if (testName.includes('persist') || testName.includes('seed')) {
      suggestions.push('💾 Verify test data isolation is working');
    }
    
    if (testName.includes('validation') || testName.includes('reject')) {
      suggestions.push('✅ Validation tests ensure API security');
    }

    this.tests.push({
      name,
      status,
      duration,
      suggestions: suggestions.length > 0 ? suggestions : ['✅ No issues detected'],
    });
  }

  generateReport() {
    const existingReport = existsSync(this.outputFile) ? readFileSync(this.outputFile, 'utf-8') : '';
    const timestamp = new Date().toISOString();
    const passed = this.tests.filter(t => t.status === 'passed').length;
    const failed = this.tests.filter(t => t.status === 'failed').length;
    const skipped = this.tests.filter(t => t.status === 'skipped').length;
    const total = this.tests.length;
    const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0';

    let report = `# QA Test Report\n\n`;
    report += `**Generated:** ${timestamp}\n\n`;
    report += `## Summary\n\n`;
    report += `- **Total Tests:** ${total}\n`;
    report += `- **Passed:** ${passed} ✅\n`;
    report += `- **Failed:** ${failed} ❌\n`;
    report += `- **Skipped:** ${skipped} ⏭️\n`;
    report += `- **Pass Rate:** ${passRate}%\n\n`;
    report += `---\n\n`;
    
    // Check if there's existing frontend test data
    const hasFrontendTests = existingReport.includes('## Frontend E2E Tests') || 
                            existingReport.includes('## Backend API Tests');
    
    if (!hasFrontendTests) {
      report += `## Backend API Tests\n\n`;
    } else {
      // Insert backend tests before frontend tests
      const frontendIndex = existingReport.indexOf('## Frontend E2E Tests');
      if (frontendIndex > 0) {
        const beforeFrontend = existingReport.substring(0, frontendIndex);
        const afterFrontend = existingReport.substring(frontendIndex);
        report = beforeFrontend + `## Backend API Tests\n\n` + this.formatBackendTests() + `\n` + afterFrontend;
        writeFileSync(this.outputFile, report, 'utf-8');
        return;
      }
    }

    report += this.formatBackendTests();
    
    if (hasFrontendTests && !existingReport.includes('## Backend API Tests')) {
      const frontendIndex = existingReport.indexOf('## Frontend E2E Tests');
      if (frontendIndex > 0) {
        report += existingReport.substring(frontendIndex);
      }
    }

    report += `\n---\n\n`;
    report += `*Report generated automatically after test run*\n`;

    writeFileSync(this.outputFile, report, 'utf-8');
  }

  private formatBackendTests(): string {
    const failedTests = this.tests.filter(t => t.status === 'failed');
    const passedTests = this.tests.filter(t => t.status === 'passed');
    const skippedTests = this.tests.filter(t => t.status === 'skipped');

    let formatted = '';

    if (failedTests.length > 0) {
      formatted += `### ❌ Failed Tests (${failedTests.length})\n\n`;
      failedTests.forEach((test, index) => {
        formatted += `${index + 1}. **${test.name}**\n`;
        formatted += `   - Status: ${test.status.toUpperCase()}\n`;
        formatted += `   - Duration: ${test.duration.toFixed(0)}ms\n`;
        formatted += `   - Suggestions:\n`;
        test.suggestions.forEach(s => {
          formatted += `     - ${s}\n`;
        });
        formatted += `\n`;
      });
    }

    if (passedTests.length > 0) {
      formatted += `### ✅ Passed Tests (${passedTests.length})\n\n`;
      passedTests.forEach((test, index) => {
        formatted += `${index + 1}. **${test.name}**\n`;
        formatted += `   - Duration: ${test.duration.toFixed(0)}ms\n`;
        if (test.suggestions.some(s => !s.includes('✅'))) {
          formatted += `   - Suggestions:\n`;
          test.suggestions.forEach(s => {
            formatted += `     - ${s}\n`;
          });
        }
        formatted += `\n`;
      });
    }

    if (skippedTests.length > 0) {
      formatted += `### ⏭️ Skipped Tests (${skippedTests.length})\n\n`;
      skippedTests.forEach((test, index) => {
        formatted += `${index + 1}. **${test.name}**\n\n`;
      });
    }

    return formatted;
  }
}

export const qaReporter = new QAReporter();

