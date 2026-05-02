import AdminSidebar from "@/components/AdminSidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminOrders() {
  return (
    <div>
      <AdminSidebar />
      <main className="container pt-8 md:pt-14 px-4 max-w-[1200px] mx-auto animate-fade-in flex-1 sm:pl-[90px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-2">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Orders
            </h1>
            <p className="text-sm font-medium text-muted-foreground mt-2">
              View orders made by buyers
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="mt-10 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
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
                  Product ID
                </TableHead>
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
              <TableRow className="group">
                <TableCell className="font-mono text-xs text-muted-foreground">test</TableCell>
                <TableCell className="font-semibold text-sm">
                  <div className="flex items-center gap-3">test</div>
                </TableCell>
                <TableCell className="text-sm">test</TableCell>
                <TableCell className="text-sm font-medium">test</TableCell>
                <TableCell className="text-sm">test</TableCell>
                <TableCell className="text-sm font-medium">₱100.00</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px]">test</TableCell>
                {/* <TableCell>
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
                </TableCell> */}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
