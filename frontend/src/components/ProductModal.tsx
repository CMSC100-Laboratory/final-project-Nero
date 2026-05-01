import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import { ImagePlus, Loader2, AlertTriangle } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Product {
  _id: string;
  productName: string;
  description: string;
  productType: 1 | 2;
  quantity: number;
  price: number;
  imageUrl?: string;
  createdAt?: string;
}

interface ProductFormData {
  productName: string;
  description: string;
  productType: 1 | 2;
  quantity: number;
  price: number;
  imageFile: File | null;
  imagePreview: string | null;
}

const EMPTY_FORM: ProductFormData = {
  productName: "",
  description: "",
  productType: 1,
  quantity: 0,
  price: 0,
  imageFile: null,
  imagePreview: null,
};

/* ------------------------------------------------------------------ */
/*  ProductFormModal                                                    */
/* ------------------------------------------------------------------ */

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Product to edit. Pass null to create a new product. */
  editingProduct: Product | null;
  /** Called after a successful save (create or update). */
  onSaved: () => void;
}

export function ProductFormModal({
  open,
  onOpenChange,
  editingProduct,
  onSaved,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync form state when the modal opens or the editingProduct changes
  useEffect(() => {
    if (open) {
      if (editingProduct) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm({
          productName: editingProduct.productName,
          description: editingProduct.description,
          productType: editingProduct.productType,
          quantity: editingProduct.quantity,
          price: editingProduct.price,
          imageFile: null,
          imagePreview: editingProduct.imageUrl || null,
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setFormError(null);
    }
  }, [open, editingProduct]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({
        ...f,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

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

      const formData = new FormData();
      formData.append("productName", form.productName.trim());
      formData.append("description", form.description.trim());
      formData.append("productType", String(form.productType));
      formData.append("quantity", String(form.quantity));
      formData.append("price", String(form.price));

      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      let res: Response;
      if (editingProduct) {
        res = await apiFetch(`/api/products/${editingProduct._id}`, {
          method: "PUT",
          body: formData, // apiFetch will handle removing JSON content-type when body is FormData
        });
      } else {
        res = await apiFetch("/api/products", {
          method: "POST",
          body: formData,
        });
      }

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(err.message || "Failed to save product");
      }

      onOpenChange(false);
      onSaved();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onOpenChange(false)}>
      <DialogContent className="sm:max-w-[540px] p-0 gap-0 rounded-2xl overflow-hidden bg-card border-border">
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
            onClick={() => void handleSave()}
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
              className="h-11 rounded-lg border-border bg-muted/30 focus-visible:bg-card text-base transition-all"
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
                  className="h-11 rounded-lg border-border bg-muted/30 focus:bg-card text-sm transition-all"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card">
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
                  className="h-11 rounded-lg border-border bg-muted/30 focus-visible:bg-card pl-7 text-sm transition-all"
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
                className="h-11 rounded-lg border-border bg-muted/30 focus-visible:bg-card text-sm transition-all"
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
              <input
                type="file"
                id="product-image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <label
                htmlFor="product-image-upload"
                className={`aspect-square w-full max-w-[140px] rounded-lg border-2 border-dashed border-border bg-muted/20 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-muted/40 hover:border-emerald-500/50 transition-all overflow-hidden relative group/img ${
                  form.imagePreview ? "border-solid border-emerald-500/30" : ""
                }`}
              >
                {form.imagePreview ? (
                  <>
                    <img
                      src={form.imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                      <ImagePlus className="h-6 w-6 text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-6 w-6 text-muted-foreground/60" />
                    <span className="text-[10px] text-muted-foreground/60 font-medium text-center leading-tight">
                      Upload image
                    </span>
                  </>
                )}
              </label>
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
                className="rounded-lg border-border bg-muted/30 focus-visible:bg-card text-sm resize-none transition-all"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  DeleteProductDialog                                                */
/* ------------------------------------------------------------------ */

interface DeleteProductDialogProps {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
  /** Called after a successful delete. */
  onDeleted: () => void;
}

export function DeleteProductDialog({
  product,
  onOpenChange,
  onDeleted,
}: DeleteProductDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!product) return;
    try {
      setIsDeleting(true);
      const res = await apiFetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      onOpenChange(false);
      onDeleted();
    } catch {
      // Could add a toast here; for now just close
      onOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onOpenChange(false)}>
      <DialogContent className="sm:max-w-[400px] p-6 gap-5 rounded-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Delete product</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{product?.productName}</span>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full font-semibold h-9 px-5"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={() => void handleDelete()}
            disabled={isDeleting}
            className="rounded-full font-semibold h-9 px-5 bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-2"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
