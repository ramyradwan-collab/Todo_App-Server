import type { Reporter, Task } from 'vitest';
import { qaReporter } from './qaReporter';

export default class VitestQAReporter implements Reporter {
  private tasks: Map<string, { name: string; duration: number; status: 'passed' | 'failed' | 'skipped' }> = new Map();

  onTaskUpdate(pairs: [string, Task][]) {
    for (const [id, task] of pairs) {
      if (task.type === 'test') {
        const duration = task.result?.duration || 0;
        let status: 'passed' | 'failed' | 'skipped' = 'skipped';
        
        if (task.result?.state === 'pass') {
          status = 'passed';
        } else if (task.result?.state === 'fail') {
          status = 'failed';
        } else if (task.mode === 'skip' || task.mode === 'todo') {
          status = 'skipped';
        }

        this.tasks.set(id, {
          name: task.name,
          duration,
          status,
        });
      }
    }
  }

  onFinished() {
    // Report all collected tests
    for (const task of this.tasks.values()) {
      qaReporter.addTest(task.name, task.status, task.duration);
    }
    qaReporter.generateReport();
  }
}
