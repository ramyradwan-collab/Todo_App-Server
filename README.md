# Todo App

A full-stack todo application with React frontend and Express backend, featuring comprehensive testing, real-time monitoring, and CI/CD integration.

## Features

### Frontend
- ✅ Add new tasks with validation
- ✅ Toggle task completion
- ✅ Delete tasks
- ✅ Filter tasks (All / Active / Completed) with live counts
- ✅ Persistent storage via REST API
- ✅ Clean, centered card UI with animated gradient background (deep orange & black theme)
- ✅ Custom styled checkboxes (red when unchecked, green with checkmark when checked)
- ✅ System health banner (driven by `/health` endpoint)
- ✅ Responsive design
- ✅ Error handling with friendly messages

### Backend
- ✅ RESTful API with Express
- ✅ JSON file persistence
- ✅ Request logging and monitoring
- ✅ Real-time logs dashboard at `http://localhost:3000/`
- ✅ Test results display on server page
- ✅ Input validation (empty titles, max length 500 chars)
- ✅ Clear 4xx error messages with error codes
- ✅ CORS enabled for frontend communication

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: React hooks (useState, useEffect, useMemo)
- **Testing**: Playwright (E2E tests)
- **Styling**: CSS with custom properties and animations

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express
- **Testing**: Vitest + Supertest (API tests)
- **Storage**: JSON file-based persistence
- **Development**: Nodemon for auto-reload

## Project Structure

```
frontend-cursor-test2/
├── backend/
│   ├── src/
│   │   ├── server.ts              # Express server with all endpoints
│   │   ├── types/
│   │   │   └── Task.ts            # Task type definitions
│   │   └── utils/
│   │       ├── storage.ts          # JSON file persistence
│   │       ├── logger.ts           # Logging utilities
│   │       └── qaReportReader.ts   # QA report parser
│   ├── tests/
│   │   ├── api/
│   │   │   └── tasks.test.ts       # API test suite
│   │   ├── helpers/
│   │   │   ├── testServer.ts       # Test server helper
│   │   │   └── testData.ts         # Test data utilities
│   │   ├── reporters/
│   │   │   ├── qaReporter.ts       # QA report generator
│   │   │   └── vitestQAReporter.ts # Vitest reporter
│   │   └── setup.ts                # Test setup
│   ├── data/
│   │   ├── tasks.json              # Production data
│   │   └── tasks.test.json         # Test data (gitignored)
│   ├── package.json
│   ├── vitest.config.ts
│   └── tsconfig.json
├── src/
│   ├── components/
│   │   ├── TaskInput.tsx          # Input form for adding tasks
│   │   ├── TaskItem.tsx            # Individual task item
│   │   ├── FilterButtons.tsx      # Filter buttons with counts
│   │   └── HealthBanner.tsx       # System health indicator
│   ├── types/
│   │   └── Task.ts                # Task type definitions
│   ├── utils/
│   │   └── api.ts                 # API client functions
│   ├── App.tsx                    # Main app component
│   ├── App.css                    # Component styles
│   ├── main.tsx                   # App entry point
│   └── index.css                  # Global styles
├── tests/
│   ├── e2e/
│   │   └── todo.spec.ts           # Playwright E2E tests
│   ├── fixtures/
│   │   ├── backend.ts             # Backend test fixtures
│   │   └── testData.ts            # Test data fixtures
│   └── helpers/
│       └── pageHelpers.ts          # E2E test helpers
├── .github/
│   └── workflows/
│       └── test.yml               # CI/CD workflow
├── QA_REPORT.md                   # Auto-generated test report
├── package.json
├── playwright.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Git

### Installation

1. **Clone the repository** (if applicable)
   ```bash
   git clone <repository-url>
   cd frontend-cursor-test2
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Install Playwright browsers** (for E2E tests)
   ```bash
   npx playwright install chromium
   ```

### Running the Application

#### Development Mode

**Start the backend server:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3000`

**Start the frontend (in a new terminal):**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

#### Viewing Server Logs and Test Results

Visit `http://localhost:3000/` to see:
- **Left panel**: Real-time server logs
- **Right panel**: Unit test results organized by section/feature
- Auto-refreshes every 2 seconds

## API Endpoints

### Health & Monitoring

- `GET /health` - Returns `{ ok: true }`
- `GET /stats` - Returns task statistics: `{ total, active, completed }`
- `GET /logs` - Returns all server logs
- `GET /test-results` - Returns parsed test results from QA report
- `DELETE /logs` - Clears all logs

### Tasks

- `GET /tasks` - Get all tasks (sorted newest first)
- `POST /tasks` - Create a new task
  - Body: `{ title: string }`
  - Validation: Title required, max 500 chars, cannot be empty
  - Returns: Created task object
- `PUT /tasks/:id` - Update a task
  - Body: `{ title?: string, completed?: boolean }`
  - Validation: Title max 500 chars if provided
  - Returns: Updated task object
- `DELETE /tasks/:id` - Delete a task
  - Returns: 204 No Content

### Error Responses

All endpoints return clear 4xx error messages with error codes:
- `400 Bad Request`: Invalid input (with error codes like `EMPTY_TITLE`, `TITLE_TOO_LONG`, `INVALID_TITLE_TYPE`)
- `404 Not Found`: Task ID doesn't exist
- `500 Internal Server Error`: Server errors

## Testing

### Running Tests

**Run all tests:**
```bash
npm test
```

**Run backend tests only:**
```bash
npm run test:backend
```

**Run frontend E2E tests:**
```bash
npm run test:ui          # Headless mode
npm run test:ui:headed   # With browser visible
```

### Test Coverage

#### Backend API Tests (Vitest + Supertest)
- ✅ GET /health
- ✅ GET /tasks (empty, sorted, fields validation)
- ✅ POST /tasks (create, validation: empty, whitespace, long titles, missing field, type validation)
- ✅ PUT /tasks/:id (toggle completion, validation, persistence)
- ✅ DELETE /tasks/:id (delete, 404 handling, persistence)
- ✅ GET /stats (counts by status)
- ✅ Integration: Full workflow

#### Frontend E2E Tests (Playwright)
- ✅ Display app
- ✅ Add task
- ✅ Toggle completion
- ✅ Delete task
- ✅ Persistence after refresh
- ✅ Filter by Active/Completed
- ✅ Filter counts verification
- ✅ System health banner
- ✅ Full workflow (add → toggle → delete → refresh)

### Test Data Isolation

- Backend tests use `tasks.test.json` (separate from dev data)
- Tests automatically reset data before/after each test
- Frontend E2E tests reset backend data via fixtures

### QA Report

After running tests, `QA_REPORT.md` is automatically generated with:
- Test summary (total, passed, failed, skipped, pass rate)
- Individual test results with suggestions
- Organized by Backend API Tests and Frontend E2E Tests sections

## Development

### Code Style

- 2 spaces indentation for TypeScript/JavaScript
- Meaningful variable and function names
- Small, focused components
- TypeScript for type safety
- Functional components with hooks

### Data Persistence

- **Development**: Tasks stored in `backend/data/tasks.json`
- **Testing**: Tasks stored in `backend/data/tasks.test.json`
- Data persists across server restarts
- Test data is automatically cleaned up

### Environment Variables

- `NODE_ENV=test` - Enables test mode (uses test data file)
- `PORT` - Backend server port (default: 3000)

## CI/CD

### GitHub Actions

The project includes a GitHub Actions workflow (`.github/workflows/test.yml`) that:

- **Triggers**: On push/PR to main/master/develop branches
- **Backend Tests**: Runs Vitest + Supertest API tests
- **Frontend Tests**: Runs Playwright E2E tests
- **Artifacts**: Uploads Playwright traces on test failure
- **Status**: Shows test results in PR checks

## Monitoring & Debugging

### Server Dashboard

Visit `http://localhost:3000/` to access:
- **Real-time logs**: All API requests and operations
- **Test results**: Latest test run results organized by section
- **Auto-refresh**: Updates every 2 seconds

### Health Monitoring

- Frontend displays system health banner (green = OK, red = ERROR)
- Banner polls `/health` endpoint every 5 seconds
- Backend logs all operations with timestamps

## Error Handling

### Frontend
- Friendly error messages when API is down
- Retry button for failed operations
- Loading states during API calls

### Backend
- Clear 4xx error messages with error codes
- Detailed error logging
- Validation for all inputs

## Validation Rules

- **Title**: Required, string type, trimmed, 1-500 characters
- **Completed**: Boolean type (when updating)
- **Error Codes**: `EMPTY_TITLE`, `TITLE_TOO_LONG`, `INVALID_TITLE_TYPE`

## Contributing

1. Follow the code style guidelines
2. Write tests for new features
3. Ensure all tests pass before submitting
4. Update QA_REPORT.md will be auto-generated

## License

ISC
