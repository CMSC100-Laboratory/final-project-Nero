import { useEffect, useState, useMemo } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, Package, ShoppingCart, Loader2, ArrowUpDown } from "lucide-react";
import { apiFetch } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Product {
  _id: string;
  productName: string;
  productType: 1 | 2;
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

type TimePeriod = "WEEK" | "MONTH" | "YEAR";
type ProductTypeFilter = "all" | "1" | "2";
type SortField = "qtySold" | "totalSales" | "productName";
type SortDirection = "asc" | "desc";

interface ProductSalesRow {
  productId: string;
  productName: string;
  productType: 1 | 2;
  qtySold: number;
  totalSales: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const PRODUCT_TYPE_LABELS: Record<number, string> = { 1: "Crops", 2: "Poultry" };

function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function SalesReport() {
  const [salesOrders, setSalesOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("MONTH");
  const [typeFilter, setTypeFilter] = useState<ProductTypeFilter>("all");
  const [sortField, setSortField] = useState<SortField>("qtySold");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // ── Fetch sales data ──────────────────────────────────────────────────────

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiFetch("/api/admin/sales");
        if (res.ok) setSalesOrders(await res.json());
      } catch (error) {
        console.error("Failed to fetch sales data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── KPI calculations ─────────────────────────────────────────────────────

  const totalSales = useMemo(() => {
    return salesOrders.reduce(
      (acc, order) => acc + (order.productId?.price || 0) * order.orderQuantity,
      0
    );
  }, [salesOrders]);

  const totalProductsSold = useMemo(() => {
    return salesOrders.reduce((acc, order) => acc + order.orderQuantity, 0);
  }, [salesOrders]);

  const totalTransactions = useMemo(() => {
    const txIds = new Set(salesOrders.map((o) => o.transactionId));
    return txIds.size;
  }, [salesOrders]);

  // ── Chart data builder ────────────────────────────────────────────────────

  const chartData = useMemo(() => {
    const currentYear = new Date().getFullYear();

    if (timePeriod === "MONTH") {
      const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
      const data = months.map((m) => ({ name: m, sales: 0 }));

      salesOrders.forEach((order) => {
        const date = new Date(order.createdAt);
        if (date.getFullYear() === currentYear) {
          data[date.getMonth()].sales += (order.productId?.price || 0) * order.orderQuantity;
        }
      });
      return data;
    }

    if (timePeriod === "WEEK") {
      const now = new Date();
      // Show last 12 weeks
      const weeks: { name: string; sales: number; week: number; year: number }[] = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i * 7);
        const wk = getWeekNumber(d);
        weeks.push({ name: `W${wk}`, sales: 0, week: wk, year: d.getFullYear() });
      }

      salesOrders.forEach((order) => {
        const date = new Date(order.createdAt);
        const orderWeek = getWeekNumber(date);
        const orderYear = date.getFullYear();
        const match = weeks.find((w) => w.week === orderWeek && w.year === orderYear);
        if (match) {
          match.sales += (order.productId?.price || 0) * order.orderQuantity;
        }
      });

      return weeks.map(({ name, sales }) => ({ name, sales }));
    }

    // YEAR — group by year, always include current year
    const yearMap: Record<number, number> = {};
    yearMap[currentYear] = 0; // ensure current year always present
    salesOrders.forEach((order) => {
      const year = new Date(order.createdAt).getFullYear();
      yearMap[year] = (yearMap[year] || 0) + (order.productId?.price || 0) * order.orderQuantity;
    });

    return Object.keys(yearMap)
      .sort()
      .map((y) => ({ name: y, sales: yearMap[Number(y)] }));
  }, [salesOrders, timePeriod]);

  // ── Product‐level aggregation ─────────────────────────────────────────────

  const productRows = useMemo(() => {
    const map: Record<string, ProductSalesRow> = {};

    salesOrders.forEach((order) => {
      if (!order.productId) return;
      const id = order.productId._id;
      if (!map[id]) {
        map[id] = {
          productId: id,
          productName: order.productId.productName,
          productType: order.productId.productType,
          qtySold: 0,
          totalSales: 0,
        };
      }
      map[id].qtySold += order.orderQuantity;
      map[id].totalSales += order.productId.price * order.orderQuantity;
    });

    let rows = Object.values(map);

    // Apply type filter
    if (typeFilter !== "all") {
      rows = rows.filter((r) => String(r.productType) === typeFilter);
    }

    // Apply sort
    rows.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDirection === "asc"
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });

    return rows;
  }, [salesOrders, typeFilter, sortField, sortDirection]);

  // ── Loading state ─────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="container pt-8 md:pt-14 px-4 sm:px-8 max-w-[1200px] mx-auto animate-fade-in flex-1 pb-16">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Revenue Analytics
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-2">
            Track your store performance, sales breakdown, and product revenue.
          </p>
        </div>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Sales */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-border flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-backwards">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Sales
              </p>
              <h3 className="text-4xl font-bold text-foreground mt-2">
                ₱
                {totalSales.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-2">
            <span>Confirmed &amp; completed revenue</span>
          </div>
        </div>

        {/* Products Sold */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-border flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-backwards">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Products Sold
              </p>
              <h3 className="text-4xl font-bold text-foreground mt-2">
                {totalProductsSold.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-sm font-medium text-muted-foreground mt-2">
            <span>Total units across all orders</span>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-card rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-border flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500 fill-mode-backwards">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Transactions
              </p>
              <h3 className="text-4xl font-bold text-foreground mt-2">
                {totalTransactions.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-2xl group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-sm font-medium text-muted-foreground mt-2">
            <span>Unique completed transactions</span>
          </div>
        </div>
      </div>

      {/* ── Revenue Analytics Area Chart ────────────────────────────────── */}
      <div className="bg-card rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-border mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700 fill-mode-backwards">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold text-foreground">Revenue Analytics</h3>
            <Select value={timePeriod} onValueChange={(v) => setTimePeriod(v as TimePeriod)}>
              <SelectTrigger
                id="time-period-select"
                className="w-[110px] h-8 text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="WEEK">Week</SelectItem>
                <SelectItem value="MONTH">Month</SelectItem>
                <SelectItem value="YEAR">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="px-4 py-1.5 bg-muted text-muted-foreground text-xs font-semibold rounded-full border border-border">
            {new Date().getFullYear()}
          </div>
        </div>

        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontWeight: 500 }}
                dx={-10}
                tickFormatter={(val) => `₱${val >= 1000 ? (val / 1000).toFixed(1) + "k" : val}`}
              />
              <Tooltip
                cursor={{
                  stroke: "hsl(var(--muted-foreground))",
                  strokeWidth: 1,
                  strokeDasharray: "none",
                }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderRadius: "12px",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
                  padding: "10px 14px",
                }}
                itemStyle={{ color: "hsl(var(--foreground))", fontWeight: 600, fontSize: 13 }}
                labelStyle={{
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: 13,
                  marginBottom: "4px",
                }}
                formatter={(value) => [
                  `₱${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 0 })}`,
                  "Revenue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#areaGradient)"
                activeDot={{
                  r: 7,
                  strokeWidth: 3,
                  stroke: "hsl(var(--card))",
                  fill: "#10b981",
                }}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Sales per Product Table ────────────────────────────────────── */}
      <div className="bg-card rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-border animate-in fade-in slide-in-from-bottom-8 duration-700 delay-1000 fill-mode-backwards">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-lg font-bold text-foreground">Sales per product</h3>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter by product type */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Filter by
              </span>
              <Select
                value={typeFilter}
                onValueChange={(v) => setTypeFilter(v as ProductTypeFilter)}
              >
                <SelectTrigger
                  id="type-filter-select"
                  className="w-[120px] h-8 text-sm font-medium rounded-lg"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">None</SelectItem>
                  <SelectItem value="1">Crops</SelectItem>
                  <SelectItem value="2">Poultry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort by */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Sort by
              </span>
              <Select
                value={`${sortField}-${sortDirection}`}
                onValueChange={(v) => {
                  const [field, dir] = v.split("-");
                  setSortField(field as SortField);
                  setSortDirection(dir as SortDirection);
                }}
              >
                <SelectTrigger
                  id="sort-field-select"
                  className="w-[165px] h-8 text-sm font-medium rounded-lg"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="qtySold-desc">Qty sold (Desc.)</SelectItem>
                  <SelectItem value="qtySold-asc">Qty sold (Asc.)</SelectItem>
                  <SelectItem value="totalSales-desc">Total sales (Desc.)</SelectItem>
                  <SelectItem value="totalSales-asc">Total sales (Asc.)</SelectItem>
                  <SelectItem value="productName-asc">Name A–Z</SelectItem>
                  <SelectItem value="productName-desc">Name Z–A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {productRows.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-muted-foreground py-16">
              <Package className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm font-medium">No sales data to display</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-border bg-muted/30">
                  <th className="py-3.5 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Product ID
                  </th>
                  <th className="py-3.5 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Product name
                  </th>
                  <th className="py-3.5 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Product type
                  </th>
                  <th className="py-3.5 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">
                    <button
                      id="sort-qty-btn"
                      className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                      onClick={() => {
                        if (sortField === "qtySold") {
                          setSortDirection((d) => (d === "desc" ? "asc" : "desc"));
                        } else {
                          setSortField("qtySold");
                          setSortDirection("desc");
                        }
                      }}
                    >
                      Qty sold
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
                    <button
                      id="sort-total-btn"
                      className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                      onClick={() => {
                        if (sortField === "totalSales") {
                          setSortDirection((d) => (d === "desc" ? "asc" : "desc"));
                        } else {
                          setSortField("totalSales");
                          setSortDirection("desc");
                        }
                      }}
                    >
                      Total sales
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {productRows.map((row, idx) => (
                  <tr
                    key={row.productId}
                    className={`border-b border-border/40 hover:bg-muted/30 transition-colors group ${
                      idx % 2 === 0 ? "bg-card" : "bg-muted/10"
                    }`}
                  >
                    <td className="py-3.5 px-4 text-sm font-mono font-semibold text-muted-foreground">
                      #{row.productId.slice(-10).toUpperCase()}
                    </td>
                    <td className="py-3.5 px-4 text-sm font-semibold text-foreground">
                      {row.productName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${
                          row.productType === 1
                            ? "bg-lime-500/10 text-lime-700 dark:text-lime-400"
                            : "bg-orange-500/10 text-orange-700 dark:text-orange-400"
                        }`}
                      >
                        {PRODUCT_TYPE_LABELS[row.productType]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-sm font-bold text-foreground bg-muted px-3 py-1 rounded-lg">
                        {row.qtySold}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sm font-bold text-foreground text-right">
                      ₱
                      {row.totalSales.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/20">
                  <td
                    colSpan={3}
                    className="py-3.5 px-4 text-sm font-bold text-foreground uppercase tracking-wider"
                  >
                    Totals
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-sm font-extrabold text-foreground">
                      {productRows.reduce((s, r) => s + r.qtySold, 0)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm font-extrabold text-foreground text-right">
                    ₱
                    {productRows
                      .reduce((s, r) => s + r.totalSales, 0)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
