import { Zap, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">The Combat Syntax</h1>
              <div className="text-xs md:text-sm text-muted-foreground">
                MMA Technique Gallery
              </div>
            </div>
          </div>
          <div className="hidden md:flex gap-4">
            <Link href="/">
              <Button variant="ghost">Techniques</Button>
            </Link>
            <Link href="/drills">
              <Button variant="ghost">Drills</Button>
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-2">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Techniques</Button>
            </Link>
            <Link href="/drills" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Drills</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
