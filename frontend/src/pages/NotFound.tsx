import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center animate-fade-in">
        <div className="bg-muted p-6 rounded-full mb-6">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-extrabold text-foreground tracking-tight mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">Page Not Found</h2>
        <p className="text-muted-foreground max-w-[500px] mb-8">
          Oops! The page you are looking for doesn't exist, has been removed, or is temporarily
          unavailable.
        </p>
        <Button asChild className="rounded-full font-semibold h-12 px-8">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
      <Footer />
    </div>
  );
}
