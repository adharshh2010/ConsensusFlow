import { Search } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-linear-to-br from-neutral-100 via-neutral-200 to-secondary/5">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight text-balance">
            Navigate Information with Clarity
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-primary">
            See the Evidence, Not the Noise
          </p>
        </div>

        {/* Sub-headline */}
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Your evidence-driven guide to understanding claims, topics, and global
          discourse.
        </p>

        {/* Search Bar */}
        <div className="flex gap-2 max-w-2xl mx-auto mt-8 items-center justify-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search any claim, topic, or URL..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-neutral-200 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <Button className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground h-12 hover:cursor-pointer flex items-center gap-2">
            Search
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span>Evidence-backed analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span>Transparent methodology</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span>Community-driven consensus</span>
          </div>
        </div>
      </div>
    </section>
  );
}
