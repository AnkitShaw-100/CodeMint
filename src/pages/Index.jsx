import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import JwtSecretGenerator from "@/components/JwtSecretGenerator";
import PasswordGenerator from "@/components/PasswordGenerator";
import { Lock, Key, KeyRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  const [selectedTool, setSelectedTool] = useState("jwt");

  return (
    <div className="relative min-h-screen bg-background bg-grid overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 sm:py-12">
            <header className="mb-8 sm:mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shrink-0">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>

            <span className="font-display text-lg sm:text-xl font-bold text-foreground truncate">
              CodeMint
            </span>
          </div>

          <ThemeToggle />
            </header>

            {/* Hero */}
        <section className="mb-8 sm:mb-10 text-center px-4">
          <h1 className="mb-3 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="text-gradient">Secure</span>{" "}
            <span className="text-foreground">Generation Tools</span>
          </h1>

          <p className="mx-auto max-w-md text-base sm:text-lg text-muted-foreground px-4">
            Generate cryptographically secure secrets and passwords instantly.
          </p>
        </section>

        {/* Tool Selection Cards */}
        <section className="mb-8 grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto">
          <Card
            className={`cursor-pointer transition-all duration-300 overflow-hidden ${
              selectedTool === "jwt"
                ? "glow-border border-primary ring-2 ring-primary/20 glow-border-active"
                : "glow-border hover:glow-border-active"
            }`}
            onClick={() => setSelectedTool("jwt")}
          >
            <CardHeader className="space-y-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <span className="truncate">JWT Secret</span>
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Generate cryptographic secrets for signing JSON Web Tokens
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-300 overflow-hidden ${
              selectedTool === "password"
                ? "glow-border border-primary ring-2 ring-primary/20 glow-border-active"
                : "glow-border hover:glow-border-active"
            }`}
            onClick={() => setSelectedTool("password")}
          >
            <CardHeader className="space-y-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <KeyRound className="h-5 w-5 text-primary" />
                </div>
                <span className="truncate">Password</span>
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Create strong, randomized passwords with custom rules
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* Display Selected Tool */}
        <section className="mb-12 max-w-4xl mx-auto">
          {selectedTool === "jwt" && <JwtSecretGenerator />}
          {selectedTool === "password" && <PasswordGenerator />}
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center text-xs sm:text-sm text-muted-foreground px-4">
          All generation happens locally in your browser. Nothing is stored or
          transmitted.
        </footer>
      </div>
    </div>
  );
};

export default Index;
