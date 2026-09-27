# Product Decision Log

## 1. UI Layout: Progressive Disclosure (Split-Pane)
**Context:** We needed a UI that serves both non-technical founders and deep technical developers.
**Options:** 
1. Separate "Simple" and "Advanced" modes.
2. A classic complex IDE layout.
3. A split-pane chat + tabbed workspace.
**Decision:** Selected Option 3.
**Rationale:** Non-technical users can stay in the Chat/Preview tabs and treat it like a pure "vibe coding" tool. Developers can seamlessly click into the Code and Terminal tabs to inspect the underlying infrastructure without leaving the flow.
**Trade-offs:** Managing state across the iframe preview and the Monaco editor requires strict synchronization logic on the frontend.

## 2. Prototype Execution: High-Fidelity Mock vs. Real Sandbox
**Context:** The TPM assignment required demonstrating the workflow and architecture.
**Decision:** Built a high-fidelity frontend prototype with deterministic state delays simulating the backend, rather than wiring up a fragile Docker/E2B backend for the demo.
**Rationale:** Prioritized delivering a flawless, polished user experience that clearly communicates the product vision over a brittle, partially-functional backend integration. The architecture document covers the production backend design.

## 3. Sandboxing: Firecracker over Docker
**Context:** Choosing the technology to run generated code safely.
**Decision:** Specified Firecracker microVMs in the architecture.
**Rationale:** AI-generated code is inherently untrusted. Firecracker provides hardware-level virtualization with sub-second startup times, balancing strict security with the instant feedback loop required for chat-to-code interfaces.