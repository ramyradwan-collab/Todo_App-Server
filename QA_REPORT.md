# QA Test Report

**Generated:** 2025-11-18T17:39:34.647Z

## Summary

- **Total Tests:** 100
- **Passed:** 36 ✅
- **Failed:** 55 ❌
- **Skipped:** 0 ⏭️
- **Pass Rate:** 36.0%

---

## Backend API Tests


---

*Report generated automatically after test run*

## Backend API Tests

### ✅ Passed Tests (24)

1. **GET /health - should return { ok: true }**
   - Duration: 8ms

2. **GET /tasks - should return empty array when no tasks exist**
   - Duration: 1ms

3. **GET /tasks - should return all tasks sorted newest first**
   - Duration: 2ms

4. **GET /tasks - should return tasks with all required fields**
   - Duration: 1ms

5. **POST /tasks - should create a new task with valid title**
   - Duration: 5ms

6. **POST /tasks - should trim whitespace from task title**
   - Duration: 1ms

7. **POST /tasks - should reject empty title**
   - Duration: 1ms

8. **POST /tasks - should reject whitespace-only title**
   - Duration: 1ms

9. **POST /tasks - should reject very long title**
   - Duration: 1ms

10. **POST /tasks - should reject missing title field**
   - Duration: 1ms

11. **POST /tasks - should reject non-string title**
   - Duration: 1ms

12. **POST /tasks - should persist created task to data file**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

13. **PUT /tasks/:id - should toggle task completion status**
   - Duration: 1ms

14. **PUT /tasks/:id - should toggle from completed to active**
   - Duration: 1ms

15. **PUT /tasks/:id - should return 404 when task does not exist**
   - Duration: 0ms

16. **PUT /tasks/:id - should reject non-boolean completed value**
   - Duration: 1ms

17. **PUT /tasks/:id - should reject very long title on update**
   - Duration: 1ms

18. **PUT /tasks/:id - should persist completion status change**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

19. **DELETE /tasks/:id - should delete an existing task**
   - Duration: 2ms

20. **DELETE /tasks/:id - should return 404 when task does not exist**
   - Duration: 0ms

21. **DELETE /tasks/:id - should persist deletion to data file**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

22. **GET /stats - should return task statistics**
   - Duration: 1ms

23. **GET /stats - should return zero counts when no tasks exist**
   - Duration: 0ms

24. **Integration - should handle complete task lifecycle**
   - Duration: 3ms


## Backend API Tests


## Backend API Tests

### ✅ Passed Tests (24)

1. **GET /health - should return { ok: true }**
   - Duration: 8ms

2. **GET /tasks - should return empty array when no tasks exist**
   - Duration: 2ms

3. **GET /tasks - should return all tasks sorted newest first**
   - Duration: 1ms

4. **GET /tasks - should return tasks with all required fields**
   - Duration: 1ms

5. **POST /tasks - should create a new task with valid title**
   - Duration: 4ms

6. **POST /tasks - should trim whitespace from task title**
   - Duration: 1ms

7. **POST /tasks - should reject empty title**
   - Duration: 0ms

8. **POST /tasks - should reject whitespace-only title**
   - Duration: 1ms

9. **POST /tasks - should reject very long title**
   - Duration: 1ms

10. **POST /tasks - should reject missing title field**
   - Duration: 1ms

11. **POST /tasks - should reject non-string title**
   - Duration: 0ms

12. **POST /tasks - should persist created task to data file**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

13. **PUT /tasks/:id - should toggle task completion status**
   - Duration: 0ms

14. **PUT /tasks/:id - should toggle from completed to active**
   - Duration: 0ms

15. **PUT /tasks/:id - should return 404 when task does not exist**
   - Duration: 1ms

16. **PUT /tasks/:id - should reject non-boolean completed value**
   - Duration: 0ms

17. **PUT /tasks/:id - should reject very long title on update**
   - Duration: 0ms

18. **PUT /tasks/:id - should persist completion status change**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

19. **DELETE /tasks/:id - should delete an existing task**
   - Duration: 2ms

20. **DELETE /tasks/:id - should return 404 when task does not exist**
   - Duration: 0ms

21. **DELETE /tasks/:id - should persist deletion to data file**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

22. **GET /stats - should return task statistics**
   - Duration: 0ms

23. **GET /stats - should return zero counts when no tasks exist**
   - Duration: 0ms

24. **Integration - should handle complete task lifecycle**
   - Duration: 4ms


## Backend API Tests


## Backend API Tests

### ✅ Passed Tests (24)

1. **GET /health - should return { ok: true }**
   - Duration: 8ms

2. **GET /tasks - should return empty array when no tasks exist**
   - Duration: 1ms

3. **GET /tasks - should return all tasks sorted newest first**
   - Duration: 1ms

4. **GET /tasks - should return tasks with all required fields**
   - Duration: 1ms

5. **POST /tasks - should create a new task with valid title**
   - Duration: 7ms

6. **POST /tasks - should trim whitespace from task title**
   - Duration: 1ms

7. **POST /tasks - should reject empty title**
   - Duration: 2ms

8. **POST /tasks - should reject whitespace-only title**
   - Duration: 1ms

9. **POST /tasks - should reject very long title**
   - Duration: 1ms

10. **POST /tasks - should reject missing title field**
   - Duration: 1ms

11. **POST /tasks - should reject non-string title**
   - Duration: 1ms

12. **POST /tasks - should persist created task to data file**
   - Duration: 2ms
   - Suggestions:
     - 💾 Verify test data isolation is working

13. **PUT /tasks/:id - should toggle task completion status**
   - Duration: 1ms

14. **PUT /tasks/:id - should toggle from completed to active**
   - Duration: 2ms

15. **PUT /tasks/:id - should return 404 when task does not exist**
   - Duration: 0ms

16. **PUT /tasks/:id - should reject non-boolean completed value**
   - Duration: 0ms

17. **PUT /tasks/:id - should reject very long title on update**
   - Duration: 1ms

18. **PUT /tasks/:id - should persist completion status change**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

19. **DELETE /tasks/:id - should delete an existing task**
   - Duration: 1ms

20. **DELETE /tasks/:id - should return 404 when task does not exist**
   - Duration: 1ms

21. **DELETE /tasks/:id - should persist deletion to data file**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

22. **GET /stats - should return task statistics**
   - Duration: 1ms

23. **GET /stats - should return zero counts when no tasks exist**
   - Duration: 0ms

24. **Integration - should handle complete task lifecycle**
   - Duration: 4ms


## Backend API Tests


## Backend API Tests

### ✅ Passed Tests (24)

1. **GET /health - should return { ok: true }**
   - Duration: 7ms

2. **GET /tasks - should return empty array when no tasks exist**
   - Duration: 3ms

3. **GET /tasks - should return all tasks sorted newest first**
   - Duration: 2ms

4. **GET /tasks - should return tasks with all required fields**
   - Duration: 1ms

5. **POST /tasks - should create a new task with valid title**
   - Duration: 6ms

6. **POST /tasks - should trim whitespace from task title**
   - Duration: 2ms

7. **POST /tasks - should reject empty title**
   - Duration: 1ms

8. **POST /tasks - should reject whitespace-only title**
   - Duration: 1ms

9. **POST /tasks - should reject very long title**
   - Duration: 2ms

10. **POST /tasks - should reject missing title field**
   - Duration: 1ms

11. **POST /tasks - should reject non-string title**
   - Duration: 1ms

12. **POST /tasks - should persist created task to data file**
   - Duration: 2ms
   - Suggestions:
     - 💾 Verify test data isolation is working

13. **PUT /tasks/:id - should toggle task completion status**
   - Duration: 1ms

14. **PUT /tasks/:id - should toggle from completed to active**
   - Duration: 1ms

15. **PUT /tasks/:id - should return 404 when task does not exist**
   - Duration: 1ms

16. **PUT /tasks/:id - should reject non-boolean completed value**
   - Duration: 1ms

17. **PUT /tasks/:id - should reject very long title on update**
   - Duration: 1ms

18. **PUT /tasks/:id - should persist completion status change**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

19. **DELETE /tasks/:id - should delete an existing task**
   - Duration: 1ms

20. **DELETE /tasks/:id - should return 404 when task does not exist**
   - Duration: 0ms

21. **DELETE /tasks/:id - should persist deletion to data file**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

22. **GET /stats - should return task statistics**
   - Duration: 1ms

23. **GET /stats - should return zero counts when no tasks exist**
   - Duration: 0ms

24. **Integration - should handle complete task lifecycle**
   - Duration: 2ms


## Backend API Tests


## Backend API Tests

### ✅ Passed Tests (24)

1. **GET /health - should return { ok: true }**
   - Duration: 8ms

2. **GET /tasks - should return empty array when no tasks exist**
   - Duration: 2ms

3. **GET /tasks - should return all tasks sorted newest first**
   - Duration: 1ms

4. **GET /tasks - should return tasks with all required fields**
   - Duration: 1ms

5. **POST /tasks - should create a new task with valid title**
   - Duration: 5ms

6. **POST /tasks - should trim whitespace from task title**
   - Duration: 1ms

7. **POST /tasks - should reject empty title**
   - Duration: 1ms

8. **POST /tasks - should reject whitespace-only title**
   - Duration: 1ms

9. **POST /tasks - should reject very long title**
   - Duration: 1ms

10. **POST /tasks - should reject missing title field**
   - Duration: 1ms

11. **POST /tasks - should reject non-string title**
   - Duration: 0ms

12. **POST /tasks - should persist created task to data file**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

13. **PUT /tasks/:id - should toggle task completion status**
   - Duration: 1ms

14. **PUT /tasks/:id - should toggle from completed to active**
   - Duration: 0ms

15. **PUT /tasks/:id - should return 404 when task does not exist**
   - Duration: 0ms

16. **PUT /tasks/:id - should reject non-boolean completed value**
   - Duration: 1ms

17. **PUT /tasks/:id - should reject very long title on update**
   - Duration: 1ms

18. **PUT /tasks/:id - should persist completion status change**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

19. **DELETE /tasks/:id - should delete an existing task**
   - Duration: 1ms

20. **DELETE /tasks/:id - should return 404 when task does not exist**
   - Duration: 1ms

21. **DELETE /tasks/:id - should persist deletion to data file**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

22. **GET /stats - should return task statistics**
   - Duration: 1ms

23. **GET /stats - should return zero counts when no tasks exist**
   - Duration: 0ms

24. **Integration - should handle complete task lifecycle**
   - Duration: 4ms


## Backend API Tests


## Backend API Tests

### ✅ Passed Tests (24)

1. **GET /health - should return { ok: true }**
   - Duration: 8ms

2. **GET /tasks - should return empty array when no tasks exist**
   - Duration: 1ms

3. **GET /tasks - should return all tasks sorted newest first**
   - Duration: 1ms

4. **GET /tasks - should return tasks with all required fields**
   - Duration: 1ms

5. **POST /tasks - should create a new task with valid title**
   - Duration: 7ms

6. **POST /tasks - should trim whitespace from task title**
   - Duration: 1ms

7. **POST /tasks - should reject empty title**
   - Duration: 0ms

8. **POST /tasks - should reject whitespace-only title**
   - Duration: 1ms

9. **POST /tasks - should reject very long title**
   - Duration: 1ms

10. **POST /tasks - should reject missing title field**
   - Duration: 1ms

11. **POST /tasks - should reject non-string title**
   - Duration: 1ms

12. **POST /tasks - should persist created task to data file**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

13. **PUT /tasks/:id - should toggle task completion status**
   - Duration: 1ms

14. **PUT /tasks/:id - should toggle from completed to active**
   - Duration: 1ms

15. **PUT /tasks/:id - should return 404 when task does not exist**
   - Duration: 1ms

16. **PUT /tasks/:id - should reject non-boolean completed value**
   - Duration: 1ms

17. **PUT /tasks/:id - should reject very long title on update**
   - Duration: 1ms

18. **PUT /tasks/:id - should persist completion status change**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

19. **DELETE /tasks/:id - should delete an existing task**
   - Duration: 1ms

20. **DELETE /tasks/:id - should return 404 when task does not exist**
   - Duration: 0ms

21. **DELETE /tasks/:id - should persist deletion to data file**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

22. **GET /stats - should return task statistics**
   - Duration: 1ms

23. **GET /stats - should return zero counts when no tasks exist**
   - Duration: 1ms

24. **Integration - should handle complete task lifecycle**
   - Duration: 2ms


## Backend API Tests



## Backend API Tests

### ✅ Passed Tests (24)

1. **GET /health - should return { ok: true }**
   - Duration: 7ms

2. **GET /tasks - should return empty array when no tasks exist**
   - Duration: 2ms

3. **GET /tasks - should return all tasks sorted newest first**
   - Duration: 2ms

4. **GET /tasks - should return tasks with all required fields**
   - Duration: 1ms

5. **POST /tasks - should create a new task with valid title**
   - Duration: 5ms

6. **POST /tasks - should trim whitespace from task title**
   - Duration: 1ms

7. **POST /tasks - should reject empty title**
   - Duration: 1ms

8. **POST /tasks - should reject whitespace-only title**
   - Duration: 1ms

9. **POST /tasks - should reject very long title**
   - Duration: 1ms

10. **POST /tasks - should reject missing title field**
   - Duration: 1ms

11. **POST /tasks - should reject non-string title**
   - Duration: 1ms

12. **POST /tasks - should persist created task to data file**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

13. **PUT /tasks/:id - should toggle task completion status**
   - Duration: 1ms

14. **PUT /tasks/:id - should toggle from completed to active**
   - Duration: 1ms

15. **PUT /tasks/:id - should return 404 when task does not exist**
   - Duration: 1ms

16. **PUT /tasks/:id - should reject non-boolean completed value**
   - Duration: 1ms

17. **PUT /tasks/:id - should reject very long title on update**
   - Duration: 0ms

18. **PUT /tasks/:id - should persist completion status change**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

19. **DELETE /tasks/:id - should delete an existing task**
   - Duration: 1ms

20. **DELETE /tasks/:id - should return 404 when task does not exist**
   - Duration: 0ms

21. **DELETE /tasks/:id - should persist deletion to data file**
   - Duration: 1ms
   - Suggestions:
     - 💾 Verify test data isolation is working

22. **GET /stats - should return task statistics**
   - Duration: 1ms

23. **GET /stats - should return zero counts when no tasks exist**
   - Duration: 0ms

24. **Integration - should handle complete task lifecycle**
   - Duration: 2ms


## Backend API Tests



## Frontend E2E Tests

### ❌ Failed Tests (6)

1. **should verify filter counts for All/Active/Completed**
   - Status: FAILED
   - Duration: 2826ms
   - Suggestions:
     - ❌ Test failed - review error details
     - 🔢 Verify filter counts match actual task states

2. **should delete a task**
   - Status: FAILED
   - Duration: 7787ms
   - Suggestions:
     - ❌ Test failed - review error details
     - ⏱️ Consider increasing timeout or checking for slow operations

3. **should toggle task completion**
   - Status: FAILED
   - Duration: 7846ms
   - Suggestions:
     - ❌ Test failed - review error details
     - ⏱️ Consider increasing timeout or checking for slow operations

4. **should filter tasks by Completed**
   - Status: FAILED
   - Duration: 6355ms
   - Suggestions:
     - ❌ Test failed - review error details
     - ⏱️ Consider increasing timeout or checking for slow operations
     - 🔢 Verify filter counts match actual task states

5. **should filter tasks by Active**
   - Status: FAILED
   - Duration: 9401ms
   - Suggestions:
     - ❌ Test failed - review error details
     - ⏱️ Consider increasing timeout or checking for slow operations
     - 🔢 Verify filter counts match actual task states

6. **should persist tasks after page refresh**
   - Status: FAILED
   - Duration: 13288ms
   - Suggestions:
     - ❌ Test failed - review error details
     - ⏱️ Consider increasing timeout or checking for slow operations
     - 💾 Verify backend persistence is working correctly

### ✅ Passed Tests (4)

1. **should add a task**
   - Duration: 1751ms

2. **should complete full workflow: add, toggle, delete, refresh**
   - Duration: 3985ms
   - Suggestions:
     - 💾 Verify backend persistence is working correctly

3. **should display system health banner**
   - Duration: 1140ms

4. **should update filter counts after operations**
   - Duration: 3519ms
   - Suggestions:
     - 🔢 Verify filter counts match actual task states


---

*Report generated automatically after test run*
