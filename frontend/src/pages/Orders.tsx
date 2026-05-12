import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useCallback } from "react";
import Footer from "@/components/Footer";
import { apiFetch } from "@/lib/api";
import { Loader2, AlertTriangle, PackageSearch, XCircle } from "lucide-react";

interface Product {
  _id: string;
  productName: string;
  description: string;
  productType: 1 | 2;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface Order {
  _id: string;
  transactionId: string;
  productId: Product;
  orderQuantity: number;
  orderStatus: 0 | 1 | 2 | 3;
  email: string;
  dateOrdered: string;
}

const STATUS_MAP: Record<number, string> = {
  0: "Pending",
  1: "Confirmed",
  2: "Cancelled",
  3: "Completed",
};

const PRODUCT_TYPE_LABELS: Record<number, string> = {
  1: "Crops",
  2: "Poultry",
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiFetch("/api/orders/mine");
      if (!res.ok) throw new Error("Failed to fetch your orders");
      const data = (await res.json()) as Order[];
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchOrders();
    document.title = "My Orders - UmaMasa";
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "All") return true;
    return STATUS_MAP[order.orderStatus] === statusFilter;
  });

  const handleCancelOrder = async (transactionId: string) => {
    try {
      setCancellingId(transactionId);
      const res = await apiFetch(`/api/orders/${transactionId}/cancel`, {
        method: "PUT",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to cancel order");
      }

      // Refresh orders after successful cancellation
      await fetchOrders();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error cancelling order");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="container flex-1 pt-8 md:pt-14 px-4 max-w-[1200px] mx-auto animate-fade-in pb-20">
        {/* Header section */}
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground mb-10 tracking-tight">
          Orders
        </h1>

        {/* Filters section */}
        <div className="overflow-x-auto pb-4 sm:pb-0 mb-4 sm:mb-0 w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ButtonGroup className="min-w-max sm:min-w-0 w-full">
            <Button
              className={`w-full rounded-full font-bold h-12 text-[14px] border-transparent shadow-none transition-all px-6 sm:px-0 ${
                statusFilter === "All"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              size="lg"
              onClick={() => setStatusFilter("All")}
            >
              All
            </Button>
            <Button
              className={`w-full rounded-full font-bold h-12 text-[14px] border-transparent shadow-none transition-all px-6 sm:px-0 ${
                statusFilter === "Pending"
                  ? "bg-amber-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              size="lg"
              onClick={() => setStatusFilter("Pending")}
            >
              Pending
            </Button>
            <Button
              className={`w-full rounded-full font-bold h-12 text-[14px] border-transparent shadow-none transition-all px-6 sm:px-0 ${
                statusFilter === "Confirmed"
                  ? "bg-blue-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              size="lg"
              onClick={() => setStatusFilter("Confirmed")}
            >
              Confirmed
            </Button>
            <Button
              className={`w-full rounded-full font-bold h-12 text-[14px] border-transparent shadow-none transition-all px-6 sm:px-0 ${
                statusFilter === "Completed"
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              size="lg"
              onClick={() => setStatusFilter("Completed")}
            >
              Completed
            </Button>
            <Button
              className={`w-full rounded-full font-bold h-12 text-[14px] border-transparent shadow-none transition-all px-6 sm:px-0 ${
                statusFilter === "Cancelled"
                  ? "bg-red-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              size="lg"
              onClick={() => setStatusFilter("Cancelled")}
            >
              Cancelled
            </Button>
          </ButtonGroup>
        </div>

        {/* Orders section */}
        <div className="flex flex-col gap-4 mt-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground font-medium animate-pulse">
                Loading your order history...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-destructive">
              <AlertTriangle className="h-10 w-10" />
              <p className="font-bold text-lg">{error}</p>
              <Button onClick={() => void fetchOrders()} variant="outline" className="rounded-full">
                Try Again
              </Button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground text-center">
              <PackageSearch className="h-12 w-12 opacity-20" />
              <p className="font-bold text-xl text-foreground">No orders found</p>
              <p className="max-w-[300px]">
                You haven't placed any orders matching this status yet.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card
                key={order._id}
                className="p-3 sm:p-5 w-full overflow-hidden border-border bg-card/50 backdrop-blur-sm shadow-sm rounded-3xl group cursor-pointer hover:shadow-xl hover:bg-card transition-all duration-300"
              >
                <CardContent className="p-0 flex flex-row gap-4 sm:gap-6">
                  {/* Image */}
                  <div className="w-[100px] sm:w-[150px] md:w-[180px] aspect-square bg-muted shrink-0 relative flex items-center justify-center overflow-hidden border border-border/50 rounded-2xl shadow-inner">
                    {order.productId.imageUrl ? (
                      <img
                        src={order.productId.imageUrl}
                        alt={order.productId.productName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 pointer-events-none opacity-20">
                        <svg
                          className="w-full h-full stroke-foreground"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <line x1="0" y1="0" x2="100" y2="100" strokeWidth="1" />
                          <line x1="100" y1="0" x2="0" y2="100" strokeWidth="1" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Left content info */}
                  <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0 py-1">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground leading-tight tracking-tight truncate">
                      {order.productId.productName}
                    </h2>
                    <p className="text-[10px] md:text-[11px] font-black text-primary uppercase tracking-[0.2em] truncate">
                      {PRODUCT_TYPE_LABELS[order.productId.productType]}
                    </p>
                    <p className="text-[14px] sm:text-[16px] font-medium mt-1">
                      <span className="text-xl sm:text-2xl font-black">
                        ₱
                        {order.productId.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <span className="text-muted-foreground ml-1">/ unit</span>
                    </p>
                    <div className="hidden sm:block flex-1"></div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">
                      Ordered on {new Date(order.dateOrdered).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Right content info */}
                  <div className="flex flex-col gap-3 items-end justify-between shrink-0 py-1">
                    {/* Top info */}
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-[10px] sm:text-[14px] font-black text-muted-foreground/50 tracking-tighter">
                        ID: #{order.transactionId.slice(-8).toUpperCase()}
                      </p>

                      {/* Status Badge */}
                      <div
                        className={`px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-2xl font-black text-[10px] sm:text-[13px] uppercase tracking-[0.15em] shadow-sm
                        ${order.orderStatus === 3 && "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"}
                        ${order.orderStatus === 0 && "bg-amber-500/10 text-amber-600 border border-amber-500/20"}
                        ${order.orderStatus === 1 && "bg-blue-500/10 text-blue-600 border border-blue-500/20"}
                        ${order.orderStatus === 2 && "bg-red-500/10 text-red-600 border border-red-500/20"}`}
                      >
                        {STATUS_MAP[order.orderStatus]}
                      </div>
                    </div>

                    {/* Bottom info */}
                    <div className="flex flex-row gap-6 sm:gap-10 justify-end items-end">
                      <div className="flex flex-col items-end gap-0.5">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em]">
                          Qty
                        </p>
                        <p className="text-xl sm:text-2xl font-black">{order.orderQuantity}</p>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.1em]">
                          Total
                        </p>
                        <p className="text-2xl sm:text-3xl font-black text-foreground">
                          ₱
                          {(order.productId.price * order.orderQuantity).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                    {order.orderStatus === 0 && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleCancelOrder(order.transactionId);
                        }}
                        disabled={cancellingId === order.transactionId}
                        variant="outline"
                        size="sm"
                        className="rounded-full mt-2 sm:mt-3 border border-red-500/30 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white dark:text-red-400 dark:border-red-500/30 dark:hover:bg-red-600 dark:hover:text-white bg-transparent h-8 sm:h-9 text-[10px] sm:text-[11px] px-4 sm:px-6 font-black tracking-[0.1em] transition-all duration-300 w-full sm:w-auto overflow-hidden group/cancel"
                      >
                        {cancellingId === order.transactionId ? (
                          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 animate-spin" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 group-hover/cancel:rotate-90 transition-transform duration-300" />
                        )}
                        CANCEL ORDER
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
