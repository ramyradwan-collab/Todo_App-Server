# QA Test Report

**Generated:** 2025-11-17T18:20:02.787Z

## Summary

- **Total Tests:** 10
- **Passed:** 7 ✅
- **Failed:** 1 ❌
- **Skipped:** 0 ⏭️
- **Pass Rate:** 70.0%

---

## Backend API Tests


---

*Report generated automatically after test run*

## Frontend E2E Tests

### ❌ Failed Tests (1)

1. **should verify filter counts for All/Active/Completed**
   - Status: FAILED
   - Duration: 6194ms
   - Suggestions:
     - ❌ Test failed - review error details
     - ⏱️ Consider increasing timeout or checking for slow operations
     - 🔢 Verify filter counts match actual task states

### ✅ Passed Tests (7)

1. **should add a task**
   - Duration: 1146ms

2. **should filter tasks by Active**
   - Duration: 1260ms
   - Suggestions:
     - 🔢 Verify filter counts match actual task states

3. **should persist tasks after page refresh**
   - Duration: 1199ms
   - Suggestions:
     - 💾 Verify backend persistence is working correctly

4. **should delete a task**
   - Duration: 1269ms

5. **should toggle task completion**
   - Duration: 1312ms

6. **should filter tasks by Completed**
   - Duration: 478ms
   - Suggestions:
     - 🔢 Verify filter counts match actual task states

7. **should display system health banner**
   - Duration: 462ms


---

*Report generated automatically after test run*
