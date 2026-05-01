import AdminSidebar from "@/components/AdminSidebar";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  DollarSign,
  Package,
  ArrowUpRight,
  TrendingUp,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Truck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const salesData = [
  { name: "Jan", sales: 12000 },
  { name: "Feb", sales: 15000 },
  { name: "Mar", sales: 13000 },
  { name: "Apr", sales: 18000 },
  { name: "May", sales: 20607 },
  { name: "Jun", sales: 19000 },
  { name: "Jul", sales: 22000 },
];

const popularProducts = [
  {
    id: 1,
    name: "Premium Organic Fertilizer",
    price: "₱150.00",
    totalSold: 124,
    totalSales: "₱18,600.00",
  },
  { id: 2, name: "Tomato Seeds (Pack)", price: "₱45.00", totalSold: 89, totalSales: "₱4,005.00" },
  { id: 3, name: "Garden Trowel", price: "₱120.00", totalSold: 67, totalSales: "₱8,040.00" },
  { id: 4, name: "Poultry Feed 1kg", price: "₱90.00", totalSold: 210, totalSales: "₱18,900.00" },
];

const recentOrders = [
  {
    id: "#ORD-7392",
    buyer: "Maria Clara",
    price: "₱450.00",
    status: "PENDING",
    statusColor: "bg-amber-100 text-amber-700",
  },
  {
    id: "#ORD-7391",
    buyer: "Juan Dela Cruz",
    price: "₱1,200.00",
    status: "COMPLETED",
    statusColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "#ORD-7390",
    buyer: "Pedro Penduko",
    price: "₱320.00",
    status: "CANCELLED",
    statusColor: "bg-red-100 text-red-700",
  },
  {
    id: "#ORD-7389",
    buyer: "Leonor Rivera",
    price: "₱890.00",
    status: "COMPLETED",
    statusColor: "bg-emerald-100 text-emerald-700",
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16 flex">
      <AdminSidebar />
      <main className="container pt-8 md:pt-14 px-4 sm:px-8 max-w-[1200px] mx-auto animate-fade-in flex-1 sm:pl-[90px]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-backwards">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Total Users
                </p>
                <h3 className="text-4xl font-bold text-slate-900 mt-2">308</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center text-sm font-medium text-emerald-600 mt-2">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-backwards">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Total Sales
                </p>
                <h3 className="text-4xl font-bold text-slate-900 mt-2">₱20,607</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center text-sm font-medium text-emerald-600 mt-2">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+8% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500 fill-mode-backwards">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Pending Orders
                </p>
                <h3 className="text-4xl font-bold text-slate-900 mt-2">3</h3>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center text-sm font-medium text-slate-500 mt-2">
              <span>Needs your attention</span>
            </div>
          </div>
        </div>

        {/* Middle Section: Monthly Sales Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700 fill-mode-backwards">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Revenue Analytics</h3>
            <div className="px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
              This Year
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }}
                  dx={-10}
                  tickFormatter={(val) => `₱${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    padding: "12px",
                  }}
                  formatter={(value: number) => [`₱${Number(value).toLocaleString()}`, "Sales"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#10b981"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Section: Popular Products & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-1000 fill-mode-backwards">
          {/* Popular Products */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Popular Products</h3>
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold flex items-center transition-colors">
                View All <ArrowUpRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="pb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="pb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                      Sold
                    </th>
                    <th className="pb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {popularProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-4 pr-4">
                        <span className="text-sm font-semibold text-slate-800 line-clamp-1">
                          {product.name}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-slate-600 font-medium">{product.price}</td>
                      <td className="py-4 text-center">
                        <span className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                          {product.totalSold}
                        </span>
                      </td>
                      <td className="py-4 text-sm font-bold text-slate-900 text-right">
                        {product.totalSales}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold flex items-center transition-colors">
                View All <ArrowUpRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="pb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="pb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="pb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                      Status
                    </th>
                    <th className="pb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group/row"
                    >
                      <td className="py-4 text-sm font-semibold text-slate-800">{order.id}</td>
                      <td className="py-4 text-sm text-slate-600 font-medium whitespace-nowrap pr-4">
                        {order.buyer}
                      </td>
                      <td className="py-4 text-sm font-bold text-slate-900">{order.price}</td>
                      <td className="py-4 text-right">
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1.5 text-[11px] font-bold rounded-full uppercase tracking-widest ${order.statusColor}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-right pl-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 opacity-0 group-hover/row:opacity-100 hover:bg-slate-200/50 rounded-full transition-all text-slate-400 hover:text-slate-600 focus:opacity-100 outline-none">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 rounded-xl shadow-lg border-slate-100"
                          >
                            <DropdownMenuLabel className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                              Quick Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs font-medium cursor-pointer flex items-center gap-2 py-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              Mark as Confirmed
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-medium cursor-pointer flex items-center gap-2 py-2">
                              <Truck className="h-4 w-4 text-blue-500" />
                              Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs font-medium cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-700 focus:bg-red-50 py-2">
                              <XCircle className="h-4 w-4" />
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
