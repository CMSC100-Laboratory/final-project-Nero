import { useEffect, useState, useMemo } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import {
  ChevronDown,
  Loader2,
  Search,
  MoreHorizontal,
  Shield,
  UserX,
  UserCheck,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  userType: "admin" | "user";
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<"All" | "admin" | "user">("All");
  const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiFetch("/api/admin/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // Search
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.firstname.toLowerCase().includes(q) ||
          u.lastname.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    // Filter
    if (filterRole !== "All") {
      result = result.filter((u) => u.userType === filterRole);
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "Newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [users, filterRole, sortBy, searchQuery]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getInitials = (first: string, last: string) => {
    return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16 flex">
      <AdminSidebar />
      <main className="container pt-8 md:pt-14 px-4 sm:px-8 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 flex-1 sm:pl-[90px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            User Management
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2">
            View, filter, and manage registered members of your store.
          </p>
        </div>

        {/* Filters & Search Container */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center z-10 relative">
          <div className="flex w-full md:w-auto items-center relative group">
            <Search className="w-5 h-5 absolute left-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-[350px] bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <span className="text-sm font-semibold text-slate-400 mr-2 hidden md:block">
              {filteredAndSortedUsers.length} Users
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-100 hover:border-slate-300 transition-all outline-none focus:ring-2 focus:ring-emerald-500/20">
                  Role:{" "}
                  <span className="text-emerald-600">
                    {filterRole === "All" ? "All" : filterRole === "admin" ? "Admins" : "Users"}
                  </span>{" "}
                  <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 rounded-xl shadow-xl border-slate-100 p-1"
              >
                <DropdownMenuItem
                  className="text-sm font-semibold cursor-pointer rounded-lg focus:bg-emerald-50 focus:text-emerald-700"
                  onClick={() => setFilterRole("All")}
                >
                  All Roles
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-sm font-semibold cursor-pointer rounded-lg focus:bg-emerald-50 focus:text-emerald-700"
                  onClick={() => setFilterRole("admin")}
                >
                  Admins Only
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-sm font-semibold cursor-pointer rounded-lg focus:bg-emerald-50 focus:text-emerald-700"
                  onClick={() => setFilterRole("user")}
                >
                  Users Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-100 hover:border-slate-300 transition-all outline-none focus:ring-2 focus:ring-emerald-500/20">
                  Sort: <span className="text-emerald-600">{sortBy}</span>{" "}
                  <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 rounded-xl shadow-xl border-slate-100 p-1"
              >
                <DropdownMenuItem
                  className="text-sm font-semibold cursor-pointer rounded-lg focus:bg-emerald-50 focus:text-emerald-700"
                  onClick={() => setSortBy("Newest")}
                >
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-sm font-semibold cursor-pointer rounded-lg focus:bg-emerald-50 focus:text-emerald-700"
                  onClick={() => setSortBy("Oldest")}
                >
                  Oldest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Modern Table Container */}
        <div className="bg-white rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 overflow-hidden min-h-[400px] flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-backwards">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest w-[30%]">
                    User
                  </th>
                  <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest w-[25%]">
                    Email
                  </th>
                  <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest w-[20%]">
                    Status
                  </th>
                  <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest w-[20%]">
                    Joined
                  </th>
                  <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest w-[5%] text-right"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                      </div>
                    </td>
                  </tr>
                ) : filteredAndSortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <div className="bg-slate-50 p-6 rounded-full mb-4">
                          <UserX className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-base font-semibold text-slate-600">No users found</p>
                        <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedUsers.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 shrink-0 ring-2 ring-slate-100 group-hover:ring-emerald-100 transition-colors">
                            <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold text-xs">
                              {getInitials(u.firstname, u.lastname)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 capitalize leading-tight">
                              {u.firstname} {u.lastname}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                              #{u._id.slice(-8).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-slate-600">{u.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        {u.userType === "admin" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest">
                            <Shield className="w-3.5 h-3.5" /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest">
                            <UserCheck className="w-3.5 h-3.5" /> User
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-semibold text-slate-500">
                          {formatDate(u.createdAt)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition-colors outline-none focus:ring-2 focus:ring-emerald-500/20">
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 rounded-xl shadow-lg border-slate-100 p-1"
                          >
                            <DropdownMenuLabel className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-2 py-1.5">
                              Manage User
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-100" />
                            {u.userType !== "admin" && (
                              <DropdownMenuItem className="text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-2 py-2.5 px-3 rounded-lg focus:bg-indigo-50 focus:text-indigo-700">
                                <Shield className="h-4 w-4" /> Make Admin
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-xs font-bold text-red-600 cursor-pointer flex items-center gap-2 py-2.5 px-3 rounded-lg focus:bg-red-50 focus:text-red-700 mt-1">
                              <UserX className="h-4 w-4" /> Delete Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
