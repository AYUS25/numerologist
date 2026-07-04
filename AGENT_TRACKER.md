# Master Tracker (AGENT_TRACKER.md)

## Current Phase & Goal
**Phase 1: Security & Configuration**
- **Objective:** Move hardcoded credentials (specifically Firebase configuration from `firebase-applet-config.json`) into environment variables (`.env`). Introduce robust input validation on the backend API endpoints (e.g., using Zod) to prevent prompt injection and malformed requests.
- **Status:** Phase 1 Execution Completed 100% stable.

## Phase 1 Execution Loop Strategy
1. **Define Goal:** Safely migrate all secrets to `.env` without breaking Firebase, and secure the Express API endpoints against malicious inputs.
2. **Execute:** 
   - Update `.env.example` and instruct the user to update `.env` with Vite-prefixed variables (`VITE_FIREBASE_...`).
   - Refactor `src/firebase.ts` to consume `import.meta.env` instead of `firebase-applet-config.json`.
   - Install `zod` for schema validation.
   - Refactor `server.ts` to implement Zod validation on `/api/numerology/*` endpoints.
3. **Test & Verify:** 
   - Verify TypeScript compilation and Vite build succeed.
   - Verify Firebase Auth login/signup modal continues to function on the frontend.
   - Send invalid payloads to the API endpoints and ensure they return `400 Bad Request` safely.
4. **Debug (The Loop):** 
   - Resolve any missing import errors or environment variable loading issues.
   - Continue until the app achieves 100% stable execution for this specific feature set.
5. **Document & Halt:**
   - Update this tracker and await explicit approval before starting Phase 2.

## Completed Tasks
- [x] Initial Architectural Analysis completed.
- [x] AGENT_TRACKER.md created and Phase 1 planned.
- [x] Phase 1 Execution Completed: Moved secrets to `.env`, refactored `firebase.ts`, integrated Zod schema validation in `server.ts`, and successfully blocked malicious prompt injection test payloads.

## Current Architecture / Dependencies
- **Frontend SPA:** Vite + React 19 + Tailwind CSS v4.
- **Entry Points:** `index.html` -> `src/main.tsx` -> `src/App.tsx`.
- **Core State & Logic:** `App.tsx` handles global state and API queuing. `src/numerologyEngine.ts` handles synchronous calculations. `src/components/ReportView.tsx` manages main dashboard UI.
- **Backend API:** Express server (`server.ts`) proxying requests to Google Gemini via `@google/genai`.
- **Database / Auth:** Firebase initialized in `src/firebase.ts` (currently pulling from hardcoded `firebase-applet-config.json`).
- **Dependencies Risk:** Modifying `firebase.ts` impacts `dbHelper.ts` and `App.tsx` authentication flow. Modifying `server.ts` impacts `apiClient.ts` payload structure.

## Known Blockers/Bugs
- None at this time. Phase 1 completed successfully.
