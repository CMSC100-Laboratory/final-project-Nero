import { Mail, Phone, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border/40 mt-auto">
      {/* Reduced max-width to 5xl to pull elements closer together */}
      <div className="container max-w-5xl mx-auto px-6 py-8">
        {/* Switched to a 3-column grid for predictable spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center">
          {/* Brand - Aligned Left on Desktop */}
          <div className="flex flex-col items-center md:items-start gap-1.5 md:justify-self-start">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <Leaf className="w-4 h-4 text-primary-foreground" />
              </div>
              <h2 className="font-display font-bold text-xl tracking-tight text-foreground">
                UmaMASA
              </h2>
            </Link>
            <p className="text-xs text-muted-foreground font-medium">
              Department of Agriculture Initiative
            </p>
          </div>

          {/* Quick Links - Centered */}
          <nav className="flex flex-wrap justify-center gap-6 md:justify-self-center">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Market
            </Link>
            <Link
              to="/orders"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              My Orders
            </Link>
            <Link
              to="/cart"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Cart
            </Link>
          </nav>

          {/* Contact - Aligned Right on Desktop */}
          <address className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 not-italic md:justify-self-end">
            <a
              href="tel:+630289288741"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>(02) 8928-8741</span>
            </a>
            <a
              href="mailto:info@da.gov.ph"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>info@da.gov.ph</span>
            </a>
          </address>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-xs text-muted-foreground">
            © {currentYear} UmaMASA. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
