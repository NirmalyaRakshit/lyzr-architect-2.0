# Architect 2.0 | Lyzr AI Hiring Assignment

Architect 2.0 is a next-generation agentic application-building platform designed to bridge the gap between natural-language "vibe coding" and robust developer-grade control. 

## 🔗 Live Prototype
**[Click here to view the live Vercel deployment](https://lyzr-architect-2-0-mblc.vercel.app)**


## 🧠 Core Product Philosophy: Progressive Disclosure
Current platforms force a trade-off: they are either pure chat interfaces that hide the code (alienating developers) or complex cloud IDEs (alienating beginners). 

Architect 2.0 solves this via **Progressive Disclosure**:
1. **The Visionary Flow:** Non-technical users interact entirely with the chat interface and the live interactive UI preview.
2. **The Developer Flow:** Technical users can seamlessly open the **Code Editor**, **Terminal**, and **Git** tabs to take manual control of the infrastructure, debug agent failures, and manage branch merges without leaving the browser.

## 📂 Documentation Directory
Please review the `docs/` folder for the complete product and architecture rationale:
*   [Technical Architecture & Sandboxing Strategy](docs/architecture.md) (Diagram, E2B vs Firecracker, Scaling)
*   [Product Decisions & Trade-offs](docs/product-decisions.md)
*   [Competitive Analysis](docs/competitive-analysis.md)
*   [PRD & Feature Scope](docs/product-requirements.md)
*   [UX Flows & Journeys](docs/ux-flows.md)
*   [Interview Demo Script](docs/demo-script.md)

## 🛠️ Local Development
```bash
npm install
npm run dev