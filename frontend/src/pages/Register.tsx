import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { User, Mail, Lock, ShieldCheck, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Footer from "@/components/Footer";
import { useTheme } from "@/context/ThemeContext";
import loginImage from "../assets/login_signup.jpg";

export default function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ firstname, lastname, email, password }),
      });
      // if (response.ok )
      if (response.ok) {
        navigate("/");
      } else {
        const data = (await response.json()) as { message?: string };
        setError(data.message || "Registration failed.");
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
          <div className="relative md:w-[46%] min-h-[240px] md:min-h-[580px]">
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
            <h1 className="font-display text-3xl font-bold text-foreground mb-6">Create Account</h1>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="register-firstname"
                    className="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
                  >
                    First Name
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground pointer-events-none">
                      <User className="h-5 w-5" />
                    </span>
                    <Input
                      id="register-firstname"
                      type="text"
                      placeholder="Juan"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      required
                      className="h-12 pl-12 bg-muted/50 border-border focus-visible:ring-primary/40 focus-visible:bg-card transition-all"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="register-lastname"
                    className="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
                  >
                    Last Name
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground pointer-events-none">
                      <User className="h-5 w-5" />
                    </span>
                    <Input
                      id="register-lastname"
                      type="text"
                      placeholder="Dela Cruz"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      required
                      className="h-12 pl-12 bg-muted/50 border-border focus-visible:ring-primary/40 focus-visible:bg-card transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="register-email"
                  className="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground pointer-events-none">
                    <Mail className="h-5 w-5" />
                  </span>
                  <Input
                    id="register-email"
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
                  htmlFor="register-password"
                  className="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
                >
                  Password
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground pointer-events-none">
                    <Lock className="h-5 w-5" />
                  </span>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pl-12 bg-muted/50 border-border focus-visible:ring-primary/40 focus-visible:bg-card transition-all"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="register-confirm-password"
                  className="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground pointer-events-none">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-12 pl-12 bg-muted/50 border-border focus-visible:ring-primary/40 focus-visible:bg-card transition-all"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                id="register-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full py-3 text-sm font-semibold active:scale-[0.98] transition-all bg-emerald-600 hover:bg-emerald-700 text-white"
                size="lg"
              >
                {isSubmitting ? "Creating account…" : "Create Account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-semibold text-foreground underline underline-offset-2 hover:text-primary transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
