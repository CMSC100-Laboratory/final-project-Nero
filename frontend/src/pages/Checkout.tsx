import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  MapPin,
  Banknote,
  Package,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  Clock,
  ChevronRight,
} from "lucide-react";
import Footer from "@/components/Footer";

export default function Checkout() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isPlacing, setIsPlacing] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [orderError, setOrderError] = useState("");

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      setAddressError("Please enter your delivery address.");
      return;
    }
    setAddressError("");
    setOrderError("");
    setIsPlacing(true);

    try {
      // Generate a shared transactionId for all items in this checkout
      const transactionId = crypto.randomUUID();

      // Create one order document per cart item (backend model: one doc per product)
      const orderPromises = items.map((item) =>
        apiFetch("/api/orders", {
          method: "POST",
          body: JSON.stringify({
            transactionId,
            productId: item.product.id,
            orderQuantity: item.quantity,
          }),
        })
      );

      const results = await Promise.all(orderPromises);

      // Check if any request failed
      const failed = results.filter((r) => !r.ok);
      if (failed.length > 0) {
        const errorData = await failed[0].json().catch(() => ({ message: "Unknown error" }));
        setOrderError(
          (errorData as { message: string }).message || "Failed to place order. Please try again."
        );
        return;
      }

      clearCart();
      setSuccessOpen(true);
    } catch (_error) {
      setOrderError(`${_error} Network error. Please check your connection and try again.`);
    } finally {
      setIsPlacing(false);
    }
  };

  if (items.length === 0 && !successOpen) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 animate-fade-in">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/40" strokeWidth={1.5} />
        <p className="font-display text-xl font-bold text-foreground">No items to checkout</p>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="rounded-full px-8 font-semibold"
        >
          Browse Market
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background pb-16">
        <main className="container pt-8 md:pt-14 px-4 max-w-[900px] mx-auto animate-fade-in">
          {/* Back nav */}
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Cart
          </button>

          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground mb-10 tracking-tight">
            Checkout
          </h1>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left — Delivery & Payment */}
            <div className="flex-1 flex flex-col gap-5">
              {/* Delivery Address */}
              <Card className="bg-card border border-border shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="font-display font-bold text-base text-foreground">
                      Delivery Address
                    </h2>
                  </div>
                  <textarea
                    id="checkout-address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (e.target.value.trim()) setAddressError("");
                    }}
                    placeholder="Enter your full delivery address…"
                    rows={3}
                    className={`w-full rounded-xl border px-4 py-3 text-sm bg-muted/50 resize-none focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground/60 ${
                      addressError
                        ? "border-destructive focus:ring-destructive/30"
                        : "border-border focus:ring-primary/30 focus:border-primary/30"
                    }`}
                  />
                  {addressError && (
                    <p className="text-xs text-destructive mt-1.5 font-medium">{addressError}</p>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-card border border-border shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Banknote className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="font-display font-bold text-base text-foreground">
                      Payment Method
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-primary/40 bg-primary/5 cursor-pointer">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Banknote className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">Cash on Delivery</p>
                      <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                    </div>
                    <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="bg-card border border-border shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="font-display font-bold text-base text-foreground">
                      Order Items
                    </h2>
                    <Badge
                      variant="secondary"
                      className="ml-auto text-xs font-semibold rounded-full"
                    >
                      {totalItems} items
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-3">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden border border-border/50">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg
                              className="w-full h-full stroke-foreground/20 stroke-[1]"
                              viewBox="0 0 100 100"
                              preserveAspectRatio="none"
                            >
                              <line x1="0" y1="0" x2="100" y2="100" />
                              <line x1="100" y1="0" x2="0" y2="100" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {quantity} × ₱{product.price.toFixed(2)}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-foreground shrink-0">
                          ₱{(product.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right — Payment Summary */}
            <div className="w-full lg:w-72 shrink-0 sticky top-24 flex flex-col gap-4">
              <Card className="bg-card border border-border shadow-sm rounded-2xl">
                <CardContent className="p-6 flex flex-col gap-4">
                  <h2 className="font-display font-bold text-xl text-foreground">
                    Payment Summary
                  </h2>
                  <Separator />

                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="font-medium text-foreground">₱{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery Fee</span>
                      <span className="text-green-600 font-semibold">Free</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-foreground uppercase tracking-wider">
                      Total
                    </span>
                    <span className="font-extrabold text-xl text-foreground">
                      ₱{totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                        Pending Order
                      </p>
                      <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                        Will be confirmed by the seller
                      </p>
                    </div>
                  </div>

                  <Button
                    id="place-order-btn"
                    onClick={() => void handlePlaceOrder()}
                    disabled={isPlacing}
                    className="w-full rounded-xl font-semibold h-11 text-[15px] shadow-sm hover:shadow-md transition-all active:scale-95 gap-2 disabled:opacity-70"
                  >
                    {isPlacing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Placing Order…
                      </>
                    ) : (
                      <>
                        Place Order
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>

                  {orderError && (
                    <p className="text-xs text-destructive font-medium text-center animate-fade-in">
                      {orderError}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {/* Success Dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl text-center items-center p-8 bg-card border-border">
          <DialogHeader className="items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
              <CheckCircle2
                className="w-9 h-9 text-emerald-600 dark:text-emerald-400"
                strokeWidth={2}
              />
            </div>
            <DialogTitle className="font-display text-2xl font-extrabold">
              Order Placed!
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              Your order has been submitted and is now{" "}
              <span className="font-semibold text-amber-600">Pending</span>. The seller will confirm
              your order shortly. Payment is due on delivery.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-2 w-full">
            <Button
              onClick={() => {
                setSuccessOpen(false);
                navigate("/orders");
              }}
              className="w-full rounded-full font-semibold h-11 gap-2"
            >
              <Package className="w-4 h-4" />
              View My Orders
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setSuccessOpen(false);
                navigate("/");
              }}
              className="w-full rounded-full font-semibold h-11 text-muted-foreground"
            >
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
