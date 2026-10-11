import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Tabs as TabsPrimitive } from "radix-ui";
import { toast } from "sonner";
import {
  AtSign,
  CaseLower,
  CaseUpper,
  Check,
  Copy,
  EyeOff,
  Hash,
  Key,
  KeyRound,
  Lock,
  Moon,
  RefreshCw,
  ShieldCheck,
  Sun,
  Zap,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const TOOLS = [
  {
    id: "jwt",
    title: "JWT Secret",
    description: "Generate cryptographic secrets for signing JSON Web Tokens",
    icon: Key,
  },
  {
    id: "password",
    title: "Password",
    description: "Create strong, randomized passwords with custom rules",
    icon: KeyRound,
  },
];

const FEATURES = [
  { icon: ShieldCheck, label: "Cryptographically secure" },
  { icon: Zap, label: "Instant generation" },
  { icon: EyeOff, label: "Never stored or sent" },
];

const STRENGTH_LEVELS = {
  Weak: { level: 1, text: "text-red-600 dark:text-red-400", bar: "bg-red-500" },
  Fair: { level: 2, text: "text-amber-700 dark:text-amber-400", bar: "bg-amber-500" },
  Strong: { level: 3, text: "text-success-text", bar: "bg-success" },
  "Very Strong": { level: 4, text: "text-success-text", bar: "bg-success" },
};

// HMAC keys should be at least as long as the hash output (RFC 7518 §3.2)
const JWT_STRENGTH = {
  128: { label: "Fair", detail: "Below the 256-bit minimum for HS256" },
  256: { label: "Strong", detail: "Suitable for HS256" },
  384: { label: "Very Strong", detail: "Suitable for HS384" },
  512: { label: "Very Strong", detail: "Suitable for HS512" },
};

const fieldTriggerClass =
  "w-full data-[size=default]:h-11 rounded-xl border-field-border bg-field dark:bg-field dark:hover:bg-field px-3.5 text-sm font-medium shadow-none transition-colors hover:border-primary/50 focus-visible:border-primary focus-visible:ring-primary/25";

const fieldContentClass = "rounded-xl border-field-border p-1 shadow-xl";

const fieldItemClass = "rounded-lg py-2";

/* ------------------------------------------------------------------ */
/* Shared UI                                                           */
/* ------------------------------------------------------------------ */

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="glass-card relative grid size-10 place-items-center rounded-full text-muted-foreground transition-all duration-200 hover:text-foreground motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
    >
      <Sun className="size-[18px] rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
      <Moon className="absolute size-[18px] rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
    </button>
  );
};

const Logo = () => (
  <a
    href="/"
    className="flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
  >
    <span className="bg-brand-gradient grid size-9 place-items-center rounded-xl shadow-[0_6px_16px_-4px_rgba(255,107,26,0.55)]">
      <span className="text-[17px] font-extrabold text-[#1A1A1E]">C</span>
    </span>
    <span className="text-lg font-bold tracking-tight">CodeMint</span>
  </a>
);

const IconChip = ({ icon, active = false, className }) => {
  const Icon = icon;

  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-xl transition-all duration-300",
        active
          ? "bg-brand-gradient text-[#1A1A1E] shadow-[0_6px_16px_-4px_rgba(255,107,26,0.5)]"
          : "bg-accent text-brand-text",
        className
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </span>
  );
};

const GenerateButton = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="group bg-brand-gradient relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl text-[15px] font-semibold text-[#1A1A1E] shadow-[0_10px_28px_-8px_rgba(255,107,26,0.6)] transition-all duration-200 hover:shadow-[0_16px_36px_-8px_rgba(255,107,26,0.7)] hover:brightness-[1.04] motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/35"
  >
    {/* Sheen */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/25 to-transparent"
    />
    <RefreshCw
      className="relative size-[18px] transition-transform duration-500 motion-safe:group-hover:rotate-180"
      aria-hidden="true"
    />
    <span className="relative">{children}</span>
  </button>
);

const FieldLabel = ({ children, htmlFor, id }) => (
  <Label
    htmlFor={htmlFor}
    id={id}
    className="text-[13px] font-semibold tracking-wide text-muted-foreground"
  >
    {children}
  </Label>
);

const StrengthMeter = ({ label, detail }) => {
  const style = STRENGTH_LEVELS[label];

  return (
    <div className="rounded-2xl bg-secondary/60 px-4 py-3.5 dark:bg-secondary/50">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <span className="text-[13px] font-semibold text-muted-foreground">
          Strength
        </span>
        <span className={cn("text-sm font-bold", style.text)}>{label}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-colors duration-300",
              i <= style.level ? style.bar : "bg-black/10 dark:bg-white/10"
            )}
          />
        ))}
      </div>

      {detail && (
        <p className="mt-2.5 text-xs text-muted-foreground">{detail}</p>
      )}
    </div>
  );
};

const useCopy = (value, message) => {
  // Remember which value was copied so a fresh value resets the "Copied" state
  const [copiedValue, setCopiedValue] = useState(null);
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success(message);
    setCopiedValue(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopiedValue(null), 1800);
  };

  return [Boolean(value) && copiedValue === value, copy];
};

const OutputPanel = ({ value, onCopy, copied, emptyTitle, emptyHint, meta, children }) => (
  <div className="space-y-2.5">
    <div className="flex items-center justify-between gap-3">
      <span className="text-[13px] font-semibold tracking-wide text-muted-foreground">
        Output
      </span>

      <button
        type="button"
        onClick={onCopy}
        disabled={!value}
        aria-label={copied ? "Copied" : "Copy to clipboard"}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-40",
          copied
            ? "bg-success/12 text-success-text"
            : "bg-accent text-foreground hover:bg-primary/15"
        )}
      >
        {copied ? (
          <Check className="size-3.5" aria-hidden="true" />
        ) : (
          <Copy className="size-3.5" aria-hidden="true" />
        )}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>

    {value ? (
      <button
        type="button"
        key={value}
        onClick={onCopy}
        title="Click to copy"
        className={cn(
          "group block w-full rounded-2xl border bg-background/70 p-4 text-left transition-all duration-200 sm:p-5",
          "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-300",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
          copied
            ? "border-success/50"
            : "border-field-border hover:border-primary/40"
        )}
      >
        <span className="block break-all font-mono [font-variant-ligatures:none] text-[15px] leading-relaxed text-foreground sm:text-base">
          {children ?? value}
        </span>
        <span className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>{meta}</span>
          <span className="hidden transition-colors group-hover:text-foreground sm:inline">
            Click to copy
          </span>
        </span>
      </button>
    ) : (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-field-border bg-background/50 px-6 py-9 text-center">
        <span className="mb-3 grid size-11 place-items-center rounded-full bg-accent text-brand-text">
          <Lock className="size-5" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-foreground">{emptyTitle}</p>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">{emptyHint}</p>
      </div>
    )}

    {/* Announce new output to screen readers without reading the secret aloud */}
    <span className="sr-only" aria-live="polite">
      {value ? "New value generated." : ""}
    </span>
  </div>
);

const ToolPanel = ({ icon, title, description, children }) => (
  <div className="glass-card rounded-[20px] p-5 sm:p-7">
    <div className="mb-5 flex items-start gap-3.5">
      <IconChip icon={icon} />
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-bold tracking-tight sm:text-xl">{title}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success-text md:inline-flex">
        <ShieldCheck className="size-3.5" aria-hidden="true" />
        Web Crypto
      </span>
    </div>
    <div className="space-y-6">{children}</div>
  </div>
);

/* ------------------------------------------------------------------ */
/* JWT Secret Generator                                                */
/* ------------------------------------------------------------------ */

const JwtSecretGenerator = () => {
  const [bits, setBits] = useState("256");
  const [encoding, setEncoding] = useState("base64");
  const [secret, setSecret] = useState("");
  const [copied, copyToClipboard] = useCopy(secret, "JWT secret copied to clipboard!");

  const generateSecret = () => {
    const byteLength = parseInt(bits) / 8;
    const array = new Uint8Array(byteLength);
    crypto.getRandomValues(array);

    let result = "";

    if (encoding === "base64") {
      result = btoa(String.fromCharCode(...array));
    } else if (encoding === "hex") {
      result = Array.from(array)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } else {
      result = btoa(String.fromCharCode(...array))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }

    setSecret(result);
  };

  const strength = JWT_STRENGTH[bits];

  return (
    <ToolPanel
      icon={ShieldCheck}
      title="JWT Secret Generator"
      description="Random signing keys for HMAC-based JSON Web Tokens."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel htmlFor="jwt-bits">Bit Length</FieldLabel>
          <Select value={bits} onValueChange={setBits}>
            <SelectTrigger id="jwt-bits" className={fieldTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" className={fieldContentClass}>
              <SelectItem className={fieldItemClass} value="128">128-bit</SelectItem>
              <SelectItem className={fieldItemClass} value="256">256-bit</SelectItem>
              <SelectItem className={fieldItemClass} value="384">384-bit</SelectItem>
              <SelectItem className={fieldItemClass} value="512">512-bit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="jwt-encoding">Encoding</FieldLabel>
          <Select value={encoding} onValueChange={setEncoding}>
            <SelectTrigger id="jwt-encoding" className={fieldTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" className={fieldContentClass}>
              <SelectItem className={fieldItemClass} value="base64">Base64</SelectItem>
              <SelectItem className={fieldItemClass} value="base64url">Base64URL</SelectItem>
              <SelectItem className={fieldItemClass} value="hex">Hexadecimal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <StrengthMeter label={strength.label} detail={`${bits} bits of entropy · ${strength.detail}`} />

      <GenerateButton onClick={generateSecret}>Generate Secret</GenerateButton>

      <OutputPanel
        value={secret}
        onCopy={copyToClipboard}
        copied={copied}
        emptyTitle="No secret generated yet"
        emptyHint="Pick a bit length and encoding, then press Generate Secret."
        meta={`${secret.length} characters`}
      />
    </ToolPanel>
  );
};

/* ------------------------------------------------------------------ */
/* Password Generator                                                  */
/* ------------------------------------------------------------------ */

// Colour-codes digits and symbols so similar-looking characters are easier to read
const HighlightedPassword = ({ value }) =>
  Array.from(value).map((ch, i) => {
    let tone = "";
    if (/[0-9]/.test(ch)) tone = "text-brand-text";
    else if (/[^A-Za-z]/.test(ch)) tone = "text-sky-700 dark:text-sky-400";
    return (
      <span key={i} className={tone}>
        {ch}
      </span>
    );
  });

const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, copyToClipboard] = useCopy(password, "Password copied to clipboard!");

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

  const getStrength = () => {
    let pool = 0;

    if (uppercase) pool += 26;
    if (lowercase) pool += 26;
    if (numbers) pool += 10;
    if (symbols) pool += 26;

    const entropy = length * Math.log2(pool || 1);

    if (entropy < 40) return { label: "Weak", entropy };
    if (entropy < 60) return { label: "Fair", entropy };
    if (entropy < 80) return { label: "Strong", entropy };

    return { label: "Very Strong", entropy };
  };

  const strength = getStrength();

  const options = [
    { id: "pw-upper", label: "Uppercase", sample: "A-Z", icon: CaseUpper, value: uppercase, set: setUppercase },
    { id: "pw-lower", label: "Lowercase", sample: "a-z", icon: CaseLower, value: lowercase, set: setLowercase },
    { id: "pw-numbers", label: "Numbers", sample: "0-9", icon: Hash, value: numbers, set: setNumbers },
    { id: "pw-symbols", label: "Symbols", sample: "!@#$", icon: AtSign, value: symbols, set: setSymbols },
  ];

  return (
    <ToolPanel
      icon={KeyRound}
      title="Password Generator"
      description="Strong, randomized passwords tuned to your rules."
    >
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <FieldLabel id="pw-length-label">Length</FieldLabel>
          <span className="min-w-11 rounded-lg bg-accent px-2.5 py-1 text-center font-mono text-sm font-semibold text-foreground">
            {length}
          </span>
        </div>

        <Slider
          aria-labelledby="pw-length-label"
          value={[length]}
          onValueChange={(v) => setLength(v[0])}
          min={4}
          max={32}
          step={1}
          className="py-1.5 [&_[data-slot=slider-range]]:bg-brand-gradient [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-primary [&_[data-slot=slider-thumb]]:ring-primary/25 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-black/10 dark:[&_[data-slot=slider-track]]:bg-white/10"
        />

        <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
          <span>4</span>
          <span>32</span>
        </div>
      </div>

      <fieldset className="space-y-2.5">
        <legend className="mb-2.5 text-[13px] font-semibold tracking-wide text-muted-foreground">
          Character types
        </legend>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {options.map((opt) => (
            <label
              key={opt.id}
              htmlFor={opt.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-2xl border px-3.5 py-3 transition-all duration-200",
                opt.value
                  ? "border-primary/35 bg-accent/70 dark:bg-primary/[0.07]"
                  : "border-field-border bg-background/50 hover:border-primary/30"
              )}
            >
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-lg transition-colors",
                  opt.value ? "bg-primary/15 text-brand-text" : "bg-secondary text-muted-foreground"
                )}
              >
                <opt.icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{opt.label}</span>
                <span className="block font-mono text-xs text-muted-foreground">
                  {opt.sample}
                </span>
              </span>
              <Switch
                id={opt.id}
                checked={opt.value}
                onCheckedChange={opt.set}
                className="data-[state=unchecked]:bg-[#8A8A94] dark:data-[state=unchecked]:bg-[#3A3A47]"
              />
            </label>
          ))}
        </div>
      </fieldset>

      <StrengthMeter
        label={strength.label}
        detail={`≈ ${Math.round(strength.entropy)} bits of entropy`}
      />

      <GenerateButton onClick={generatePassword}>Generate Password</GenerateButton>

      <OutputPanel
        value={password}
        onCopy={copyToClipboard}
        copied={copied}
        emptyTitle="No password generated yet"
        emptyHint="Set a length and character types, then press Generate Password."
        meta={`${password.length} characters`}
      >
        {password && <HighlightedPassword value={password} />}
      </OutputPanel>
    </ToolPanel>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const Index = () => {
  const [selectedTool, setSelectedTool] = useState("jwt");

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="page-backdrop" aria-hidden="true" />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground sm:inline-flex">
              <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
              100% client-side
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        {/* Hero */}
        <section className="pt-8 pb-7 text-center sm:pt-10 sm:pb-8">
          <span className="glass-card mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-muted-foreground">
            <ShieldCheck className="size-3.5 text-brand-text" aria-hidden="true" />
            Powered by the Web Crypto API
          </span>

          <h1 className="mx-auto text-4xl leading-[1.08] font-extrabold tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
            <span className="text-brand-gradient">Secure</span> Generation Tools
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-base text-pretty text-muted-foreground sm:text-[17px]">
            Generate cryptographically secure secrets and passwords instantly.
          </p>

          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {FEATURES.map((feature) => (
              <li
                key={feature.label}
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80"
              >
                <span className="grid size-6 place-items-center rounded-md bg-accent text-brand-text">
                  <feature.icon className="size-3.5" aria-hidden="true" />
                </span>
                {feature.label}
              </li>
            ))}
          </ul>
        </section>

        {/* Tools */}
        <TabsPrimitive.Root
          value={selectedTool}
          onValueChange={setSelectedTool}
          className="mx-auto max-w-3xl"
        >
          <TabsPrimitive.List
            aria-label="Choose a generator"
            className="mb-4 grid grid-cols-2 gap-3 sm:gap-4"
          >
            {TOOLS.map((tool) => {
              const active = selectedTool === tool.id;
              return (
                <TabsPrimitive.Trigger
                  key={tool.id}
                  value={tool.id}
                  className={cn(
                    "group relative flex flex-col items-start gap-3 rounded-[20px] p-4 text-left transition-all duration-300 sm:flex-row sm:items-center sm:gap-4 sm:px-5 sm:py-4",
                    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
                    "glass-card",
                    active
                      ? "border-primary/60 shadow-[0_12px_36px_-10px_rgba(255,107,26,0.35)]"
                      : "opacity-90 hover:opacity-100 hover:border-primary/30 motion-safe:hover:-translate-y-0.5"
                  )}
                >
                  <IconChip icon={tool.icon} active={active} />
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-[15px] font-bold tracking-tight sm:text-base">
                      {tool.title}
                    </span>
                    <span className="mt-1 hidden text-sm leading-snug text-muted-foreground sm:block">
                      {tool.description}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-4 right-4 size-2 rounded-full transition-all duration-300",
                      active ? "bg-primary shadow-[0_0_0_4px_rgba(255,107,26,0.18)]" : "bg-transparent"
                    )}
                  />
                </TabsPrimitive.Trigger>
              );
            })}
          </TabsPrimitive.List>

          <TabsPrimitive.Content
            value="jwt"
            className="focus-visible:outline-none motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300"
          >
            <JwtSecretGenerator />
          </TabsPrimitive.Content>
          <TabsPrimitive.Content
            value="password"
            className="focus-visible:outline-none motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300"
          >
            <PasswordGenerator />
          </TabsPrimitive.Content>
        </TabsPrimitive.Root>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/60">
        <p className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-2.5 gap-y-1 px-4 py-6 text-center text-xs text-muted-foreground sm:text-sm">
          <span>Built for developers</span>
          <span aria-hidden="true">•</span>
          <span>100% client-side</span>
          <span aria-hidden="true">•</span>
          <span>Nothing leaves your browser</span>
        </p>
      </footer>
    </div>
  );
};

export default Index;
