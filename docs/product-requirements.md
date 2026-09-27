# Product Requirements Document (PRD): Architect 2.0

## Product Vision
"One workspace where anyone can go from idea → AI-generated application → code → agent execution → preview → GitHub → deployment."

## Target Personas
1. **The Visionary (Non-Technical):** Founders, PMs, and business users who want to build functional agentic applications through natural language without touching code.
2. **The Architect (Technical):** Developers and Solutions Architects who want to inspect the generated code, tweak the infrastructure, manage secrets, and control GitHub syncs.

## Jobs-to-be-Done (JTBD)
* *When I* have a business idea, *I want to* describe it in plain English, *so that* the AI builds a working prototype immediately.
* *When* the AI generates buggy code, *I want to* open a terminal and code editor in the same window, *so that* I can debug it manually without leaving the platform.
* *When* my app is ready, *I want to* sync it to my GitHub and deploy it to a live URL with one click.

## Core User Journeys
1. **Prompt-to-App:** Login → New Project → Enter Prompt → Agent plans & builds → Live Preview generated.
2. **Developer Handoff:** View Preview → Open "Code" Tab → Edit file in Monaco → See live hot-reload → Open Terminal → Run custom command.
3. **Version Control:** Open "Git" Tab → Review Diffs → Commit → Push to GitHub.

## MVP Scope (For Hiring Assignment)
* **Auth:** Mocked demo user login.
* **Dashboard:** List of recent/imported projects.
* **Project Workspace (Split-Pane UI):**
  * Left Panel: Agent Chat & Activity Stream.
  * Right Panel Tabs: Live Preview (iframe mock), Code (Monaco Editor), Terminal (Mock logs), Git (Mock diffs), Settings (Env vars/Model selection).
* **Interactions:** Scripted deterministic chat flow simulating a complex app build and error recovery.

## Future Scope (Post-MVP)
* Real Firecracker/Kubernetes sandboxes per user.
* Live collaborative multiplayer editing.
* Real-time GitHub bidirectional syncing.