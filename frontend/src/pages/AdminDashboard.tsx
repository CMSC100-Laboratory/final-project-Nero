import { useEffect, useState, useMemo } from "react";
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
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiFetch } from "@/lib/api";

interface Product {
  _id: string;
  productName: string;
  price: number;
}

interface Order {
  _id: string;
  transactionId: string;
  productId: Product;
  orderQuantity: number;
  orderStatus: number;
  email: string;
  createdAt: string;
}

interface User {
  _id: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesOrders, setSalesOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, ordersRes, salesRes] = await Promise.all([
          apiFetch("/api/admin/users"),
          apiFetch("/api/admin/orders"),
          apiFetch("/api/admin/sales"),
        ]);

        if (usersRes.ok) setUsers(await usersRes.json());
        if (ordersRes.ok) setOrders(await ordersRes.json());
        if (salesRes.ok) setSalesOrders(await salesRes.json());
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalSales = useMemo(() => {
    return salesOrders.reduce(
      (acc, order) => acc + (order.productId?.price || 0) * order.orderQuantity,
      0
    );
  }, [salesOrders]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => o.orderStatus === 0).length;
  }, [orders]);

  const salesChartData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const data = months.map((m) => ({ name: m, sales: 0 }));
    const currentYear = new Date().getFullYear();

    salesOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        const amount = (order.productId?.price || 0) * order.orderQuantity;
        data[monthIndex].sales += amount;
      }
    });

    return data;
  }, [salesOrders]);

  const popularProducts = useMemo(() => {
    const productStats: Record<
      string,
      { name: string; price: number; sold: number; revenue: number }
    > = {};

    salesOrders.forEach((order) => {
      if (!order.productId) return;
      const id = order.productId._id;
      if (!productStats[id]) {
        productStats[id] = {
          name: order.productId.productName,
          price: order.productId.price,
          sold: 0,
          revenue: 0,
        };
      }
      productStats[id].sold += order.orderQuantity;
      productStats[id].revenue += order.productId.price * order.orderQuantity;
    });

    return Object.values(productStats)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 4);
  }, [salesOrders]);

  const recentOrders = useMemo(() => {
    return orders.slice(0, 5);
  }, [orders]);

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 1:
        return { label: "CONFIRMED", color: "bg-indigo-50 text-indigo-700" };
      case 3:
        return { label: "COMPLETED", color: "bg-emerald-50 text-emerald-700" };
      case 2:
        return { label: "CANCELLED", color: "bg-red-50 text-red-700" };
      default:
        return { label: "PENDING", color: "bg-amber-50 text-amber-700" };
    }
  };

  const handleUpdateStatus = async (id: string, action: "confirm" | "complete" | "cancel") => {
    try {
      const res = await apiFetch(`/api/admin/orders/${id}/${action}`, {
        method: "PUT",
      });

      if (res.ok) {
        // Refresh all data
        const [usersRes, ordersRes, salesRes] = await Promise.all([
          apiFetch("/api/admin/users"),
          apiFetch("/api/admin/orders"),
          apiFetch("/api/admin/sales"),
        ]);
        if (usersRes.ok) setUsers(await usersRes.json());
        if (ordersRes.ok) setOrders(await ordersRes.json());
        if (salesRes.ok) setSalesOrders(await salesRes.json());
      } else {
        const data = await res.json();
        alert(data.message || `Failed to ${action} order`);
      }
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        </div>
      </div>
    );
  }

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
                <h3 className="text-4xl font-bold text-slate-900 mt-2">{users.length}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center text-sm font-medium text-emerald-600 mt-2">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Registered accounts</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-backwards">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Total Revenue
                </p>
                <h3 className="text-4xl font-bold text-slate-900 mt-2">
                  ₱{totalSales.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center text-sm font-medium text-emerald-600 mt-2">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Confirmed earnings</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500 fill-mode-backwards">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Pending Orders
                </p>
                <h3 className="text-4xl font-bold text-slate-900 mt-2">{pendingOrdersCount}</h3>
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

        {/* Middle Section: Monthly Sales Analytics */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700 fill-mode-backwards">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Revenue Analytics</h3>
            <div className="px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
              {new Date().getFullYear()}
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData} margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
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
                  tickFormatter={(val) => `₱${val >= 1000 ? (val / 1000).toFixed(1) + "k" : val}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    padding: "12px",
                  }}
                  formatter={(value) => [`₱${Number(value || 0).toLocaleString()}`, "Revenue"]}
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
              {popularProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                  <Package className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-sm font-medium">No sales data yet</p>
                </div>
              ) : (
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
                    {popularProducts.map((product, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="py-4 pr-4">
                          <span className="text-sm font-semibold text-slate-800 line-clamp-1">
                            {product.name}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-slate-600 font-medium">
                          ₱{product.price.toFixed(2)}
                        </td>
                        <td className="py-4 text-center">
                          <span className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                            {product.sold}
                          </span>
                        </td>
                        <td className="py-4 text-sm font-bold text-slate-900 text-right">
                          ₱{product.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
              {recentOrders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                  <Package className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-sm font-medium">No orders yet</p>
                </div>
              ) : (
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
                    {recentOrders.map((order) => {
                      const statusInfo = getStatusInfo(order.orderStatus);
                      return (
                        <tr
                          key={order._id}
                          className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group/row"
                        >
                          <td className="py-4 text-sm font-semibold text-slate-800">
                            #{order.transactionId.slice(-8).toUpperCase()}
                          </td>
                          <td className="py-4 text-sm text-slate-600 font-medium whitespace-nowrap pr-4">
                            {order.email}
                          </td>
                          <td className="py-4 text-sm font-bold text-slate-900">
                            ₱
                            {((order.productId?.price || 0) * order.orderQuantity).toLocaleString()}
                          </td>
                          <td className="py-4 text-right">
                            <span
                              className={`inline-flex items-center justify-center px-3 py-1.5 text-[11px] font-bold rounded-full uppercase tracking-widest ${statusInfo.color}`}
                            >
                              {statusInfo.label}
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
                                {order.orderStatus === 0 && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(order._id, "confirm")}
                                    className="text-xs font-medium cursor-pointer flex items-center gap-2 py-2"
                                  >
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    Mark as Confirmed
                                  </DropdownMenuItem>
                                )}
                                {order.orderStatus === 1 && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(order._id, "complete")}
                                    className="text-xs font-medium cursor-pointer flex items-center gap-2 py-2"
                                  >
                                    <Truck className="h-4 w-4 text-blue-500" />
                                    Mark as Completed
                                  </DropdownMenuItem>
                                )}
                                {order.orderStatus < 2 && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleUpdateStatus(order._id, "cancel")}
                                      className="text-xs font-medium cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-700 focus:bg-red-50 py-2"
                                    >
                                      <XCircle className="h-4 w-4" />
                                      Cancel Order
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
