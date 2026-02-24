import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, RefreshCw, Shield } from "lucide-react";
import { toast } from "sonner";

const JwtSecretGenerator = () => {
  const [bits, setBits] = useState("256");
  const [encoding, setEncoding] = useState("base64");
  const [secret, setSecret] = useState("");

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

  const copyToClipboard = () => {
    if (!secret) return;
    navigator.clipboard.writeText(secret);
    toast.success("JWT secret copied to clipboard!");
  };

  return (
    <Card className="glow-border hover:glow-border-active transition-shadow duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-display text-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          JWT Secret Generator
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">
              Bit Length
            </Label>

            <Select value={bits} onValueChange={setBits}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="128">128-bit</SelectItem>
                <SelectItem value="256">256-bit</SelectItem>
                <SelectItem value="384">384-bit</SelectItem>
                <SelectItem value="512">512-bit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">
              Encoding
            </Label>

            <Select value={encoding} onValueChange={setEncoding}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="base64">Base64</SelectItem>
                <SelectItem value="base64url">Base64URL</SelectItem>
                <SelectItem value="hex">Hexadecimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={generateSecret} className="w-full gap-2">
          <RefreshCw className="h-4 w-4" />
          Generate Secret
        </Button>

        {secret && (
          <div
            className="group relative cursor-pointer rounded-lg bg-secondary p-4 transition-colors hover:bg-secondary/80"
            onClick={copyToClipboard}
          >
            <p className="break-all font-mono text-sm leading-relaxed text-foreground">
              {secret}
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

export default JwtSecretGenerator;