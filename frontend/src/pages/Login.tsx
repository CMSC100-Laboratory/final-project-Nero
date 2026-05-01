import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Mail, Lock, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Footer from "@/components/Footer";
import { useTheme } from "@/context/ThemeContext";
import loginImage from "../assets/login_signup.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        await checkAuth();
        navigate("/");
      } else {
        const data = (await response.json()) as { message?: string };
        setError(data.message || "Invalid email or password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-card border border-border shadow-sm hover:shadow-md transition-all z-50 text-foreground"
        title="Toggle Theme"
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5 text-amber-500" />
        )}
      </button>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[880px] bg-card rounded-3xl shadow-xl border border-border overflow-hidden flex flex-col md:flex-row animate-fade-in transition-all">
          {/* Left – Image Panel */}
          <div className="relative md:w-[46%] min-h-[240px] md:min-h-[520px]">
            <img
              src={loginImage}
              alt="Fresh green leaves"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Brand overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-wide drop-shadow-lg">
                UMAMASA
              </h2>
            </div>
          </div>

          {/* Right – Form Panel */}
          <div className="flex-1 flex flex-col justify-center px-8 md:px-14 py-10 md:py-14">
            <h1 className="font-display text-3xl font-bold text-foreground mb-8">Welcome Back</h1>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="login-email"
                  className="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground pointer-events-none">
                    <Mail className="h-5 w-5" />
                  </span>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="example@web.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 pl-12 bg-muted/50 border-border focus-visible:ring-primary/40 focus-visible:bg-card transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="login-password"
                  className="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
                >
                  Password
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground pointer-events-none">
                    <Lock className="h-5 w-5" />
                  </span>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pl-12 bg-muted/50 border-border focus-visible:ring-primary/40 focus-visible:bg-card transition-all"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                id="login-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full py-3 text-sm font-semibold active:scale-[0.98] transition-all bg-emerald-600 hover:bg-emerald-700 text-white"
                size="lg"
              >
                {isSubmitting ? "Signing in…" : "Sign In"}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              New to the market?{" "}
              <Link
                to="/register"
                className="font-semibold text-foreground underline underline-offset-2 hover:text-primary transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
