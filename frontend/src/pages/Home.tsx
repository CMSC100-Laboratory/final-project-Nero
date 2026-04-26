import { useState } from "react";
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
import { Minus, Plus } from "lucide-react";

// Temporary mock data for the UI
const MOCK_PRODUCTS = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  name: "ProductName",
  category: "CATEGORY/S",
  price: 100.0,
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
}));

export default function Home() {
  const [filter, setFilter] = useState("none");
  const [sort, setSort] = useState("best-match");

  const [selectedProduct, setSelectedProduct] = useState<(typeof MOCK_PRODUCTS)[0] | null>(null);
  const [quantity, setQuantity] = useState(1);

  const openProduct = (product: (typeof MOCK_PRODUCTS)[0]) => {
    setSelectedProduct(product);
    setQuantity(1); // Reset quantity
  };

  return (
    <div className="min-h-screen bg-[#ecedef] pb-16">
      <main className="container pt-8 md:pt-14 px-4 max-w-[1200px] mx-auto animate-fade-in">
        {/* Header section */}
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground mb-10 tracking-tight">
          Market
        </h1>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <p className="text-sm font-medium text-muted-foreground">
            {MOCK_PRODUCTS.length} items found
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            {/* Filter */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase whitespace-nowrap">
                Filter by
              </span>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-[140px] h-9 bg-black/5 border-transparent focus:ring-primary/40 rounded-full text-xs font-medium">
                  <SelectValue placeholder="Select filter" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="meat">Meat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase whitespace-nowrap">
                Sort by
              </span>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full sm:w-[150px] h-9 bg-black/5 border-transparent focus:ring-primary/40 rounded-full text-xs font-medium">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
          {MOCK_PRODUCTS.map((product) => (
            <Card
              key={product.id}
              onClick={() => openProduct(product)}
              className="overflow-hidden border-transparent bg-transparent shadow-none rounded-none group cursor-pointer"
            >
              <CardContent className="p-0 flex flex-col gap-3">
                {/* Image Placeholder mimicking the wireframe cross */}
                <div className="relative aspect-[4/5] w-full bg-[#dcdcdc] flex items-center justify-center overflow-hidden group-hover:opacity-90 transition-opacity">
                  <div className="absolute inset-0 pointer-events-none opacity-40">
                    <svg
                      className="w-full h-full stroke-black/30 stroke-[1]"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <line x1="0" y1="0" x2="100" y2="100" />
                      <line x1="100" y1="0" x2="0" y2="100" />
                    </svg>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-semibold text-[15px] leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {product.category}
                  </p>
                  <p className="font-bold text-[15px] mt-0.5">₱{product.price.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Product Details Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-[700px] p-6 sm:p-8 gap-6 rounded-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>View product details and add to cart</DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="flex flex-col gap-6 pt-2">
              {/* Top: Image & Info */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Image */}
                <div className="w-full md:w-1/2 aspect-square bg-[#dcdcdc] relative flex items-center justify-center overflow-hidden border border-black/5">
                  <div className="absolute inset-0 pointer-events-none opacity-40">
                    <svg
                      className="w-full h-full stroke-black/30 stroke-[1]"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <line x1="0" y1="0" x2="100" y2="100" />
                      <line x1="100" y1="0" x2="0" y2="100" />
                    </svg>
                  </div>
                </div>

                {/* Info */}
                <div className="w-full md:w-1/2 flex flex-col justify-between py-1">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-none tracking-tight">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">
                      {selectedProduct.category}
                    </p>
                    <p className="text-2xl font-bold mt-4">₱{selectedProduct.price.toFixed(2)}</p>
                  </div>

                  <div className="mt-8 md:mt-auto">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-black/5 rounded-full px-1 py-1">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-10 text-center font-bold text-[15px]">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-5 rounded-full font-semibold h-12 text-[15px] bg-[#d9d9d9] hover:bg-[#c9c9c9] text-foreground border-transparent shadow-none"
                      size="lg"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bottom: Description */}
              <div className="text-[15px] text-foreground/80 leading-relaxed border-t pt-5">
                {selectedProduct.description}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
