import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Mail, Lock, Sun, Moon, ArrowRight, Loader2, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Footer from "@/components/Footer";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
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
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Unable to connect. Please check your internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden font-sans">
      {/* Theme Toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-2xl bg-card/80 backdrop-blur-md border border-border shadow-xl z-50 text-foreground"
        title="Toggle Theme"
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5 text-amber-500" />
        )}
      </motion.button>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[950px] bg-card/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-border/40 overflow-hidden flex flex-col md:flex-row transition-all duration-500"
        >
          {/* Left – Visual Panel */}
          <div className="relative md:w-[50%] min-h-[300px] md:min-h-[600px] overflow-hidden group">
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
              src={loginImage}
              alt="Nature and Agriculture"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-14">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4 text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight">
                    UmaMASA
                  </h2>
                </div>
                <p className="text-white/80 text-lg leading-relaxed max-w-sm font-medium">
                  Connecting you to the roots of nature. Fresh, local, and sustainable.
                </p>
                <div className="pt-4 flex items-center gap-2">
                  <div className="h-1 w-12 bg-white/40 rounded-full" />
                  <div className="h-1 w-4 bg-white/20 rounded-full" />
                  <div className="h-1 w-4 bg-white/20 rounded-full" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right – Form Panel */}
          <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-12 md:py-16 bg-card/20">
            <motion.div variants={itemVariants} className="mb-10">
              <h1 className="font-display text-4xl font-black text-foreground tracking-tight mb-2">
                Welcome Back
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                Please enter your details to sign in
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <Alert
                    variant="destructive"
                    className="rounded-2xl border-destructive/20 bg-destructive/10 backdrop-blur-sm"
                  >
                    <AlertDescription className="font-medium">{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants} className="space-y-2">
                <Label
                  htmlFor="login-email"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1"
                >
                  Email Address
                </Label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground transition-colors group-focus-within:text-primary">
                    <Mail className="h-5 w-5" />
                  </span>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 pl-12 bg-transparent border-border/40 rounded-2xl text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/30 focus-visible:bg-transparent focus-visible:border-primary/50 transition-all autofill:bg-transparent"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex justify-between items-end ml-1">
                  <Label
                    htmlFor="login-password"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    Password
                  </Label>
                  <Link
                    to="#"
                    className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground transition-colors group-focus-within:text-primary">
                    <Lock className="h-5 w-5" />
                  </span>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 pl-12 bg-transparent border-border/40 rounded-2xl text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/30 focus-visible:bg-transparent focus-visible:border-primary/50 transition-all autofill:bg-transparent"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4">
                <Button
                  id="login-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 group overflow-hidden relative"
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Verifying...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <span>Sign In</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </form>

            <motion.p
              variants={itemVariants}
              className="mt-10 text-center text-sm text-muted-foreground font-medium"
            >
              New to UmaMASA?{" "}
              <Link
                to="/register"
                className="font-black text-primary hover:text-primary/80 transition-colors border-b-2 border-primary/20 hover:border-primary/50 pb-0.5"
              >
                Create an account
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
