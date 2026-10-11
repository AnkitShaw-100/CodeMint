import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  Slider as SliderPrimitive,
  Switch as SwitchPrimitive,
  Tabs as TabsPrimitive,
} from "radix-ui";
import { toast } from "sonner";
import { Check, ChevronDown, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const TOOLS = [
  { id: "jwt", label: "JWT Secret" },
  { id: "password", label: "Password" },
];

const STRENGTH_LEVELS = {
  Weak: { level: 1, text: "text-system-red", bar: "bg-system-red" },
  Fair: { level: 2, text: "text-system-orange", bar: "bg-system-orange" },
  Strong: { level: 3, text: "text-system-green", bar: "bg-system-green" },
  "Very Strong": { level: 4, text: "text-system-green", bar: "bg-system-green" },
};

// HMAC keys should be at least as long as the hash output (RFC 7518 §3.2)
const JWT_STRENGTH = {
  128: { label: "Fair", detail: "Below the 256-bit minimum for HS256" },
  256: { label: "Strong", detail: "Suitable for HS256" },
  384: { label: "Very Strong", detail: "Suitable for HS384" },
  512: { label: "Very Strong", detail: "Suitable for HS512" },
};

// Subtle, Apple-like keyboard focus ring
const focusRing =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-ring";

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

// App-icon style mark: a mint leaf on a squircle
const LogoMark = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <path
      className="fill-primary"
      d="M16 0C27.2 0 32 4.8 32 16S27.2 32 16 32 0 27.2 0 16 4.8 0 16 0Z"
    />
    <path
      fill="#FFFFFF"
      d="M8 24C8 14.6 14.6 8 24 8C24 17.4 17.4 24 8 24Z"
    />
    <path
      className="stroke-primary"
      d="M8 24L17.6 14.4"
      fill="none"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

const Logo = () => (
  <a
    href="/"
    aria-label="CodeMint home"
    className={cn("-ml-1 flex items-center gap-3 rounded-lg px-1 py-1", focusRing)}
  >
    <LogoMark className="size-8 sm:size-9" />
    <span className="text-[19px] font-semibold tracking-[-0.022em] sm:text-[21px]">CodeMint</span>
  </a>
);

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        // 36px visual, 44pt hit area via the pseudo-element
        "relative grid size-9 place-items-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-fill hover:text-foreground",
        "after:absolute after:-inset-1 after:content-['']",
        focusRing
      )}
    >
      <Moon
        className="col-start-1 row-start-1 size-[18px] transition-[opacity,transform] duration-300 dark:scale-75 dark:-rotate-45 dark:opacity-0"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <Sun
        className="col-start-1 row-start-1 size-[18px] scale-75 rotate-45 opacity-0 transition-[opacity,transform] duration-300 dark:scale-100 dark:rotate-0 dark:opacity-100"
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </button>
  );
};

const NavBar = () => {
  // Hairline appears only once content scrolls beneath the bar, like apple.com
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl backdrop-saturate-[1.8] transition-colors duration-300",
        scrolled ? "border-separator" : "border-transparent"
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-[60px] max-w-[980px] items-center justify-between px-4 sm:px-6"
      >
        <Logo />
        <ThemeToggle />
      </nav>
    </header>
  );
};

/* ------------------------------------------------------------------ */
/* Controls                                                            */
/* ------------------------------------------------------------------ */

const Field = ({ label, htmlFor, children }) => (
  <div>
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-[15px] font-medium text-foreground"
    >
      {label}
    </label>
    {children}
  </div>
);

// Native <select> so iPhone shows its own picker wheel
const SelectField = ({ id, value, onChange, options }) => (
  <div className="relative">
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-11 w-full cursor-pointer appearance-none rounded-[10px] bg-field pr-10 pl-4 text-[17px] text-foreground",
        focusRing
      )}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown
      className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
      strokeWidth={2}
      aria-hidden="true"
    />
  </div>
);

const IosSwitch = ({ checked, onCheckedChange }) => (
  <SwitchPrimitive.Root
    checked={checked}
    onCheckedChange={onCheckedChange}
    className={cn(
      "inline-flex h-[31px] w-[51px] shrink-0 cursor-pointer items-center rounded-full p-[2px] transition-colors duration-200",
      "bg-[#E9E9EA] data-[state=checked]:bg-primary dark:bg-[#39393D] dark:data-[state=checked]:bg-primary",
      focusRing
    )}
  >
    <SwitchPrimitive.Thumb className="block size-[27px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15),0_3px_1px_rgba(0,0,0,0.06)] transition-transform duration-200 data-[state=checked]:translate-x-5" />
  </SwitchPrimitive.Root>
);

const IosSlider = ({ label, ...props }) => (
  <SliderPrimitive.Root
    className="relative flex h-11 w-full touch-none items-center select-none"
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 grow overflow-hidden rounded-full bg-[#E5E5EA] dark:bg-[#3A3A3C]">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      aria-label={label}
      className={cn(
        "block size-7 cursor-grab rounded-full bg-white shadow-[0_0.5px_4px_rgba(0,0,0,0.12),0_6px_13px_rgba(0,0,0,0.12)] active:cursor-grabbing",
        focusRing
      )}
    />
  </SliderPrimitive.Root>
);

const PrimaryButton = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "h-11 w-full rounded-[12px] bg-primary text-[17px] font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary-hover active:bg-primary-hover",
      "outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
    )}
  >
    {children}
  </button>
);

const StrengthMeter = ({ label, detail }) => {
  const style = STRENGTH_LEVELS[label];

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[15px] font-medium">Strength</span>
        <span className={cn("text-[15px] font-semibold", style.text)}>{label}</span>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 rounded-full transition-colors duration-200",
              i <= style.level ? style.bar : "bg-[#E5E5EA] dark:bg-[#3A3A3C]"
            )}
          />
        ))}
      </div>
      <p className="mt-2 text-[13px] text-muted-foreground">{detail}</p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Output                                                              */
/* ------------------------------------------------------------------ */

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
    timer.current = setTimeout(() => setCopiedValue(null), 2000);
  };

  return [Boolean(value) && copiedValue === value, copy];
};

const OutputPanel = ({ label, value, onCopy, copied, placeholder }) => (
  <div>
    <div className="mb-2 flex items-center justify-between">
      <span className="text-[15px] font-medium">{label}</span>
      <button
        type="button"
        onClick={onCopy}
        disabled={!value}
        className={cn(
          // Small visually, 44pt hit area via the pseudo-element
          "relative inline-flex h-7 items-center gap-1 rounded-full bg-fill px-3 text-[13px] font-medium text-foreground transition-colors hover:bg-[rgba(118,118,128,0.2)] disabled:cursor-default disabled:opacity-40",
          "after:absolute after:-inset-2 after:content-['']",
          focusRing
        )}
      >
        {copied ? "Copied" : "Copy"}
        {copied && (
          <Check className="size-3.5 text-system-green" strokeWidth={2.5} aria-hidden="true" />
        )}
      </button>
    </div>

    <button
      type="button"
      onClick={onCopy}
      disabled={!value}
      aria-label={value ? "Copy to clipboard" : undefined}
      className={cn(
        "flex min-h-[88px] w-full items-center rounded-[10px] bg-field px-4 py-3.5 text-left disabled:cursor-default",
        focusRing
      )}
    >
      {value ? (
        <span className="font-mono text-[15px] leading-[1.5] break-all text-foreground [font-variant-ligatures:none]">
          {value}
        </span>
      ) : (
        <span className="text-[15px] text-muted-foreground">{placeholder}</span>
      )}
    </button>

    <p className="mt-2 h-[18px] text-[13px] text-muted-foreground">
      {value ? `${value.length} characters · Tap to copy` : ""}
    </p>

    {/* Announce new output to screen readers without reading the secret aloud */}
    <span className="sr-only" aria-live="polite">
      {copied ? "Copied to clipboard." : value ? "New value generated." : ""}
    </span>
  </div>
);

const ToolCard = ({ title, description, children }) => (
  <div className="rounded-[20px] border border-border bg-card px-6 py-8 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:px-10 sm:py-10">
    <h2 className="text-[24px] leading-tight font-semibold tracking-[-0.015em]">
      {title}
    </h2>
    <p className="mt-1 text-[15px] text-muted-foreground">{description}</p>
    <div className="my-8 h-px bg-separator" />
    <div className="space-y-8">{children}</div>
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
    <ToolCard
      title="JWT Secret Generator"
      description="Generate cryptographic secrets for signing JSON Web Tokens."
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4">
        <Field label="Bit Length" htmlFor="jwt-bits">
          <SelectField
            id="jwt-bits"
            value={bits}
            onChange={setBits}
            options={[
              { value: "128", label: "128-bit" },
              { value: "256", label: "256-bit" },
              { value: "384", label: "384-bit" },
              { value: "512", label: "512-bit" },
            ]}
          />
        </Field>

        <Field label="Encoding" htmlFor="jwt-encoding">
          <SelectField
            id="jwt-encoding"
            value={encoding}
            onChange={setEncoding}
            options={[
              { value: "base64", label: "Base64" },
              { value: "base64url", label: "Base64URL" },
              { value: "hex", label: "Hexadecimal" },
            ]}
          />
        </Field>
      </div>

      <StrengthMeter
        label={strength.label}
        detail={`${bits} bits of entropy. ${strength.detail}.`}
      />

      <PrimaryButton onClick={generateSecret}>Generate Secret</PrimaryButton>

      <OutputPanel
        label="Secret"
        value={secret}
        onCopy={copyToClipboard}
        copied={copied}
        placeholder="Your secret will appear here."
      />
    </ToolCard>
  );
};

/* ------------------------------------------------------------------ */
/* Password Generator                                                  */
/* ------------------------------------------------------------------ */

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
    { label: "Uppercase", sample: "A-Z", value: uppercase, set: setUppercase },
    { label: "Lowercase", sample: "a-z", value: lowercase, set: setLowercase },
    { label: "Numbers", sample: "0-9", value: numbers, set: setNumbers },
    { label: "Symbols", sample: "!@#$", value: symbols, set: setSymbols },
  ];

  return (
    <ToolCard
      title="Password Generator"
      description="Create strong, randomized passwords with custom rules."
    >
      <div>
        <div className="flex items-baseline justify-between">
          <span className="text-[15px] font-medium">Length</span>
          <span className="text-[15px] font-semibold tabular-nums">{length}</span>
        </div>
        <IosSlider
          label="Password length"
          value={[length]}
          onValueChange={(v) => setLength(v[0])}
          min={4}
          max={32}
          step={1}
        />
        <div className="flex justify-between text-[13px] text-muted-foreground tabular-nums">
          <span>4</span>
          <span>32</span>
        </div>
      </div>

      <div>
        <span className="mb-2 block text-[15px] font-medium">Characters</span>
        <div className="divide-y divide-black/[0.08] overflow-hidden rounded-[10px] bg-field dark:divide-white/[0.1]">
          {options.map((opt) => (
            <label
              key={opt.label}
              className="flex min-h-[52px] cursor-pointer items-center justify-between gap-4 px-4 py-2"
            >
              <span className="text-[17px]">
                {opt.label}
                <span className="ml-2 font-mono text-[13px] text-muted-foreground">
                  {opt.sample}
                </span>
              </span>
              <IosSwitch checked={opt.value} onCheckedChange={opt.set} />
            </label>
          ))}
        </div>
      </div>

      <StrengthMeter
        label={strength.label}
        detail={`About ${Math.round(strength.entropy)} bits of entropy.`}
      />

      <PrimaryButton onClick={generatePassword}>Generate Password</PrimaryButton>

      <OutputPanel
        label="Password"
        value={password}
        onCopy={copyToClipboard}
        copied={copied}
        placeholder="Your password will appear here."
      />
    </ToolCard>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const Index = () => {
  const [selectedTool, setSelectedTool] = useState("jwt");

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="flex-1 px-4 pb-16 sm:px-6 sm:pb-24">
        {/* Hero */}
        <section className="pt-8 pb-8 text-center sm:pt-10 sm:pb-10">
          <h1 className="text-[40px] leading-[1.1] font-semibold tracking-[-0.02em] text-balance sm:text-[56px] sm:leading-[1.07]">
            Secure Generation Tools
          </h1>
          <p className="mx-auto mt-4 max-w-[560px] text-[17px] leading-[1.47] text-pretty text-muted-foreground sm:text-[19px] sm:leading-[1.42]">
            Generate cryptographically secure secrets and passwords instantly.
          </p>
        </section>

        <TabsPrimitive.Root value={selectedTool} onValueChange={setSelectedTool}>
          {/* Segmented control */}
          <TabsPrimitive.List
            aria-label="Choose a generator"
            className="mx-auto mb-8 flex w-full max-w-[320px] rounded-[10px] bg-fill p-[3px]"
          >
            {TOOLS.map((tool) => (
              <TabsPrimitive.Trigger
                key={tool.id}
                value={tool.id}
                className={cn(
                  "h-[38px] flex-1 rounded-[8px] text-[15px] font-medium text-foreground transition-[background-color,box-shadow] duration-200",
                  "data-[state=active]:bg-segment data-[state=active]:font-semibold data-[state=active]:shadow-[0_3px_8px_rgba(0,0,0,0.12),0_3px_1px_rgba(0,0,0,0.04)]",
                  focusRing
                )}
              >
                {tool.label}
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>

          <div className="mx-auto max-w-[720px]">
            <TabsPrimitive.Content value="jwt" className="outline-none">
              <JwtSecretGenerator />
            </TabsPrimitive.Content>
            <TabsPrimitive.Content value="password" className="outline-none">
              <PasswordGenerator />
            </TabsPrimitive.Content>
          </div>
        </TabsPrimitive.Root>
      </main>

      <footer className="border-t border-separator">
        <p className="mx-auto max-w-[980px] px-4 py-6 text-center text-[12px] text-muted-foreground sm:px-6">
          CodeMint · Secure. Private. On-device.
        </p>
      </footer>
    </div>
  );
};

export default Index;
