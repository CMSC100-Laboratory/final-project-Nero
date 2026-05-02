import { useEffect, useState, useCallback } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch } from "@/lib/api";
import { Loader2, CheckCircle2, XCircle, Truck, MoreHorizontal, Hash, Tag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

// for getting the status chips
const getStatusInfo = (status: number) => {
  switch (status) {
    case 1:
      return {
        label: "CONFIRMED",
        color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      };
    case 3:
      return {
        label: "COMPLETED",
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      };
    case 2:
      return { label: "CANCELLED", color: "bg-red-500/10 text-red-600 dark:text-red-400" };
    default:
      return { label: "PENDING", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" };
  }
};

// convert full date string to month day year format
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiFetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (id: string, action: "confirm" | "complete" | "cancel") => {
    try {
      const res = await apiFetch(`/api/admin/orders/${id}/${action}`, {
        method: "PUT",
      });

      if (res.ok) {
        void fetchOrders();
      } else {
        const data = await res.json();
        alert(data.message || `Failed to ${action} order`);
      }
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="container pt-8 md:pt-14 px-4 max-w-[1200px] mx-auto animate-fade-in flex-1 sm:pl-[90px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-2">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Orders
            </h1>
            <p className="text-sm font-medium text-muted-foreground mt-2">
              View and manage orders made by buyers
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="mt-10 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="font-medium">Loading orders…</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Order ID
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Buyer Email
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Date Ordered
                  </TableHead>
                  {/* <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Product ID
                  </TableHead> */}
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Product Name
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Quantity
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Total Price
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground w-[100px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order._id} className="group">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {order.transactionId.slice(-8).toUpperCase() + "..."}
                      </TableCell>
                      <TableCell className="font-semibold text-sm">{order.email}</TableCell>
                      <TableCell className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      {/* <TableCell className="font-mono text-xs text-muted-foreground">
                        {order.productId?._id.slice(-8).toUpperCase() + "..." || "N/A"}
                      </TableCell> */}
                      <TableCell className="text-sm font-medium">
                        {order.productId?.productName || "Deleted Product"}
                      </TableCell>
                      <TableCell className="text-sm">{order.orderQuantity}</TableCell>
                      <TableCell className="text-sm font-medium">
                        ₱{((order.productId?.price || 0) * order.orderQuantity).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusInfo(order.orderStatus).color}`}
                        >
                          {getStatusInfo(order.orderStatus).label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground outline-none">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 rounded-xl shadow-lg border-border"
                          >
                            <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                              Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {order.orderStatus === 0 && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(order._id, "confirm")}
                                className="text-xs font-medium cursor-pointer flex items-center gap-2 py-2"
                              >
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                Confirm Order
                              </DropdownMenuItem>
                            )}
                            {order.orderStatus === 1 && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(order._id, "complete")}
                                className="text-xs font-medium cursor-pointer flex items-center gap-2 py-2"
                              >
                                <Truck className="h-4 w-4 text-blue-500" />
                                Mark Completed
                              </DropdownMenuItem>
                            )}
                            {order.orderStatus < 2 && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(order._id, "cancel")}
                                className="text-xs font-medium cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-700 py-2"
                              >
                                <XCircle className="h-4 w-4" />
                                Cancel Order
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() =>
                                void navigator.clipboard.writeText(order.transactionId)
                              }
                              className="text-xs font-medium cursor-pointer flex items-center gap-2 py-2"
                            >
                              <Hash className="h-4 w-4 text-blue-500" />
                              Copy Order ID
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                void navigator.clipboard.writeText(order.productId?._id || "")
                              }
                              className="text-xs font-medium cursor-pointer flex items-center gap-2 py-2"
                            >
                              <Tag className="h-4 w-4 text-blue-500" />
                              Copy Product ID
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
}
