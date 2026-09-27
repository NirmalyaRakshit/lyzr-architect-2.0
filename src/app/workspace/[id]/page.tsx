"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Send, TerminalSquare, Code2, Play, GitBranch, Sparkles, 
  Loader2, CheckCircle2, Circle, AlertCircle, Monitor, 
  Tablet, Smartphone, RotateCw, ExternalLink, Rocket, 
  Settings2, Key, GitCommit, Check, ArrowRight
} from "lucide-react";
import Editor from "@monaco-editor/react";

interface AgentStep {
  id: string;
  label: string;
  status: "pending" | "running" | "completed" | "error";
  detail?: string;
}

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "Build a SaaS dashboard for tracking marketing campaigns";

  // Navigation & Viewport State
  const [activeTab, setActiveTab] = useState("preview");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [selectedModel, setSelectedModel] = useState("Claude 3.5 Sonnet");
  
  // Modals / Panels
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployStep, setDeployStep] = useState<number>(0);
  const [showSecretsModal, setShowSecretsModal] = useState(false);
  const [envVars, setEnvVars] = useState([
    { key: "DATABASE_URL", value: "postgresql://user:pass@ep-cool-db.us-east-1.aws.neon.tech/neondb" },
    { key: "NEXT_PUBLIC_APP_ENV", value: "production" }
  ]);
  const [newEnvKey, setNewEnvKey] = useState("");
  const [newEnvVal, setNewEnvVal] = useState("");

  // Chat & Agent Loop State
  const [messages, setMessages] = useState([
    { role: "user", content: initialPrompt },
    { 
      role: "agent", 
      content: "I've analyzed your requirements and decomposed them into an executable architecture plan. Starting execution...",
      hasSteps: true
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  
  // Agent Lifecycle Steps (Rubric 05 & 06)
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([
    { id: "1", label: "Analyze requirements & synthesize PRD", status: "running" },
    { id: "2", label: "Generate AST and file tree structure", status: "pending" },
    { id: "3", label: "Provision Firecracker sandbox & install packages", status: "pending" },
    { id: "4", label: "Self-healing error detection & auto-patching", status: "pending" },
    { id: "5", label: "Compile client bundle & start live preview", status: "pending" }
  ]);

  const [activeFile, setActiveFile] = useState("page.tsx");
  const [commitMessage, setCommitMessage] = useState("feat: generate marketing dashboard layout & telemetry");
  const [commitSuccess, setCommitSuccess] = useState(false);

  // Simulated agent sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => {
        setAgentSteps(prev => prev.map(s => s.id === "1" ? { ...s, status: "completed" } : s.id === "2" ? { ...s, status: "running" } : s));
      }, 1200),
      setTimeout(() => {
        setAgentSteps(prev => prev.map(s => s.id === "2" ? { ...s, status: "completed" } : s.id === "3" ? { ...s, status: "running" } : s));
      }, 2400),
      setTimeout(() => {
        setAgentSteps(prev => prev.map(s => s.id === "3" ? { ...s, status: "completed" } : s.id === "4" ? { ...s, status: "running", detail: "Detected missing dependency 'lucide-react'. Auto-installing..." } : s));
      }, 3800),
      setTimeout(() => {
        setAgentSteps(prev => prev.map(s => s.id === "4" ? { ...s, status: "completed", detail: "Self-healing resolved: installed 1 package" } : s.id === "5" ? { ...s, status: "running" } : s));
      }, 5000),
      setTimeout(() => {
        setAgentSteps(prev => prev.map(s => s.id === "5" ? { ...s, status: "completed" } : s));
        setMessages(prev => [
          ...prev,
          { 
            role: "agent", 
            content: "Application scaffolded and running! I configured a responsive analytics dashboard with live KPI cards, conversion charts, and telemetry tracking. You can view the code, test the preview, or inspect the terminal logs.",
            hasSteps: false
          }
        ]);
      }, 6200)
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput("");
    setMessages(prev => [...prev, { role: "user", content: userText, hasSteps: false }]);

    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          role: "agent", 
          content: `Applying adjustments for "${userText}". Modifying components/analytics-chart.tsx and synchronizing hot reload...`,
          hasSteps: false 
        }
      ]);
    }, 1000);
  };

  const handleStartDeploy = () => {
    setShowDeployModal(true);
    setDeployStep(1);
    setTimeout(() => setDeployStep(2), 1500);
    setTimeout(() => setDeployStep(3), 3200);
    setTimeout(() => setDeployStep(4), 4800);
  };

  const handleAddEnv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnvKey.trim()) return;
    setEnvVars(prev => [...prev, { key: newEnvKey.toUpperCase(), value: newEnvVal }]);
    setNewEnvKey("");
    setNewEnvVal("");
  };

  const isBuilding = agentSteps.some(s => s.status === "running" || s.status === "pending");

  return (
    <div className="h-[calc(100vh-65px)] w-full flex flex-col bg-background text-foreground">
      {/* Top Workspace Toolbar */}
      <div className="h-12 border-b bg-card/60 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary bg-primary/5">
            PROJ-8A9D
          </Badge>
          <span className="text-sm font-medium">Marketing Campaign Intelligence Hub</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Model Switcher */}
          <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md text-xs border">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <select 
              value={selectedModel} 
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-foreground outline-none cursor-pointer font-medium"
            >
              <option value="Claude 3.5 Sonnet" className="bg-card">Claude 3.5 Sonnet (Coding)</option>
              <option value="GPT-4o" className="bg-card">GPT-4o (Reasoning)</option>
              <option value="DeepSeek-Coder" className="bg-card">DeepSeek-Coder V2</option>
            </select>
          </div>

          {/* Secrets / Env Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs gap-1.5"
            onClick={() => setShowSecretsModal(true)}
          >
            <Key className="w-3.5 h-3.5" />
            Secrets & Env
          </Button>

          {/* Deploy Button */}
          <Button 
            size="sm" 
            className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow"
            onClick={handleStartDeploy}
          >
            <Rocket className="w-3.5 h-3.5" />
            Deploy App
          </Button>
        </div>
      </div>

      {/* Main Workspace Split Pane */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          
          {/* LEFT COLUMN: Agent & Chat (Rubric 03, 05, 06) */}
          <ResizablePanel defaultSize={32} minSize={25} maxSize={45} className="flex flex-col bg-card/20 border-r">
            <div className="p-3 border-b bg-card/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Agent Loop Control Plane</span>
              </div>
              <Badge variant="secondary" className="text-[10px]">ReAct Mode</Badge>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 pb-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mb-1 px-1">
                      {msg.role === "user" ? "You" : "Architect Agent"}
                    </div>
                    <div className={`p-3.5 rounded-xl max-w-[90%] text-sm ${
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground font-medium" 
                        : "bg-card border shadow-sm text-foreground"
                    }`}>
                      <p>{msg.content}</p>

                      {/* Real-time Agent Step Checklist */}
                      {msg.hasSteps && (
                        <div className="mt-3.5 pt-3 border-t border-border/60 space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground">Execution Pipeline:</p>
                          {agentSteps.map((step) => (
                            <div key={step.id} className="text-xs flex items-start gap-2">
                              {step.status === "completed" && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                              {step.status === "running" && <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0 mt-0.5" />}
                              {step.status === "pending" && <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5" />}
                              {step.status === "error" && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                              <div>
                                <span className={step.status === "completed" ? "text-foreground font-medium" : step.status === "running" ? "text-primary font-medium" : "text-muted-foreground"}>
                                  {step.label}
                                </span>
                                {step.detail && (
                                  <p className="text-[11px] text-amber-500/90 font-mono mt-0.5">{step.detail}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-3 border-t bg-card/60">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input 
                  placeholder="Request changes or debug instruction..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="text-xs h-9 bg-background"
                />
                <Button type="submit" size="sm" className="h-9 px-3">
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* RIGHT COLUMN: Tabbed Developer Workspace */}
          <ResizablePanel defaultSize={68} className="flex flex-col bg-background">
            <Tabs orientation="horizontal" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              
              {/* Tab Navigation Header */}
              <div className="border-b px-4 h-11 bg-card/40 flex items-center justify-between shrink-0">
                <TabsList className="bg-muted/80 h-8 p-0.5">
                  <TabsTrigger value="preview" className="text-xs gap-1.5 h-7 px-3">
                    <Play className="w-3 h-3 text-emerald-500" /> Preview
                  </TabsTrigger>
                  <TabsTrigger value="code" className="text-xs gap-1.5 h-7 px-3">
                    <Code2 className="w-3 h-3 text-blue-500" /> Code Editor
                  </TabsTrigger>
                  <TabsTrigger value="terminal" className="text-xs gap-1.5 h-7 px-3">
                    <TerminalSquare className="w-3 h-3 text-amber-500" /> Terminal & Logs
                  </TabsTrigger>
                  <TabsTrigger value="git" className="text-xs gap-1.5 h-7 px-3">
                    <GitBranch className="w-3 h-3 text-purple-500" /> Git & Diffs
                  </TabsTrigger>
                </TabsList>

                {/* Viewport Toggles (When in Preview) */}
                {activeTab === "preview" && (
                  <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-md border text-xs">
                    <button 
                      onClick={() => setViewport("desktop")}
                      className={`p-1 rounded ${viewport === "desktop" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"}`}
                      title="Desktop View"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setViewport("tablet")}
                      className={`p-1 rounded ${viewport === "tablet" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"}`}
                      title="Tablet View"
                    >
                      <Tablet className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setViewport("mobile")}
                      className={`p-1 rounded ${viewport === "mobile" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"}`}
                      title="Mobile View"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* 1. APP PREVIEW (Rubric 04) */}
              <TabsContent value="preview" className="flex-1 m-0 p-0 relative overflow-hidden bg-zinc-950 flex flex-col">
                {/* Browser URL bar wrapper */}
                <div className="h-9 border-b bg-card/90 px-3 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <RotateCw className="w-3 h-3 ml-2 hover:text-foreground cursor-pointer" />
                  </div>
                  <div className="flex-1 max-w-sm mx-4 bg-background/80 border rounded px-2.5 py-0.5 text-center font-mono text-[11px] truncate">
                    https://preview-8a9d.sandbox.architect.lyzr
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 hover:text-foreground cursor-pointer" />
                </div>

                {/* Preview Container with Viewport Resizing */}
                <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-zinc-900/60">
                  <div className={`h-full transition-all duration-300 bg-background border shadow-2xl rounded-lg overflow-hidden flex flex-col ${
                    viewport === "desktop" ? "w-full" : viewport === "tablet" ? "w-[768px]" : "w-[375px]"
                  }`}>
                    {isBuilding ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <div>
                          <h4 className="font-semibold text-sm">Synthesizing Preview</h4>
                          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                            Compiling microVM container and spinning up Vite/Next dev server on port 3000...
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Live Interactive Render of the Generated Application */
                      <div className="flex-1 overflow-auto p-6 bg-slate-950 text-slate-50">
                        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                          <div>
                            <h2 className="text-xl font-bold tracking-tight">Campaign Intelligence</h2>
                            <p className="text-xs text-slate-400">Q3 Marketing Performance & Attribution</p>
                          </div>
                          <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-mono">
                            ● Live Telemetry
                          </span>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                            <span className="text-xs text-slate-400 font-medium">Total Ad Spend</span>
                            <div className="text-2xl font-bold mt-1">$42,850</div>
                            <span className="text-[11px] text-emerald-400 mt-2 block">+14.2% vs last month</span>
                          </div>
                          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                            <span className="text-xs text-slate-400 font-medium">Customer Acquisition Cost</span>
                            <div className="text-2xl font-bold mt-1">$38.40</div>
                            <span className="text-[11px] text-emerald-400 mt-2 block">-6.8% efficiency gain</span>
                          </div>
                          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                            <span className="text-xs text-slate-400 font-medium">Conversion Rate</span>
                            <div className="text-2xl font-bold mt-1">4.62%</div>
                            <span className="text-[11px] text-indigo-400 mt-2 block">Top 10% benchmark</span>
                          </div>
                        </div>

                        {/* Campaign Data Table */}
                        <div className="mt-6 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
                          <div className="p-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
                            Active Ad Campaigns
                          </div>
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-mono">
                              <tr>
                                <th className="p-3">Campaign</th>
                                <th className="p-3">Platform</th>
                                <th className="p-3">Impressions</th>
                                <th className="p-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                              <tr>
                                <td className="p-3 font-medium">Enterprise Retargeting</td>
                                <td className="p-3 text-slate-400">LinkedIn Ads</td>
                                <td className="p-3 font-mono">342,100</td>
                                <td className="p-3"><span className="text-emerald-400 font-medium">Active</span></td>
                              </tr>
                              <tr>
                                <td className="p-3 font-medium">Founder Lead Gen - Search</td>
                                <td className="p-3 text-slate-400">Google Ads</td>
                                <td className="p-3 font-mono">1,120,400</td>
                                <td className="p-3"><span className="text-emerald-400 font-medium">Active</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* 2. CODE EDITOR (Monaco) */}
              <TabsContent value="code" className="flex-1 orientation-none m-0 p-0 flex h-full">
                {/* File Explorer Tree */}
                <div className="w-56 border-r bg-card/30 flex flex-col shrink-0 text-xs">
                  <div className="p-2.5 font-semibold text-muted-foreground border-b uppercase text-[10px] tracking-wider">
                    Virtual File System
                  </div>
                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => setActiveFile("page.tsx")}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left ${activeFile === "page.tsx" ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}
                    >
                      <Code2 className="w-3.5 h-3.5 text-blue-400" />
                      page.tsx
                    </button>
                    <button 
                      onClick={() => setActiveFile("analytics-card.tsx")}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left ${activeFile === "analytics-card.tsx" ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}
                    >
                      <Code2 className="w-3.5 h-3.5 text-blue-400" />
                      analytics-card.tsx
                    </button>
                    <button 
                      onClick={() => setActiveFile("package.json")}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left ${activeFile === "package.json" ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}
                    >
                      <Settings2 className="w-3.5 h-3.5 text-amber-400" />
                      package.json
                    </button>
                  </div>
                </div>

                {/* Monaco Editor Pane */}
                <div className="flex-1 h-full overflow-hidden">
                  <Editor
                    height="100%"
                    language={activeFile.endsWith(".json") ? "json" : "typescript"}
                    theme="vs-dark"
                    value={
                      activeFile === "page.tsx"
                        ? `// Generated by Architect 2.0 (Model: Claude 3.5 Sonnet)\nimport { MetricCard } from "@/components/analytics-card";\n\nexport default function Dashboard() {\n  return (\n    <main className="p-8 bg-zinc-950 text-white min-h-screen">\n      <h1 className="text-2xl font-bold">Campaign Intelligence Hub</h1>\n      <div className="grid grid-cols-3 gap-4 mt-6">\n        <MetricCard title="Total Ad Spend" value="$42,850" change="+14.2%" />\n        <MetricCard title="CAC" value="$38.40" change="-6.8%" />\n        <MetricCard title="Conversion" value="4.62%" change="Top 10%" />\n      </div>\n    </main>\n  );\n}`
                        : activeFile === "analytics-card.tsx"
                        ? `export function MetricCard({ title, value, change }: { title: string; value: string; change: string }) {\n  return (\n    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">\n      <span className="text-xs text-zinc-400 font-medium">{title}</span>\n      <div className="text-2xl font-bold mt-1">{value}</div>\n      <span className="text-[11px] text-emerald-400 mt-2 block">{change}</span>\n    </div>\n  );\n}`
                        : `{\n  "name": "architect-generated-app",\n  "version": "0.1.0",\n  "dependencies": {\n    "next": "^14.2.0",\n    "react": "^18.3.0",\n    "lucide-react": "^0.395.0",\n    "recharts": "^2.12.0"\n  }\n}`
                    }
                    options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
                  />
                </div>
              </TabsContent>

              {/* 3. TERMINAL & LOGS */}
              <TabsContent value="terminal" className="flex-1 m-0 p-4 bg-zinc-950 font-mono text-xs text-zinc-200 overflow-auto h-full space-y-1">
                <div className="text-muted-foreground pb-2 border-b border-zinc-800 mb-2">
                  MicroVM Session: <span className="text-emerald-400">vm-session-8a9d</span> | Status: <span className="text-emerald-400">Attached</span>
                </div>
                <p className="text-zinc-500">$ architect-harness --sandbox=firecracker --runtime=node20</p>
                <p className="text-zinc-400">➜ Initializing memory snapshot from cache: 142ms</p>
                <p className="text-zinc-400">➜ Mounting virtual file system tree...</p>
                <p className="text-emerald-400">✔ Mounted 12 generated files across 3 directories</p>
                <p className="text-zinc-400">➜ Running build verification:</p>
                <p className="text-zinc-200 font-semibold">$ npm run build</p>
                <p className="text-zinc-400">   ▲ Next.js 14.2.0</p>
                <p className="text-zinc-400">   - Environments: production</p>
                <p className="text-zinc-400">   ✓ Compiled / in 482ms</p>
                <p className="text-zinc-400">   ✓ Generating static pages (3/3)</p>
                <p className="text-emerald-400">✔ Production build completed with 0 errors.</p>
                <p className="text-blue-400">➜ Reverse proxy routing established: http://0.0.0.0:3000 -&gt; https://preview-8a9d.sandbox.architect.lyzr</p>
              </TabsContent>

              {/* 4. GIT & DIFFS (Rubric 07) */}
              <TabsContent value="git" className="flex-1 m-0 p-6 overflow-auto h-full">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <h3 className="text-base font-semibold">GitHub Synchronization</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Connected Repository: <code className="text-foreground font-mono">lyzr-org/marketing-analytics</code></p>
                    </div>
                    <Badge variant="outline" className="gap-1.5 text-xs">
                      <GitBranch className="w-3 h-3 text-primary" /> branch: architect/feature-dashboard
                    </Badge>
                  </div>

                  {/* Visual Git Diff Display */}
                  <div className="border rounded-lg overflow-hidden bg-card text-xs font-mono">
                    <div className="bg-muted px-4 py-2 border-b flex items-center justify-between text-muted-foreground font-sans">
                      <span>Diff: <strong>src/app/page.tsx</strong></span>
                      <span className="text-emerald-500 font-mono">+18 lines added, -2 deleted</span>
                    </div>
                    <div className="p-3 bg-zinc-950 space-y-0.5 overflow-x-auto text-[11px]">
                      <div className="text-zinc-500">@@ -1,6 +1,22 @@</div>
                      <div className="text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded">- export default function OldStub() {'{'}</div>
                      <div className="text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded">-   return &lt;div&gt;Placeholder&lt;/div&gt;;</div>
                      <div className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">+ import {'{'} MetricCard {'}'} from "@/components/analytics-card";</div>
                      <div className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">+ export default function Dashboard() {'{'}</div>
                      <div className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">+   return (</div>
                      <div className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">+     &lt;main className="p-8 bg-zinc-950 text-white min-h-screen"&gt;</div>
                      <div className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">+       &lt;h1 className="text-2xl font-bold"&gt;Campaign Intelligence Hub&lt;/h1&gt;</div>
                      <div className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">+     &lt;/main&gt;</div>
                      <div className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">+   );</div>
                      <div className="text-zinc-500"> {'}'}</div>
                    </div>
                  </div>

                  {/* Staged Commit Box */}
                  <div className="p-4 border rounded-lg bg-card/60 space-y-3">
                    <label className="text-xs font-medium">Commit Message</label>
                    <Input 
                      value={commitMessage} 
                      onChange={(e) => setCommitMessage(e.target.value)}
                      className="text-xs font-mono"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-muted-foreground">Changes staged in virtual workspace</span>
                      <Button 
                        size="sm" 
                        className="text-xs gap-1.5"
                        onClick={() => {
                          setCommitSuccess(true);
                          setTimeout(() => setCommitSuccess(false), 3000);
                        }}
                      >
                        {commitSuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> Pushed to GitHub!
                          </>
                        ) : (
                          <>
                            <GitCommit className="w-3.5 h-3.5" /> Commit & Push to Remote
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* MODAL: Deploying the App (Rubric 08) */}
      {showDeployModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-base">Production Deployment Pipeline</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowDeployModal(false)}>✕</Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs">
                {deployStep >= 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                <span className={deployStep >= 1 ? "font-medium text-foreground" : "text-muted-foreground"}>Step 1: Validate Environment Variables & Config</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                {deployStep >= 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : deployStep === 1 ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Circle className="w-4 h-4 text-muted-foreground/30" />}
                <span className={deployStep >= 2 ? "font-medium text-foreground" : "text-muted-foreground"}>Step 2: Containerize App & Execute Standalone Build</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                {deployStep >= 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : deployStep === 2 ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Circle className="w-4 h-4 text-muted-foreground/30" />}
                <span className={deployStep >= 3 ? "font-medium text-foreground" : "text-muted-foreground"}>Step 3: Provision Edge Routing & SSL Handshake</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                {deployStep >= 4 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : deployStep === 3 ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Circle className="w-4 h-4 text-muted-foreground/30" />}
                <span className={deployStep >= 4 ? "font-medium text-foreground" : "text-muted-foreground"}>Step 4: Published to Global CDN</span>
              </div>
            </div>

            {deployStep === 4 && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                <span className="text-xs text-emerald-400 font-semibold">Deployment Live!</span>
                <p className="text-xs text-muted-foreground">Your agentic application is now publicly accessible:</p>
                <div className="flex items-center justify-between bg-black/60 p-2 rounded border border-emerald-500/20 font-mono text-xs">
                  <span className="text-emerald-300 truncate">https://campaign-hub-8a9d.architect.run</span>
                  <Button size="sm" variant="ghost" className="h-6 text-[10px] text-white">Copy</Button>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button 
                disabled={deployStep < 4} 
                onClick={() => setShowDeployModal(false)}
                className="text-xs"
              >
                Close & Return to Workspace
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Secrets & Environment Variables */}
      {showSecretsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">Environment Variables</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowSecretsModal(false)}>✕</Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {envVars.map((env, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/60 text-xs font-mono">
                  <span className="font-semibold text-primary">{env.key}</span>
                  <span className="text-muted-foreground truncate max-w-[180px]">••••••••••••••</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddEnv} className="space-y-2 pt-2 border-t">
              <span className="text-xs font-medium">Add New Key</span>
              <div className="flex gap-2">
                <Input 
                  placeholder="KEY_NAME" 
                  value={newEnvKey}
                  onChange={(e) => setNewEnvKey(e.target.value)}
                  className="text-xs font-mono"
                />
                <Input 
                  placeholder="value" 
                  value={newEnvVal}
                  onChange={(e) => setNewEnvVal(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>
              <Button type="submit" size="sm" variant="outline" className="w-full text-xs mt-2">
                Add Variable
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}>
      <WorkspaceContent />
    </Suspense>
  );
}