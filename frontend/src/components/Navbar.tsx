import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, LogOut, Store, Package, ShoppingCart, Leaf } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
      navigate("/login");
      window.location.reload();
    } catch {
      console.error("Logout failed");
    }
  };

  const getInitials = (firstname?: string, lastname?: string) => {
    return (
      `${firstname?.[0] || ""}${lastname?.[0] || ""}`.toUpperCase() || <User className="h-4 w-4" />
    );
  };

  if (user?.userType === "admin") {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl shadow-sm">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Left - Brand */}
        <div className="flex shrink-0 items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary/10 p-1.5 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Leaf className="h-5 w-5 text-primary" strokeWidth={2.5} />
            </div>
            <span className="inline-block font-display font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600 tracking-tight">
              UmaMasa
            </span>
          </Link>
        </div>

        {isAuthenticated ? (
          <>
            {/* Center - Interactive Search (Only for users) */}
            {user?.userType === "user" && (
              <div className="hidden flex-1 md:flex justify-center px-6">
                <div className="relative w-full max-w-md transition-all duration-300 focus-within:max-w-lg group">
                  <Input
                    type="search"
                    placeholder="Search fresh produce..."
                    className="w-full rounded-full bg-muted/50 border-transparent pl-5 pr-12 h-10 focus-visible:bg-background focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-sm focus-within:shadow-md"
                  />
                  <button className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-transform active:scale-95">
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* If Admin, just spacer */}
            {user?.userType === "admin" && <div className="hidden flex-1 md:flex"></div>}

            {/* Right - Links & Profile */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-7 text-[13px] font-bold tracking-wider text-muted-foreground uppercase">
                {user?.userType === "user" ? (
                  <>
                    <Link
                      to="/"
                      className="group flex items-center gap-1.5 hover:text-primary transition-colors relative py-1"
                    >
                      <Store className="h-4 w-4 mb-0.5 text-primary/70 group-hover:text-primary transition-colors" />
                      <span>Market</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
                    </Link>
                    <Link
                      to="/orders"
                      className="group flex items-center gap-1.5 hover:text-primary transition-colors relative py-1"
                    >
                      <Package className="h-4 w-4 mb-0.5 text-primary/70 group-hover:text-primary transition-colors" />
                      <span>Orders</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
                    </Link>
                    <Link
                      to="/cart"
                      className="group flex items-center gap-1.5 hover:text-primary transition-colors relative py-1"
                    >
                      <div className="relative">
                        <ShoppingCart className="h-4 w-4 mb-0.5 text-primary/70 group-hover:text-primary transition-colors" />
                        {totalItems > 0 && (
                          <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                            {totalItems > 99 ? "99+" : totalItems}
                          </span>
                        )}
                      </div>
                      <span>Cart</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className="group flex items-center gap-1.5 hover:text-primary transition-colors relative py-1"
                    >
                      <Store className="h-4 w-4 mb-0.5 text-primary/70 group-hover:text-primary transition-colors" />
                      <span>Dashboard</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
                    </Link>
                    <Link
                      to="/inventory"
                      className="group flex items-center gap-1.5 hover:text-primary transition-colors relative py-1"
                    >
                      <Package className="h-4 w-4 mb-0.5 text-primary/70 group-hover:text-primary transition-colors" />
                      <span>Inventory</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
                    </Link>
                  </>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 overflow-hidden ring-2 ring-primary/10 hover:ring-primary/30 transition-all"
                  >
                    <Avatar className="h-full w-full">
                      <AvatarFallback className="bg-gradient-to-br from-primary/10 to-emerald-500/10 text-primary font-semibold text-sm">
                        {getInitials(user?.firstname, user?.lastname)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60 p-2" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-2">
                    <div className="flex flex-col space-y-1.5">
                      <p className="text-sm font-semibold leading-none text-foreground">
                        {user?.firstname} {user?.lastname}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground font-medium">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />

                  {/* Mobile Links */}
                  <div className="md:hidden">
                    {user?.userType === "user" ? (
                      <>
                        <DropdownMenuItem className="py-2.5 cursor-pointer rounded-md" asChild>
                          <Link to="/" className="flex items-center gap-2">
                            <Store className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Market</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="py-2.5 cursor-pointer rounded-md" asChild>
                          <Link to="/orders" className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Orders</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="py-2.5 cursor-pointer rounded-md" asChild>
                          <Link to="/cart" className="flex items-center gap-2">
                            <div className="relative">
                              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                              {totalItems > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 px-0.5 bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                                  {totalItems > 99 ? "99+" : totalItems}
                                </span>
                              )}
                            </div>
                            <span className="font-medium">Cart</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem className="py-2.5 cursor-pointer rounded-md" asChild>
                          <Link to="/dashboard" className="flex items-center gap-2">
                            <Store className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="py-2.5 cursor-pointer rounded-md" asChild>
                          <Link to="/inventory" className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Inventory</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="my-1" />
                  </div>

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-md mt-1 transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="font-semibold">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        ) : (
          <div className="flex gap-3 items-center">
            <Button variant="ghost" className="font-semibold" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button
              asChild
              className="rounded-xl font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
