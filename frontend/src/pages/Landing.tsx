import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, ShieldCheck, ShoppingCart, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Landing() {
  const { isAuthenticated, user } = useAuth();

  // If a logged-in user visits the root page, comfortably redirect them to their home base
  if (isAuthenticated && user?.userType === "user") {
    return <Navigate to="/market" replace />;
  } else if (isAuthenticated && user?.userType === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Animated Background blob */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[50%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

        <div className="container max-w-[1200px] mx-auto px-4 md:px-8 py-24 md:py-32 flex flex-col items-center text-center relative z-10">
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest mb-6 inline-flex items-center gap-2">
            <Leaf className="w-4 h-4" /> Fresh Local Produce
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold text-foreground tracking-tight leading-[1.1] mb-8 max-w-4xl">
            Connecting local farmers <br className="hidden md:block" /> directly to you.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium mb-12">
            Bypass the middleman. Access fresh crops and premium poultry straight from the source.
            Affordable prices for you, better margins for farmers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 h-14 text-base font-bold shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto overflow-hidden group"
            >
              <Link to="/register">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-14 text-base font-bold bg-background/50 backdrop-blur-sm border-2 hover:bg-muted/50 transition-all w-full sm:w-auto"
            >
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full bg-muted/30 border-t border-border/50 flex-1 relative z-10">
          <div className="container max-w-[1200px] mx-auto px-4 md:px-8 py-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
                Why choose UmaMasa?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Leaf className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Freshness Guaranteed</h3>
                <p className="text-muted-foreground font-medium">
                  Because we connect you directly to farmers, you receive crops and poultry at peak
                  freshness.
                </p>
              </div>

              <div className="bg-card p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShoppingCart className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Fair Market Prices</h3>
                <p className="text-muted-foreground font-medium">
                  No artificial markups from retailers. Buy what you need, paying a fair price
                  straight to the producer.
                </p>
              </div>

              <div className="bg-card p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Secure Transactions</h3>
                <p className="text-muted-foreground font-medium">
                  Track your orders from processing to completion, with full transparency on every
                  transaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
