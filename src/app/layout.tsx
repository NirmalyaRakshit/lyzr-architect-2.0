import type { Metadata } from "next";
import "./globals.css";
import { Box, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Architect 2.0 | Lyzr AI",
  description: "Agentic application-building platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Forcing dark mode for the premium developer tool aesthetic
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground flex flex-col antialiased">
        <header className="border-b flex items-center justify-between px-6 py-3 shrink-0 bg-card">
          <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <Box className="w-6 h-6 text-primary" />
            Architect <span className="text-muted-foreground font-normal">2.0</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border">
              <User className="w-4 h-4 text-secondary-foreground" />
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}