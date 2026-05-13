import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

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
      <main className="flex-1 w-full flex flex-col">
        {/* HERO SECTION */}
        <section className="relative w-full pt-16 flex flex-col items-center">
          {/* Split Background */}
          <div className="absolute inset-0 flex w-full h-full z-0">
            <div className="w-[55%] h-full bg-emerald-50 dark:bg-emerald-950/40" />
            <div className="w-[45%] h-full bg-amber-50 dark:bg-amber-950/20" />
          </div>

          {/* Text Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto mt-8 md:mt-16">
            <div className="mb-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-[2px] border-emerald-800 dark:border-emerald-200 flex items-center justify-center mb-4 text-emerald-900 dark:text-emerald-100">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-center leading-tight">
                  Farmer
                  <br />
                  Approved
                </span>
              </div>
              <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-emerald-950 dark:text-emerald-50 leading-[0.9]">
                Produce <br /> Perfected
              </h1>
            </div>

            <p className="text-lg md:text-xl font-medium text-emerald-900/80 dark:text-emerald-100/80 mb-8 max-w-2xl px-4">
              UmaMasa provides farm-fresh, premium quality crops at a jaw-dropping price.
            </p>

            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-none px-12 py-7 text-sm sm:text-base tracking-widest uppercase font-bold mb-12 border-none"
            >
              <Link to="/register">Shop Now</Link>
            </Button>
          </div>

          {/* Product Layout/Image */}
          <div className="w-full max-w-4xl mx-auto px-4 z-10 -mb-2 relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200"
              alt="Fresh local produce"
              className="w-full h-[350px] object-cover border-[12px] border-white dark:border-background shadow-2xl bg-white"
            />
          </div>
        </section>

        {/* GREEN BANNER */}
        <section className="w-full bg-emerald-800 dark:bg-emerald-950 py-6 md:py-8 z-20 relative border-y border-emerald-700/50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-emerald-600/50 text-white text-center">
              <div className="flex-1 flex flex-col w-full py-2">
                <span className="text-[10px] sm:text-xs font-bold opacity-90 tracking-widest mb-1 underline underline-offset-4 decoration-emerald-500/50 text-emerald-100">
                  Top Local Marketplace
                </span>
                <span className="font-black text-lg sm:text-xl uppercase tracking-wider text-emerald-50">
                  Ask The Farmers
                </span>
              </div>
              <div className="flex-1 flex flex-col w-full py-2">
                <span className="text-[10px] sm:text-xs font-bold opacity-90 tracking-widest mb-1 underline underline-offset-4 decoration-emerald-500/50 text-emerald-100">
                  Best Alternative to Retail
                </span>
                <span className="font-black text-lg sm:text-xl uppercase tracking-wider text-emerald-50">
                  Direct Access
                </span>
              </div>
              <div className="flex-1 flex flex-col w-full py-2">
                <span className="text-[10px] sm:text-xs font-bold opacity-90 tracking-widest mb-1 underline underline-offset-4 decoration-emerald-500/50 text-emerald-100">
                  2026 Sustainability Standard
                </span>
                <span className="font-black text-lg sm:text-xl uppercase tracking-wider text-emerald-50">
                  Zero Waste
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* DETAILS SECTION */}
        <section className="w-full relative bg-background py-20 md:py-40 px-4 overflow-hidden">
          {/* Angle Background */}
          <div className="absolute right-0 bottom-[-10%] top-[40%] md:top-[20%] w-[150%] md:w-[65%] bg-emerald-50 dark:bg-emerald-900/20 transform -skew-y-12 origin-bottom-right z-0 border-t-[20px] border-emerald-100 dark:border-emerald-800/20" />

          <div className="container mx-auto max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Left Text */}
            <div className="flex flex-col items-start pt-10 md:pt-0 pb-10 md:pb-0">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-emerald-950 dark:text-emerald-50 leading-[1.0] mb-8">
                Maximum Fresh. <br />
                Fraction of the price.
              </h2>
              <Button
                asChild
                className="bg-amber-500 hover:bg-amber-600 text-white rounded-none px-12 py-8 text-sm sm:text-base tracking-widest uppercase font-bold border-none"
              >
                <Link to="/register">Shop UmaMasa</Link>
              </Button>
            </div>

            {/* Right Image with Callouts */}
            <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800"
                alt="Organic box"
                className="w-[85%] h-[110%] object-cover shadow-2xl relative z-10 -rotate-3"
              />

              {/* Callouts */}
              <div className="absolute top-[10%] left-[5%] md:left-[-5%] z-20 flex items-center gap-3 bg-transparent">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                  <Check className="w-3 h-3" strokeWidth={4} />
                </div>
                <span className="font-black text-sm md:text-lg uppercase tracking-widest text-emerald-950 dark:text-emerald-50">
                  Organic Harvest
                </span>
              </div>

              <div className="absolute top-[40%] right-[0%] md:right-[-10%] z-20 flex items-center gap-3 bg-transparent">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                  <Check className="w-3 h-3" strokeWidth={4} />
                </div>
                <span className="font-black text-sm md:text-lg uppercase tracking-widest text-emerald-950 dark:text-emerald-50">
                  No Middlemen
                </span>
              </div>

              <div className="absolute bottom-[20%] left-[10%] md:left-[5%] z-20 flex items-center gap-3 bg-transparent">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                  <Check className="w-3 h-3" strokeWidth={4} />
                </div>
                <span className="font-black text-sm md:text-lg uppercase tracking-widest text-emerald-950 dark:text-emerald-50">
                  Delivered Fast
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
