import { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import { Plus, Pencil, Trash2, ImagePlus, Loader2, AlertTriangle } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Product {
  _id: string;
  productName: string;
  description: string;
  productType: 1 | 2;
  quantity: number;
  price: number;
  createdAt?: string;
}

interface ProductFormData {
  productName: string;
  description: string;
  productType: 1 | 2;
  quantity: number;
  price: number;
}

const EMPTY_FORM: ProductFormData = {
  productName: "",
  description: "",
  productType: 1,
  quantity: 0,
  price: 0,
};

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
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      productName: product.productName,
      description: product.description,
      productType: product.productType,
      quantity: product.quantity,
      price: product.price,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  /* ---------- save (create / update) ---------- */
  const handleSave = async () => {
    // Simple validation
    if (!form.productName.trim()) {
      setFormError("Product name is required");
      return;
    }
    if (!form.description.trim()) {
      setFormError("Description is required");
      return;
    }
    if (form.price < 0) {
      setFormError("Price must be a non-negative number");
      return;
    }
    if (form.quantity < 0) {
      setFormError("Stock must be a non-negative number");
      return;
    }

    try {
      setIsSaving(true);
      setFormError(null);

      const body = JSON.stringify({
        productName: form.productName.trim(),
        description: form.description.trim(),
        productType: form.productType,
        quantity: form.quantity,
        price: form.price,
      });

      let res: Response;
      if (editingProduct) {
        // UPDATE
        res = await apiFetch(`/api/products/${editingProduct._id}`, {
          method: "PUT",
          body,
        });
      } else {
        // CREATE
        res = await apiFetch("/api/products", {
          method: "POST",
          body,
        });
      }

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(err.message || "Failed to save product");
      }

      closeModal();
      await fetchProducts();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------- delete ---------- */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await apiFetch(`/api/products/${deleteTarget._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setDeleteTarget(null);
      await fetchProducts();
    } catch {
      // Could add a toast here; for now just close
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  /* ---------- helpers ---------- */
  const truncate = (str: string, len: number) => (str.length > len ? str.slice(0, len) + "…" : str);

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-[#ecedef] pb-16">
      <main className="container pt-8 md:pt-14 px-4 max-w-[1200px] mx-auto animate-fade-in">
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
                    <TableCell className="font-semibold text-sm">{product.productName}</TableCell>
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

      {/*  ADD / EDIT PRODUCT MODAL                                      */}
      <Dialog open={modalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[540px] p-0 gap-0 rounded-2xl overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <DialogHeader className="p-0 space-y-0">
              <DialogTitle className="text-2xl font-extrabold tracking-tight">
                {editingProduct ? "Edit product" : "Add new product"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {editingProduct
                  ? "Update the product details below"
                  : "Fill out the form to create a new product"}
              </DialogDescription>
            </DialogHeader>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-full font-semibold h-9 px-5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save product
            </Button>
          </div>

          {/* Form body */}
          <div className="px-6 pb-6 pt-4 space-y-5">
            {formError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2.5 font-medium">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {formError}
              </div>
            )}

            {/* Product name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="productName"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Product name
              </Label>
              <Input
                id="productName"
                placeholder="Product name…"
                value={form.productName}
                onChange={(e) => setForm((f) => ({ ...f, productName: e.target.value }))}
                className="h-11 rounded-lg border-input bg-muted/30 focus-visible:bg-background text-base"
              />
            </div>

            {/* Type / Price / Stock row */}
            <div className="grid grid-cols-3 gap-4">
              {/* Product type */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="productType"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  Product type
                </Label>
                <Select
                  value={String(form.productType)}
                  onValueChange={(v) => setForm((f) => ({ ...f, productType: Number(v) as 1 | 2 }))}
                >
                  <SelectTrigger
                    id="productType"
                    className="h-11 rounded-lg border-input bg-muted/30 focus:bg-background text-sm"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="1">Crops</SelectItem>
                    <SelectItem value="2">Poultry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="price"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  Price
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                    ₱
                  </span>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    value={form.price || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="h-11 rounded-lg border-input bg-muted/30 focus-visible:bg-background pl-7 text-sm"
                  />
                </div>
              </div>

              {/* Stock */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="stock"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  Initial stock
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.quantity || ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      quantity: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  className="h-11 rounded-lg border-input bg-muted/30 focus-visible:bg-background text-sm"
                />
              </div>
            </div>

            {/* Image upload placeholder + Description side by side on wider screens */}
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4">
              {/* Image placeholder */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Image
                </Label>
                <div className="aspect-square w-full max-w-[140px] rounded-lg border-2 border-dashed border-border bg-muted/20 flex flex-col items-center justify-center gap-1.5 cursor-not-allowed opacity-60 select-none">
                  <ImagePlus className="h-6 w-6 text-muted-foreground/60" />
                  <span className="text-[10px] text-muted-foreground/60 font-medium text-center leading-tight">
                    Upload image
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="description"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Description…"
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="rounded-lg border-input bg-muted/30 focus-visible:bg-background text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/*  DELETE CONFIRMATION DIALOG                                    */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px] p-6 gap-5 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Delete product</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">{deleteTarget?.productName}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="rounded-full font-semibold h-9 px-5"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-full font-semibold h-9 px-5 bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-2"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
