import { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { Plus, Pencil, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { ProductFormModal, DeleteProductDialog, type Product } from "@/components/ProductModal";
import AdminSidebar from "@/components/AdminSidebar";
/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PRODUCT_TYPE_LABELS: Record<number, string> = {
  1: "Crops",
  2: "Poultry",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Inventory() {
  /* ---------- state ---------- */
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters / sort
  const [filterType, setFilterType] = useState("none");
  const [sortBy, setSortBy] = useState("newest");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  /* ---------- fetch ---------- */
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

  /* ---------- filtered / sorted ---------- */
  const filteredProducts = products
    .filter((p) => {
      if (filterType === "none") return true;
      if (filterType === "crops") return p.productType === 1;
      if (filterType === "poultry") return p.productType === 2;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name-az":
          return a.productName.localeCompare(b.productName);
        default:
          return 0;
      }
    });

  /* ---------- modal helpers ---------- */
  const openCreateModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  /* ---------- helpers ---------- */
  const truncate = (str: string, len: number) => (str.length > len ? str.slice(0, len) + "…" : str);

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-[#ecedef] pb-16 flex">
      <AdminSidebar />

      <main className="container pt-8 md:pt-14 px-4 max-w-[1200px] mx-auto animate-fade-in flex-1 sm:pl-[90px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-2">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Inventory
            </h1>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">
              Products List
            </p>
          </div>
          <Button
            id="add-product-btn"
            onClick={openCreateModal}
            className="rounded-full font-semibold h-10 px-5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2"
          >
            <Plus className="h-4 w-4" />
            Add product
          </Button>
        </div>

        {/* Subheader: count + filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 mt-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span>{" "}
            of <span className="font-semibold text-foreground">{products.length}</span> products
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            {/* Filter */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase whitespace-nowrap">
                Filter by
              </span>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[130px] h-9 bg-black/5 border-transparent focus:ring-primary/40 rounded-full text-xs font-medium">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
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
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[140px] h-9 bg-black/5 border-transparent focus:ring-primary/40 rounded-full text-xs font-medium">
                  <SelectValue placeholder="Newest" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price ↑</SelectItem>
                  <SelectItem value="price-high">Price ↓</SelectItem>
                  <SelectItem value="name-az">Name A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="font-medium">Loading products…</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              <p className="font-medium">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void fetchProducts()}
                className="rounded-full mt-2"
              >
                Retry
              </Button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <p className="font-medium">No products found</p>
              <Button
                variant="outline"
                size="sm"
                onClick={openCreateModal}
                className="rounded-full mt-2 gap-2"
              >
                <Plus className="h-4 w-4" />
                Add your first product
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Product ID
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Product Name
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Product Type
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Price/unit
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Stock
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Description
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground w-[100px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id} className="group">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{product._id.slice(-10)}
                    </TableCell>
                    <TableCell className="font-semibold text-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border/50">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.productName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Plus className="h-4 w-4 text-muted-foreground/40" />
                          )}
                        </div>
                        {product.productName}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {PRODUCT_TYPE_LABELS[product.productType] ?? "Unknown"}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      ₱{product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm">{product.quantity}</TableCell>
                    <TableCell
                      className="text-sm text-muted-foreground max-w-[200px]"
                      title={product.description}
                    >
                      {truncate(product.description, 30)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title="Edit product"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                          title="Delete product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      {/*  ADD / EDIT PRODUCT MODAL  */}
      <ProductFormModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditingProduct(null);
        }}
        editingProduct={editingProduct}
        onSaved={() => void fetchProducts()}
      />

      {/*  DELETE CONFIRMATION DIALOG  */}
      <DeleteProductDialog
        product={deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onDeleted={() => void fetchProducts()}
      />
    </div>
  );
}
