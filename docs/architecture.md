# Technical Architecture: Architect 2.0

## Architecture Overview
Architect 2.0 relies on a decoupled architecture separating the Next.js frontend, a scalable API Gateway, the Agent Orchestrator, and isolated Sandbox environments. 

### 1. Model Agnostic Layer (Model Gateway)
To prevent vendor lock-in and allow users to switch models mid-project, all LLM requests pass through a Model Gateway.
- **Function:** Normalizes inputs/outputs to a standard schema (e.g., standardizing tool-calling across OpenAI, Anthropic, and open-source models).
- **Routing:** Routes complex reasoning tasks to Claude 3.5 Sonnet / GPT-4o, and simple autocomplete/linting tasks to faster, smaller models (e.g., Llama 3 or Gemini Flash).

### 2. Agent Harness & Lifecycle
The Agent Orchestrator manages the execution loop:
- **Understand & Plan:** Parses user prompt, retrieves project context via RAG, and generates a JSON-structured plan.
- **Execution Loop:** 
  1. Agent writes code or executes a bash command.
  2. Action is sent to the Sandbox.
  3. Sandbox returns terminal output, linting errors, or test results.
  4. Agent parses the output. If an error occurs, it autonomously initiates a recovery loop (up to a defined retry limit).
- **Checkpoints:** State is committed to a hidden local Git tree after every successful loop, allowing users to roll back if the agent hallucinates.

### 3. Sandboxes (Firecracker microVMs)
For executing untrusted AI-generated code, Docker containers share the host kernel and are insufficiently secure. 
- **Technology:** We utilize **Firecracker microVMs** (similar to AWS Lambda/Fly.io) for multi-tenant isolation.
- **Lifecycle:** 
  - Cold starts take <200ms.
  - Each workspace gets an ephemeral microVM pre-loaded with Node/Python environments.
  - The VM streams logs back to the frontend via WebSockets for the Terminal UI.

### 4. Proxy & Live Preview
- **Port Mapping:** The Sandbox runs the app on a local port (e.g., 3000). 
- **Reverse Proxy:** A proxy layer maps `https://[workspace-id].preview.architect.lyzr` to the specific Firecracker VM's internal IP/port, allowing the iframe on the frontend to render the live app securely.

### 5. GitHub Integration & Sync
- **OAuth:** User authenticates via GitHub App.
- **Conflict Handling:** The platform maintains a two-way sync. If a user pushes to GitHub externally, a webhook triggers a pull into the Sandbox. If the agent modifies files, changes are staged, presented in the "Git" tab as diffs, and committed via the GitHub REST API upon user approval.

### 6. Scaling Strategy
- **Stateless Services:** The Agent Orchestrator and API Gateway run on scalable Kubernetes clusters.
- **Queues:** Heavy agent tasks are pushed to a Redis/Celery queue to manage rate limits from LLM providers.
- **Observability:** Datadog traces track the agent's success/failure rates to continuously improve the underlying system prompt.