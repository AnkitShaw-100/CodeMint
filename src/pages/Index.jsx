import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import JwtSecretGenerator from "@/components/JwtSecretGenerator";
import PasswordGenerator from "@/components/PasswordGenerator";
import { Lock, Key, KeyRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [selectedTool, setSelectedTool] = useState("jwt");

  return (
    <div className="relative min-h-screen bg-background bg-grid">
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="relative mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Lock className="h-5 w-5 text-primary-foreground" />
            </div>

            <span className="font-display text-xl font-bold text-foreground">
              CodeMint
            </span>
          </div>

          <ThemeToggle />
        </header>

        {/* Hero */}
        <section className="mb-8 text-center">
          <h1 className="mb-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            <span className="text-gradient">Secure</span>{" "}
            <span className="text-foreground">Generation Tools</span>
          </h1>

          <p className="mx-auto max-w-md text-lg text-muted-foreground">
            Generate cryptographically secure secrets and passwords instantly.
          </p>
        </section>

        {/* Tool Selection Cards */}
        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <Card
            className={`cursor-pointer transition-all duration-300 ${
              selectedTool === "jwt"
                ? "glow-border border-primary ring-2 ring-primary/20"
                : "glow-border hover:glow-border-active"
            }`}
            onClick={() => setSelectedTool("jwt")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                JWT Secret
              </CardTitle>
              <CardDescription>
                Generate cryptographic secrets for signing JSON Web Tokens
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-300 ${
              selectedTool === "password"
                ? "glow-border border-primary ring-2 ring-primary/20"
                : "glow-border hover:glow-border-active"
            }`}
            onClick={() => setSelectedTool("password")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <KeyRound className="h-5 w-5 text-primary" />
                </div>
                Password
              </CardTitle>
              <CardDescription>
                Create strong, randomized passwords with custom rules
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* Display Selected Tool */}
        <section className="mb-12">
          {selectedTool === "jwt" && <JwtSecretGenerator />}
          {selectedTool === "password" && <PasswordGenerator />}
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          All generation happens locally in your browser. Nothing is stored or transmitted.
        </footer>
      </div>
    </div>
  );
};

export default Index;