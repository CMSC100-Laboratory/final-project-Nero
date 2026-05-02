import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Footer from "@/components/Footer";
import { apiFetch } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Loader2, AlertTriangle, Search } from "lucide-react";

interface Product {
  _id: string;
  productName: string;
  description: string;
  productType: 1 | 2;
  quantity: number;
  price: number;
  imageUrl?: string;
  createdAt?: string;
}

const PRODUCT_TYPE_LABELS: Record<number, string> = {
  1: "Crops",
  2: "Poultry",
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState("none");
  const [sort, setSort] = useState("best-match");
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiFetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = (await res.json()) as Product[];
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchProducts();
  }, [fetchProducts]);

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1); // Reset quantity
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    // Map backend product to cart item expected by context
    const cartItem = {
      id: selectedProduct._id,
      name: selectedProduct.productName,
      price: selectedProduct.price,
      description: selectedProduct.description,
      category: PRODUCT_TYPE_LABELS[selectedProduct.productType],
      image: selectedProduct.imageUrl,
    };
    addItem(cartItem, quantity);
    setSelectedProduct(null);
    navigate("/cart");
  };

  // Filter and Sort logic
  const filteredProducts = products
    .filter((p) => {
      if (filter === "none") return true;
      if (filter === "crops") return p.productType === 1;
      if (filter === "poultry") return p.productType === 2;
      return true;
    })
    .sort((a, b) => {
      switch (sort) {
        case "price-low-high":
          return a.price - b.price;
        case "price-high-low":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background ">
      <main className="container pt-8 md:pt-14 px-4 max-w-[1200px] mx-auto animate-fade-in">
        {/* Header section */}
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground mb-10 tracking-tight">
          Market
        </h1>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <p className="text-sm font-medium text-muted-foreground">
            {isLoading ? "Searching items..." : `${filteredProducts.length} items found`}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            {/* Filter */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase whitespace-nowrap">
                Filter by
              </span>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-[140px] h-9 bg-muted border-transparent focus:ring-primary/40 rounded-full text-xs font-medium">
                  <SelectValue placeholder="Select filter" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card">
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="crops">Crops</SelectItem>
                  <SelectItem value="poultry">Poultry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase whitespace-nowrap">
                Sort by
              </span>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full sm:w-[150px] h-9 bg-muted border-transparent focus:ring-primary/40 rounded-full text-xs font-medium">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card">
                  <SelectItem value="best-match">Best match</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Grid Section */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium animate-pulse">
              Loading fresh produce...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-destructive">
            <AlertTriangle className="h-10 w-10" />
            <p className="font-bold text-lg">{error}</p>
            <Button onClick={() => void fetchProducts()} variant="outline" className="rounded-full">
              Try Again
            </Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-muted-foreground text-center">
            <Search className="h-10 w-10 opacity-20" />
            <p className="font-bold text-xl text-foreground">No items found</p>
            <p className="max-w-[300px]">
              Try adjusting your filters or check back later for new arrivals.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
            {filteredProducts.map((product) => (
              <Card
                key={product._id}
                onClick={() => openProduct(product)}
                className="overflow-hidden border-transparent bg-transparent shadow-none rounded-none group cursor-pointer"
              >
                <CardContent className="p-0 flex flex-col gap-3">
                  {/* Image Holder */}
                  <div className="relative aspect-[4/5] w-full bg-muted flex items-center justify-center overflow-hidden group-hover:opacity-90 transition-opacity border border-border/50 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 pointer-events-none opacity-40">
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

                  {/* Product Info */}
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-bold text-[15px] leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {product.productName}
                    </h3>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                      {PRODUCT_TYPE_LABELS[product.productType]}
                    </p>
                    <p className="font-extrabold text-[16px] mt-0.5">
                      ₱
                      {product.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Product Details Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-[700px] p-6 sm:p-8 gap-6 rounded-3xl border-none shadow-2xl bg-card/95 backdrop-blur-xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>View product details and add to cart</DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="flex flex-col gap-6 pt-2">
              {/* Top: Image & Info */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Image */}
                <div className="w-full md:w-1/2 aspect-square bg-muted relative flex items-center justify-center overflow-hidden border border-border/50 rounded-2xl">
                  {selectedProduct.imageUrl ? (
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 pointer-events-none opacity-40">
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

                {/* Info */}
                <div className="w-full md:w-1/2 flex flex-col justify-between py-1">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-black text-foreground leading-tight tracking-tight">
                      {selectedProduct.productName}
                    </h2>
                    <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mt-3">
                      {PRODUCT_TYPE_LABELS[selectedProduct.productType]}
                    </p>
                    <p className="text-3xl font-black mt-6">
                      ₱
                      {selectedProduct.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-sm font-bold text-muted-foreground mt-2">
                      In Stock:{" "}
                      <span className="text-foreground">{selectedProduct.quantity} units</span>
                    </p>
                  </div>

                  <div className="mt-8 md:mt-auto">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] block mb-3">
                      Quantity
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-muted/50 rounded-2xl px-2 py-2 border border-border/50 shadow-inner">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-background transition-all active:scale-90"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-black text-lg">{quantity}</span>
                        <button
                          onClick={() =>
                            setQuantity(Math.min(selectedProduct.quantity, quantity + 1))
                          }
                          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-background transition-all active:scale-90"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <Button
                      onClick={handleAddToCart}
                      disabled={selectedProduct.quantity === 0}
                      className="w-full mt-6 rounded-2xl font-black h-14 text-base shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-95 bg-primary text-primary-foreground"
                      size="lg"
                    >
                      {selectedProduct.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bottom: Description */}
              <div className="text-[15px] text-foreground/80 leading-relaxed border-t border-border/50 pt-6">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  Product Description
                </h4>
                {selectedProduct.description}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
