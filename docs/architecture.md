# Technical Architecture: Architect 2.0

## 1. Architecture Diagram
```mermaid
graph TD
    %% User & Frontend
    U[User] -->|HTTPS/WSS| F[Next.js Frontend]
    
    %% API & Orchestration
    F -->|REST / WSS| AG[API Gateway & Auth]
    AG --> AO[Agent Orchestrator]
    
    %% Model Gateway
    AO <--> MG[Model Gateway]
    MG <--> OAI[OpenAI GPT-4o]
    MG <--> ANT[Anthropic Claude 3.5]
    MG <--> OSS[DeepSeek Coder]
    
    %% Sandbox & Execution
    AO <-->|gRPC| SM[Sandbox Manager]
    SM -->|Spawns| SB[E2B / Firecracker Sandbox]
    
    %% Sandbox internals
    SB <-->|AST / Diffs| VFS[(Virtual File System)]
    SB <-->|Executes| LSP[Language Server / Terminal]
    
    %% Proxy & Preview
    SB -->|Exposes Port 3000| PX[Reverse Proxy]
    PX -->|*.preview.architect.run| F
    
    %% GitHub & Deployment
    AO <-->|OAuth / Webhooks| GH[GitHub API]
    AO <-->|Triggers| DP[Deployment Pipeline]
    DP -->|Containerizes| K8S[K8s Production Cluster]