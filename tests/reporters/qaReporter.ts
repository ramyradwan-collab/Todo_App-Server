import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface TestReport {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  suggestions: string[];
}

class QAReporter implements Reporter {
  private tests: TestReport[] = [];
  private outputFile = join(process.cwd(), 'QA_REPORT.md');

  onTestEnd(test: TestCase, result: TestResult) {
    const suggestions: string[] = [];
    
    // Analyze test for potential issues
    if (result.status === 'failed') {
      suggestions.push('❌ Test failed - review error details');
      if (result.error?.message?.includes('timeout')) {
        suggestions.push('⏱️ Consider increasing timeout or checking for slow operations');
      }
      if (result.error?.message?.includes('selector')) {
        suggestions.push('🔍 Check selector stability - may need more specific data-testid');
      }
    }
    
    if (result.status === 'passed') {
      if (result.duration > 5000) {
        suggestions.push('⚠️ Test is slow - consider optimization');
      }
    }
    
    // Check for flaky patterns
    const testTitle = test.title.toLowerCase();
    if (testTitle.includes('refresh') || testTitle.includes('persist')) {
      suggestions.push('💾 Verify backend persistence is working correctly');
    }
    
    if (testTitle.includes('filter') || testTitle.includes('count')) {
      suggestions.push('🔢 Verify filter counts match actual task states');
    }

    this.tests.push({
      name: test.title,
      status: result.status,
      duration: result.duration,
      suggestions: suggestions.length > 0 ? suggestions : ['✅ No issues detected'],
    });
  }

  onEnd() {
    this.generateReport();
  }

  private generateReport() {
    const timestamp = new Date().toISOString();
    const passed = this.tests.filter(t => t.status === 'passed').length;
    const failed = this.tests.filter(t => t.status === 'failed').length;
    const skipped = this.tests.filter(t => t.status === 'skipped').length;
    const total = this.tests.length;
    const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0';

    // Read existing report to merge with backend tests
    const existingReport = existsSync(this.outputFile) ? readFileSync(this.outputFile, 'utf-8') : '';
    const hasBackendTests = existingReport.includes('## Backend API Tests');
    
    let report = '';
    
    if (!hasBackendTests) {
      // Generate new report
      report = `# QA Test Report\n\n`;
      report += `**Generated:** ${timestamp}\n\n`;
      report += `## Summary\n\n`;
      report += `- **Total Tests:** ${total}\n`;
      report += `- **Passed:** ${passed} ✅\n`;
      report += `- **Failed:** ${failed} ❌\n`;
      report += `- **Skipped:** ${skipped} ⏭️\n`;
      report += `- **Pass Rate:** ${passRate}%\n\n`;
      report += `---\n\n`;
      report += `## Frontend E2E Tests\n\n`;
      report += this.formatFrontendTests();
      report += `\n---\n\n`;
      report += `*Report generated automatically after test run*\n`;
    } else {
      // Merge with existing backend tests - extract backend section and replace frontend section
      const backendIndex = existingReport.indexOf('## Backend API Tests');
      const frontendIndex = existingReport.indexOf('## Frontend E2E Tests');
      
      // Extract backend section (from "## Backend API Tests" to "## Frontend E2E Tests" or end)
      let backendSection = '';
      if (backendIndex !== -1) {
        if (frontendIndex !== -1) {
          backendSection = existingReport.substring(backendIndex, frontendIndex);
        } else {
          backendSection = existingReport.substring(backendIndex);
        }
      }
      
      // Extract summary section
      const summaryMatch = existingReport.match(/## Summary\n\n(.*?)\n---/s);
      
      // Update summary with combined totals
      if (summaryMatch && backendIndex !== -1) {
        const backendTotalMatch = existingReport.match(/- \*\*Total Tests:\*\* (\d+)/);
        const backendPassedMatch = existingReport.match(/- \*\*Passed:\*\* (\d+) ✅/);
        const backendFailedMatch = existingReport.match(/- \*\*Failed:\*\* (\d+) ❌/);
        const backendSkippedMatch = existingReport.match(/- \*\*Skipped:\*\* (\d+) ⏭️/);
        
        const backendTotal = backendTotalMatch ? parseInt(backendTotalMatch[1]) : 0;
        const backendPassed = backendPassedMatch ? parseInt(backendPassedMatch[1]) : 0;
        const backendFailed = backendFailedMatch ? parseInt(backendFailedMatch[1]) : 0;
        const backendSkipped = backendSkippedMatch ? parseInt(backendSkippedMatch[1]) : 0;
        
        const combinedTotal = backendTotal + total;
        const combinedPassed = backendPassed + passed;
        const combinedFailed = backendFailed + failed;
        const combinedSkipped = backendSkipped + skipped;
        const combinedPassRate = combinedTotal > 0 ? ((combinedPassed / combinedTotal) * 100).toFixed(1) : '0';
        
        report = `# QA Test Report\n\n`;
        report += `**Generated:** ${timestamp}\n\n`;
        report += `## Summary\n\n`;
        report += `- **Total Tests:** ${combinedTotal}\n`;
        report += `- **Passed:** ${combinedPassed} ✅\n`;
        report += `- **Failed:** ${combinedFailed} ❌\n`;
        report += `- **Skipped:** ${combinedSkipped} ⏭️\n`;
        report += `- **Pass Rate:** ${combinedPassRate}%\n\n`;
        report += `---\n\n`;
        report += backendSection;
        report += `\n## Frontend E2E Tests\n\n`;
        report += this.formatFrontendTests();
        report += `\n---\n\n`;
        report += `*Report generated automatically after test run*\n`;
      } else {
        // Fallback: just append frontend section
        report = existingReport.replace(/## Frontend E2E Tests[\s\S]*?---\n\n\*Report generated/, 
          `## Frontend E2E Tests\n\n${this.formatFrontendTests()}\n---\n\n*Report generated`);
        if (!report.includes('## Frontend E2E Tests')) {
          report = existingReport + `\n## Frontend E2E Tests\n\n${this.formatFrontendTests()}\n---\n\n*Report generated automatically after test run*\n`;
        }
      }
    }

    writeFileSync(this.outputFile, report, 'utf-8');
    console.log(`\n📊 QA Report updated: ${this.outputFile}`);
  }

  private formatFrontendTests(): string {
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

export default QAReporter;

