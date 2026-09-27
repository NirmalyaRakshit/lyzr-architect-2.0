# UX Flows & Information Architecture: Architect 2.0

## Route Map
- `/` - Landing page / Mock Login
- `/dashboard` - Project management, recent projects, "Import GitHub" button
- `/workspace/[projectId]` - The core Agent IDE

## Core Flows

### 1. Authentication & Dashboard
- **Action:** User enters any email and clicks "Login" (Mocked).
- **Result:** Redirects to `/dashboard`.
- **Dashboard UI:** Displays a grid of "Recent Projects", a prominent "Create New Agentic App" input bar, and a secondary "Import from GitHub" button.

### 2. New Project (Prompt-to-App)
- **Action:** User types "Build a marketing dashboard" in the dashboard input and hits enter.
- **Result:** Redirects to `/workspace/new-123`.
- **UI State:** 
  - Chat panel (left) shows the initial prompt.
  - Agent immediately outputs: "Planning architecture...", then "Generating files...".
  - Main panel (right) defaults to the "Preview" tab, showing a loading state or a skeleton UI.

### 3. Progressive Disclosure (The Developer Transition)
- **Action:** User wants to see *how* the app was built.
- **Result:** User clicks the "Code" tab in the right panel.
- **UI State:** 
  - The Preview is hidden.
  - A two-pane view appears: File Explorer on the left, Monaco Editor on the right.
  - User can click a file (e.g., `page.tsx`) to view the AI-generated code.

### 4. Agent Execution & Error Recovery
- **Action:** AI encounters a missing dependency.
- **Result:** The agent activity stream in the left panel turns orange: "Error: module 'recharts' not found. Agent is attempting recovery..."
- **UI State:** The agent automatically runs `npm install recharts`, logs it in the background Terminal, and refreshes the Preview. Technical users can switch to the "Terminal" tab to verify the logs.

### 5. Deployment & GitHub
- **Action:** User clicks "Deploy" in the top header.
- **Result:** A modal appears confirming environment variables. 
- **Action:** User clicks "Confirm".
- **UI State:** Mock deployment pipeline UI shows (Build -> Upload -> Live). Returns a mock `https://project.architect.lyzr/` URL.