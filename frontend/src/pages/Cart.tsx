import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";
type OrderOption = "asc" | "desc";

export default function Cart() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [orderBy, setOrderBy] = useState<OrderOption>("asc");

  // Sort items
  const sortedItems = [...items].sort((a, b) => {
    let cmp = 0;
    if (sortBy === "price-asc" || sortBy === "price-desc") {
      cmp = a.product.price - b.product.price;
      if (sortBy === "price-desc") cmp = -cmp;
    } else if (sortBy === "name-asc") {
      cmp = a.product.name.localeCompare(b.product.name);
    }
    return orderBy === "desc" ? -cmp : cmp;
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 animate-fade-in">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-primary/60" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Your cart is empty</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Browse the market and add some fresh produce!
            </p>
          </div>
          <Button
            onClick={() => navigate("/")}
            className="rounded-full px-8 font-semibold mt-2 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            Browse Market
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="container pt-8 md:pt-14 px-4 max-w-[1200px] mx-auto animate-fade-in">
        {/* Page Header */}
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground mb-10 tracking-tight">
          Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left — Cart Items */}
          <div className="flex-1 min-w-0">
            {/* Sort / Order Controls */}
            <div className="flex flex-wrap items-center gap-4 justify-end mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase whitespace-nowrap">
                  Sort by
                </span>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-[140px] h-9 bg-muted border-transparent focus:ring-primary/40 rounded-full text-xs font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border bg-card">
                    <SelectItem value="default">Best match</SelectItem>
                    <SelectItem value="price-asc">Price</SelectItem>
                    <SelectItem value="name-asc">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase whitespace-nowrap">
                  Order by
                </span>
                <Select value={orderBy} onValueChange={(v) => setOrderBy(v as OrderOption)}>
                  <SelectTrigger className="w-[130px] h-9 bg-muted border-transparent focus:ring-primary/40 rounded-full text-xs font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border bg-card">
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Item Cards */}
            <div className="flex flex-col gap-3">
              {sortedItems.map(({ product, quantity }) => {
                const itemTotal = product.price * quantity;
                return (
                  <Card
                    key={product.id}
                    className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-4 flex gap-4 items-start">
                      {/* Product Image */}
                      <div className="w-20 h-20 shrink-0 rounded-xl bg-muted overflow-hidden flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full relative">
                            <svg
                              className="w-full h-full stroke-foreground/20 stroke-[1]"
                              viewBox="0 0 100 100"
                              preserveAspectRatio="none"
                            >
                              <line x1="0" y1="0" x2="100" y2="100" />
                              <line x1="100" y1="0" x2="0" y2="100" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info + Controls */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-[15px] leading-tight text-foreground truncate">
                              {product.name}
                            </h3>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                              {product.category}
                            </p>
                            <p className="font-bold text-sm mt-1 text-primary">
                              ₱{product.price.toFixed(2)}
                              <span className="font-normal text-muted-foreground text-xs">
                                /each
                              </span>
                            </p>
                          </div>

                          {/* Delete */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all active:scale-95">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove item?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove{" "}
                                  <span className="font-semibold">{product.name}</span> from your
                                  cart.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-full">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeItem(product.id)}
                                  className="rounded-full bg-destructive hover:bg-destructive/90"
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>

                        {/* Quantity + Row Total */}
                        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                          <div className="flex items-center bg-muted rounded-full px-1 py-1 border border-border">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-background transition-colors active:scale-90"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-background transition-colors active:scale-90"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Total
                            </span>
                            <span className="font-extrabold text-base bg-muted px-3 py-1 rounded-full text-foreground border border-border">
                              ₱{itemTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Right — Summary */}
          <div className="w-full lg:w-72 shrink-0 sticky top-24">
            <Card className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6 flex flex-col gap-4">
                <h2 className="font-display font-bold text-xl text-foreground">Summary</h2>

                <Separator className="bg-border" />

                {/* Column Headers */}
                <div className="grid grid-cols-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>Item</span>
                  <span className="text-center">Qty.</span>
                  <span className="text-right">Price</span>
                </div>

                {/* Item rows */}
                <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="grid grid-cols-3 text-sm text-foreground items-center"
                    >
                      <span className="truncate pr-1 font-medium text-xs">{product.name}</span>
                      <span className="text-center text-xs text-muted-foreground">x{quantity}</span>
                      <span className="text-right text-xs font-semibold">
                        ₱{(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="bg-border" />

                {/* Totals */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-foreground uppercase tracking-wider">
                      Total
                    </p>
                    <p className="text-xs text-muted-foreground">{totalItems} items</p>
                  </div>
                  <span className="font-extrabold text-lg text-foreground">
                    ₱{totalPrice.toFixed(2)}
                  </span>
                </div>

                <Button
                  onClick={() => navigate("/checkout")}
                  className="w-full rounded-xl font-semibold h-11 text-[15px] shadow-sm hover:shadow-md transition-all active:scale-95 gap-2"
                >
                  Checkout
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
