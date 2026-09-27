"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, Sparkles, Terminal, Code2 } from "lucide-react";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    // Route to the workspace we will build next
    const mockId = Math.random().toString(36).substring(7);
    router.push(`/workspace/${mockId}?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="flex-1 overflow-auto p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col items-center text-center space-y-6 mt-16 mb-20">
        <h1 className="text-4xl font-bold tracking-tight">What do you want to build?</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Describe your application in plain English, or import an existing repository to start iterating with agentic AI.
        </p>
        
        <form onSubmit={handleCreate} className="w-full max-w-3xl flex gap-3 mt-4">
          <Input 
            className="h-14 text-lg px-6 rounded-xl border-muted-foreground/30 bg-card shadow-sm"
            placeholder="e.g. Build a SaaS dashboard for tracking marketing campaigns..." 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button type="submit" size="lg" className="h-14 px-8 rounded-xl font-semibold">
            <Sparkles className="w-5 h-5 mr-2" />
            Generate
          </Button>
        </form>

        <div className="pt-6 flex gap-4 text-sm text-muted-foreground">
          <Button variant="outline" className="rounded-full bg-background">
            <GitBranch className="w-4 h-4 mr-2" /> Import from GitHub
          </Button>
          <Button variant="outline" className="rounded-full bg-background">
            <Terminal className="w-4 h-4 mr-2" /> Start from Template
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:border-primary/50 cursor-pointer transition-colors bg-card/50" onClick={() => router.push('/workspace/mock-1')}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-400" />
                Marketing Dashboard
              </CardTitle>
              <CardDescription>Updated 2 hours ago</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">Next.js</span>
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">Tailwind</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:border-primary/50 cursor-pointer transition-colors bg-card/50" onClick={() => router.push('/workspace/mock-2')}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code2 className="w-5 h-5 text-green-400" />
                Internal CRM Tool
              </CardTitle>
              <CardDescription>Updated yesterday</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">React</span>
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">Supabase</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}