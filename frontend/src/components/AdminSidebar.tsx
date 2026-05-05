import {
  ArchiveIcon,
  LayoutGridIcon,
  PieChartIcon,
  TruckIcon,
  User2Icon,
  ChevronLeft,
  ChevronRight,
  Leaf,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { apiFetch } from "@/lib/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
      `${firstname?.[0] || ""}${lastname?.[0] || ""}`.toUpperCase() || (
        <User2Icon className="h-4 w-4" />
      )
    );
  };

  const baseLinkStyle =
    "flex flex-row p-3.5 rounded-2xl items-center transition-all duration-300 ease-in-out font-medium mt-1";
  const inactiveStyle = "text-muted-foreground hover:bg-muted hover:text-foreground";
  const activeStyle =
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/10 font-bold";

  return (
    <aside
      className={`flex flex-col sticky left-0 top-0 h-screen z-30 border-r border-border bg-card transition-all duration-300 ease-in-out shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] shrink-0 ${isOpen ? "w-[260px]" : "w-[80px]"}`}
    >
      {/* Brand Logo */}
      <div
        className={`flex items-center h-20 shrink-0 px-4 mb-2 mt-2 ${isOpen ? "justify-start" : "justify-center"}`}
      >
        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <div className="bg-emerald-500/10 p-2 rounded-xl group-hover:bg-emerald-500/20 transition-colors shrink-0">
            <Leaf className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
          </div>
          <span
            className={`font-display font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-400 dark:to-emerald-600 tracking-tight transition-all duration-300 ${isOpen ? "opacity-100 w-auto ml-1" : "opacity-0 w-0 hidden"}`}
          >
            UmaMasa
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-1 px-3 flex-1 overflow-y-auto">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `${baseLinkStyle} ${isActive ? activeStyle : inactiveStyle}`}
        >
          <LayoutGridIcon
            className={`h-5 w-5 shrink-0 transition-colors ${isOpen ? "mr-4" : "mx-auto"}`}
          />
          <span
            className={`truncate transition-all duration-300 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"}`}
          >
            Dashboard
          </span>
        </NavLink>

        <NavLink
          to="/inventory"
          className={({ isActive }) => `${baseLinkStyle} ${isActive ? activeStyle : inactiveStyle}`}
        >
          <ArchiveIcon
            className={`h-5 w-5 shrink-0 transition-colors ${isOpen ? "mr-4" : "mx-auto"}`}
          />
          <span
            className={`truncate transition-all duration-300 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"}`}
          >
            Inventory
          </span>
        </NavLink>

        <NavLink
          to="/ordersman"
          className={({ isActive }) => `${baseLinkStyle} ${isActive ? activeStyle : inactiveStyle}`}
        >
          <TruckIcon
            className={`h-5 w-5 shrink-0 transition-colors ${isOpen ? "mr-4" : "mx-auto"}`}
          />
          <span
            className={`truncate transition-all duration-300 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"}`}
          >
            Orders
          </span>
        </NavLink>

        <NavLink
          to="/userman"
          className={({ isActive }) => `${baseLinkStyle} ${isActive ? activeStyle : inactiveStyle}`}
        >
          <User2Icon
            className={`h-5 w-5 shrink-0 transition-colors ${isOpen ? "mr-4" : "mx-auto"}`}
          />
          <span
            className={`truncate transition-all duration-300 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"}`}
          >
            Users
          </span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) => `${baseLinkStyle} ${isActive ? activeStyle : inactiveStyle}`}
        >
          <PieChartIcon
            className={`h-5 w-5 shrink-0 transition-colors ${isOpen ? "mr-4" : "mx-auto"}`}
          />
          <span
            className={`truncate transition-all duration-300 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"}`}
          >
            Analytics
          </span>
        </NavLink>
      </div>

      {/* Bottom Profile Section */}
      <div className="p-4 border-t border-border mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`flex items-center w-full gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors outline-none focus:ring-2 focus:ring-emerald-500/20 ${isOpen ? "justify-start" : "justify-center"}`}
            >
              <Avatar className="h-10 w-10 shrink-0 ring-2 ring-emerald-500/10">
                <AvatarFallback className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  {getInitials(user?.firstname, user?.lastname)}
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex flex-col flex-1 text-left overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}
              >
                <span className="text-sm font-bold text-foreground truncate w-full">
                  {user?.firstname || "Admin"} {user?.lastname || "User"}
                </span>
                <span className="text-xs font-medium text-muted-foreground truncate w-full">
                  Administrator
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-xl shadow-lg border-border mb-2"
            align={isOpen ? "start" : "center"}
            side="right"
            sideOffset={16}
          >
            <DropdownMenuLabel className="font-normal p-3 bg-muted/30 rounded-t-lg">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none text-foreground">
                  {user?.firstname || "Admin"} {user?.lastname || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground font-medium">
                  {user?.email || "admin@umamasa.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={toggleTheme}
              className="text-sm font-medium cursor-pointer flex items-center gap-2 py-2.5"
            >
              {theme === "light" ? (
                <>
                  <Moon className="h-4 w-4 text-slate-500" />
                  Dark Mode
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4 text-amber-500" />
                  Light Mode
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-sm font-bold text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer py-2.5"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Collapse Toggle Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3.5 top-8 h-7 w-7 bg-card border border-border text-muted-foreground rounded-full flex items-center justify-center hover:text-foreground hover:border-border hover:bg-muted transition-all z-50 shadow-sm"
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </aside>
  );
}
