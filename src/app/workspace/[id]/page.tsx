"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Send, TerminalSquare, Code2, Play, GitBranch, Sparkles, Loader2 } from "lucide-react";
import Editor from "@monaco-editor/react";

// Wrap the main content in a component to use useSearchParams safely
function WorkspaceContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "Build a new application";

  const [messages, setMessages] = useState([
    { role: "user", content: initialPrompt },
    { role: "agent", content: "Analyzing request and planning architecture...", status: "loading" }
  ]);
  const [input, setInput] = useState("");

  // Mock agent simulation for the demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(prev => [
        prev[0],
        { role: "agent", content: "I've created the initial scaffold for your application based on your prompt. I set up a Next.js environment, generated the core UI components, and started the dev server.", status: "done" }
      ]);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: input }]);
    setInput("");
    
    // Mock reply to further interactions
    setTimeout(() => {
       setMessages(prev => [...prev, { role: "agent", content: "Updating the codebase based on your instructions...", status: "loading" }]);
    }, 500);
  };

  return (
    <div className="h-[calc(100vh-65px)] w-full flex">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full border-t">
        
        {/* LEFT PANEL: AGENT CHAT */}
        <ResizablePanel defaultSize={30} minSize={25} className="bg-card/30 flex flex-col h-full">
          <div className="p-4 border-b bg-card flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Architect Agent</h3>
            </div>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Claude 3.5 Sonnet</span>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 pb-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'agent' && (
                    <Avatar className="w-8 h-8 bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </Avatar>
                  )}
                  <div className={`p-3 rounded-xl max-w-[85%] text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted border border-border/50 shadow-sm'
                  }`}>
                    {msg.content}
                    {msg.status === 'loading' && <Loader2 className="w-3 h-3 animate-spin inline ml-2" />}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 bg-card border-t">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input 
                placeholder="Ask the agent to modify the code..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-background"
              />
              <Button type="submit" size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* RIGHT PANEL: IDE TABS */}
        <ResizablePanel defaultSize={70} className="bg-background flex flex-col h-full">
          <Tabs defaultValue="preview" className="flex flex-col h-full w-full">
            <div className="border-b px-4 py-2 bg-card flex items-center justify-between">
              <TabsList className="bg-muted">
                <TabsTrigger value="preview" className="text-xs flex gap-2 items-center"><Play className="w-3 h-3" /> Preview</TabsTrigger>
                <TabsTrigger value="code" className="text-xs flex gap-2 items-center"><Code2 className="w-3 h-3" /> Code</TabsTrigger>
                <TabsTrigger value="terminal" className="text-xs flex gap-2 items-center"><TerminalSquare className="w-3 h-3" /> Terminal</TabsTrigger>
                <TabsTrigger value="git" className="text-xs flex gap-2 items-center"><GitBranch className="w-3 h-3" /> Git / Deploy</TabsTrigger>
              </TabsList>
              <Button size="sm" className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                Deploy App
              </Button>
            </div>

            <TabsContent value="preview" className="flex-1 m-0 p-0 relative h-full">
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/50 flex-col gap-4">
                 {messages[1]?.status === 'loading' ? (
                   <>
                     <Loader2 className="w-8 h-8 animate-spin text-primary" />
                     <p className="text-sm text-muted-foreground font-medium">Agent is building your preview environment...</p>
                   </>
                 ) : (
                   <div className="w-full h-full p-4">
                      <div className="w-full h-full bg-white rounded-xl border shadow-lg flex items-center justify-center overflow-hidden">
                        {/* Mock App Preview */}
                        <div className="text-zinc-800 text-center">
                           <h1 className="text-3xl font-bold mb-2 text-black">Your Generated App</h1>
                           <p className="text-zinc-600">The agent has successfully compiled the preview.</p>
                           <Button className="mt-4 bg-black text-white hover:bg-black/80">Click Me</Button>
                        </div>
                      </div>
                   </div>
                 )}
              </div>
            </TabsContent>

            <TabsContent value="code" className="flex-1 m-0 p-0 relative h-full">
              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme="vs-dark"
                options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
                defaultValue={`// Agent generated this file based on your prompt\n\nimport { Button } from "@/components/ui/button";\n\nexport default function GeneratedApp() {\n  return (\n    <div className="p-8 flex flex-col items-center justify-center min-h-screen">\n      <h1 className="text-3xl font-bold mb-2">Your Generated App</h1>\n      <p className="text-zinc-500 mb-4">The agent has successfully compiled the preview.</p>\n      <Button>Click Me</Button>\n    </div>\n  );\n}`}
              />
            </TabsContent>

            <TabsContent value="terminal" className="flex-1 m-0 p-4 bg-zinc-950 font-mono text-xs text-green-400 overflow-auto h-full">
              <p>$ architect-sandbox init</p>
              <p className="text-zinc-400">➜ Booting Firecracker microVM...</p>
              <p className="text-zinc-400">➜ Analyzing dependencies from agent plan...</p>
              <p className="text-zinc-400">➜ Installing next react react-dom lucide-react shadcn-ui...</p>
              <p>✔ Packages installed successfully in 1.2s.</p>
              <p className="text-zinc-400">➜ Starting development server on port 3001...</p>
              <p className="text-blue-400">ready - started server on 0.0.0.0:3001, url: http://localhost:3001</p>
              <p className="text-zinc-400">event - compiled client and server successfully in 842 ms</p>
            </TabsContent>

            <TabsContent value="git" className="flex-1 m-0 p-8 flex flex-col items-center justify-center text-center h-full">
              <GitBranch className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Version Control & GitHub Sync</h3>
              <p className="text-muted-foreground text-sm max-w-md mb-6">
                Connect your GitHub account to sync the agent's code, review line-by-line diffs, and manage repository branches directly from the workspace.
              </p>
              <Button variant="outline">Connect GitHub Account</Button>
            </TabsContent>

          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
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