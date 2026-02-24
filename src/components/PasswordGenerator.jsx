import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Copy, RefreshCw, KeyRound } from "lucide-react";
import { toast } from "sonner";

const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generatePassword = () => {
    let chars = "";

    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) {
      toast.error("Select at least one character type");
      return;
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    const result = Array.from(array)
      .map((n) => chars[n % chars.length])
      .join("");

    setPassword(result);
  };

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast.success("Password copied to clipboard!");
  };

  const getStrength = () => {
    let pool = 0;

    if (uppercase) pool += 26;
    if (lowercase) pool += 26;
    if (numbers) pool += 10;
    if (symbols) pool += 26;

    const entropy = length * Math.log2(pool || 1);

    if (entropy < 40) return { label: "Weak", color: "text-destructive" };
    if (entropy < 60) return { label: "Fair", color: "text-yellow-500" };
    if (entropy < 80) return { label: "Strong", color: "text-primary" };

    return { label: "Very Strong", color: "text-primary" };
  };

  const strength = getStrength();

  return (
    <Card className="glow-border hover:glow-border-active transition-shadow duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-display text-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <KeyRound className="h-5 w-5 text-primary" />
          </div>
          Password Generator
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground text-sm">Length</Label>
            <span className="font-mono text-sm font-semibold text-foreground">
              {length}
            </span>
          </div>

          <Slider
            value={[length]}
            onValueChange={(v) => setLength(v[0])}
            min={4}
            max={32}
            step={1}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Uppercase (A-Z)", value: uppercase, set: setUppercase },
            { label: "Lowercase (a-z)", value: lowercase, set: setLowercase },
            { label: "Numbers (0-9)", value: numbers, set: setNumbers },
            { label: "Symbols (!@#$)", value: symbols, set: setSymbols },
          ].map((opt) => (
            <div
              key={opt.label}
              className="flex items-center justify-between rounded-lg bg-secondary p-3"
            >
              <Label className="text-sm">{opt.label}</Label>
              <Switch checked={opt.value} onCheckedChange={opt.set} />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Strength:</span>
          <span className={`font-mono text-sm font-semibold ${strength.color}`}>
            {strength.label}
          </span>
        </div>

        <Button onClick={generatePassword} className="w-full gap-2">
          <RefreshCw className="h-4 w-4" />
          Generate Password
        </Button>

        {password && (
          <div
            className="group relative cursor-pointer rounded-lg bg-secondary p-4 transition-colors hover:bg-secondary/80"
            onClick={copyToClipboard}
          >
            <p className="break-all font-mono text-sm leading-relaxed text-foreground">
              {password}
            </p>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PasswordGenerator;