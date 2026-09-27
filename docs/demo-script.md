# Interview Demo Script: Architect 2.0

## Setup
*Have the local dev server running (`npm run dev`). Start on `http://localhost:3000`.*

## 1. Introduction (The Dashboard)
"Welcome to Architect 2.0. The core product principle here is *'One workspace to go from idea to deployed code, for both beginners and experts.'* As you can see on the dashboard, we prioritize a clean, intent-driven onboarding. I'm going to ask it to build a marketing dashboard."
*(Type: "Build a marketing SaaS dashboard" and click Generate)*

## 2. The Non-Technical Flow (Chat & Preview)
"We immediately land in the workspace. Notice the split-pane design. On the left, the agent is actively planning and building. For a non-technical user, they don't need to see the code. They just wait for the loading state to finish, and their live preview appears on the right."
*(Wait for the mock preview to render)*

## 3. The Developer Flow (Code & Terminal)
"But Architect 2.0 is designed for developers too. If I'm a technical user and I want to tweak the infrastructure or debug an error, I don't have to leave the platform. I simply click the **Code** tab."
*(Click the Code tab)*
"I now have a full Monaco editor to modify the agent's work."
*(Click the Terminal tab)*
"And if a build fails, I can jump into the **Terminal** tab to see the actual Firecracker microVM logs, execute bash commands, and take control back from the agent."

## 4. Closing (Git & Architecture)
"Finally, when the code is ready, the **Git** tab allows me to review diffs and push directly to my repository. By wrapping complex orchestration inside a progressive UI, we solve the 'black box' problem of current vibe-coding platforms."