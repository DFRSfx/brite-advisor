import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { register, login, saveSession, AuthUser } from "@/lib/auth";

type AuthMode = "register" | "login";

interface Props {
  open: boolean;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onSuccess?: (user: AuthUser) => void;
}

const SPRING = { type: "spring" as const, stiffness: 320, damping: 34, mass: 0.9 };

export function AuthModal({ open, mode, onModeChange, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || typeof document === "undefined") return null;

  const isLogin = mode === "login";

  function resetForm() {
    setName(""); setCompany(""); setEmail("");
    setPassword(""); setConfirm(""); setError(null);
  }

  function switchMode(m: AuthMode) {
    resetForm();
    onModeChange(m);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isLogin) {
      if (!name.trim()) return setError("Name is required.");
      if (password.length < 8) return setError("Password must be at least 8 characters.");
      if (password !== confirm) return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      const result = isLogin
        ? await login({ email, password })
        : await register({ name, company: company || undefined, email, password });
      saveSession(result);
      resetForm();
      onSuccess?.(result.user);
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9998] bg-[#09090b]/80"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={SPRING}
          className="pointer-events-auto relative flex w-full max-w-[1280px] h-[800px] max-h-full overflow-hidden rounded-xl border border-[#27272a] text-[#fafafa] shadow-2xl font-sans"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-[100] inline-flex h-9 w-9 items-center justify-center rounded-md text-[#a1a1aa] transition-colors hover:bg-[#27272a] hover:text-[#fafafa] md:right-8 md:top-8"
          >
            <X className="h-4 w-4" />
          </button>

          <LayoutGroup>
            {/* Form Panel */}
            <motion.div
              layout
              transition={SPRING}
              style={{ order: isLogin ? 2 : 1 }}
              className="relative flex h-full w-full items-center justify-center p-8 bg-[#09090b] lg:w-1/2 overflow-hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22 }}
                  className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]"
                >
                  <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                      {isLogin ? "Welcome back" : "Create an account"}
                    </h1>
                    <p className="text-sm text-[#a1a1aa]">
                      {isLogin
                        ? "Enter your credentials below to sign in"
                        : "Enter your details below to create your account"}
                    </p>
                  </div>

                  <form className="grid gap-4" onSubmit={handleSubmit}>
                    {!isLogin && (
                      <div className="grid grid-cols-2 gap-3">
                        <ShadInput
                          id="reg-name"
                          placeholder="Jane Doe"
                          autoComplete="name"
                          value={name}
                          onChange={setName}
                          required
                        />
                        <ShadInput
                          id="reg-company"
                          placeholder="Acme Corp"
                          value={company}
                          onChange={setCompany}
                        />
                      </div>
                    )}
                    <ShadInput
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      value={email}
                      onChange={setEmail}
                      required
                    />
                    <ShadInput
                      id="password"
                      type="password"
                      placeholder="Password"
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      value={password}
                      onChange={setPassword}
                      required
                    />
                    {!isLogin && (
                      <ShadInput
                        id="confirm"
                        type="password"
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        value={confirm}
                        onChange={setConfirm}
                        required
                      />
                    )}

                    {error && (
                      <div className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[#fafafa] px-4 py-2 text-sm font-medium text-[#09090b] shadow-xs transition-colors hover:bg-[#fafafa]/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#fafafa]/50 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isLogin ? "Sign in" : "Create account"}
                    </button>
                  </form>

                  <p className="px-8 text-center text-sm text-[#a1a1aa]">
                    By clicking continue, you agree to our{" "}
                    <a href="/terms" className="underline underline-offset-4 hover:text-[#fafafa]">Terms of Service</a>{" "}
                    and{" "}
                    <a href="/privacy" className="underline underline-offset-4 hover:text-[#fafafa]">Privacy Policy</a>.
                  </p>

                  <p className="text-center text-sm text-[#a1a1aa]">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                      type="button"
                      onClick={() => switchMode(isLogin ? "register" : "login")}
                      className="font-medium text-[#fafafa] underline underline-offset-4 hover:text-[#fafafa]/80 transition-colors"
                    >
                      {isLogin ? "Create one" : "Sign in"}
                    </button>
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Branding Panel */}
            <motion.div
              layout
              transition={SPRING}
              style={{ order: isLogin ? 1 : 2 }}
              className="relative hidden h-full w-1/2 flex-col p-10 lg:flex border-[#27272a] bg-[#151515]"
            >
              <div
                className={`absolute inset-y-0 w-px bg-[#27272a] ${isLogin ? "right-0" : "left-0"}`}
              />
              <div className="relative z-20 flex items-center text-lg font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6">
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                BRITE Advisor
              </div>
              <div className="relative z-20 mt-auto">
                <blockquote className="space-y-2">
                  <p className="text-lg leading-normal text-balance">
                    &ldquo;Answer 4 questions and receive an AI-powered architecture diagnosis tailored to your business ecosystem.&rdquo;
                  </p>
                  <footer className="text-sm text-[#a1a1aa]">&mdash; BRITE Framework</footer>
                </blockquote>
              </div>
            </motion.div>
          </LayoutGroup>
        </motion.div>
      </div>
    </>,
    document.body
  );
}

function ShadInput({
  id, type = "text", placeholder, autoComplete, autoCapitalize, autoCorrect,
  value, onChange, required,
}: {
  id: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
  autoCapitalize?: string;
  autoCorrect?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      autoCapitalize={autoCapitalize as React.HTMLAttributes<HTMLInputElement>["autoCapitalize"]}
      autoCorrect={autoCorrect}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="h-9 w-full min-w-0 rounded-md border border-[#27272a] bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-colors placeholder:text-[#a1a1aa] focus-visible:border-[#fafafa] focus-visible:ring-[3px] focus-visible:ring-[#fafafa]/50 md:text-sm"
    />
  );
}
