import { Zap } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <Zap className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">The Combat Syntax</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          MMA Technique Gallery
        </div>
      </div>
    </nav>
  );
}
