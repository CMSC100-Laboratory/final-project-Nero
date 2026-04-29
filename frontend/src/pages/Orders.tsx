import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

// Temporary mock data for the UI
const MOCK_ORDERS = [
  {
    id: 1,
    name: "ProductName",
    category: "CATEGORY/S",
    price: 100.0,
    quantity: 2,
    orderId: 139875893,
    status: "Completed",
  },
  {
    id: 2,
    name: "ProductName",
    category: "CATEGORY/S",
    price: 100.0,
    quantity: 2,
    orderId: 139875893,
    status: "Pending",
  },
  {
    id: 3,
    name: "ProductName",
    category: "CATEGORY/S",
    price: 100.0,
    quantity: 2,
    orderId: 139875893,
    status: "Confirmed",
  },
  {
    id: 4,
    name: "ProductName",
    category: "CATEGORY/S",
    price: 100.0,
    quantity: 2,
    orderId: 139875893,
    status: "Cancelled",
  },
];

export default function Orders() {
  const [status, setStatus] = useState("All");

  return (
    <div>
      <main className="container pt-8 md:pt-14 px-4 max-w-[1200px] mx-auto animate-fade-in">
        {/* Header section */}
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground mb-10 tracking-tight">
          Orders
        </h1>

        {/* Filters section */}
        <ButtonGroup className="w-full">
          <Button
            className="w-full rounded-full font-semibold h-12 text-[15px] bg-[#d9d9d9] hover:bg-[#c9c9c9] text-foreground border-transparent shadow-none"
            size="lg"
            onClick={() => setStatus("All")}
          >
            All
          </Button>
          <Button
            className="w-full rounded-full font-semibold h-12 text-[15px] bg-[#d9d9d9] hover:bg-[#c9c9c9] text-foreground border-transparent shadow-none"
            size="lg"
            onClick={() => setStatus("Pending")}
          >
            Pending
          </Button>
          <Button
            className="w-full rounded-full font-semibold h-12 text-[15px] bg-[#d9d9d9] hover:bg-[#c9c9c9] text-foreground border-transparent shadow-none"
            size="lg"
            onClick={() => setStatus("Confirmed")}
          >
            Confirmed
          </Button>
          <Button
            className="w-full rounded-full font-semibold h-12 text-[15px] bg-[#d9d9d9] hover:bg-[#c9c9c9] text-foreground border-transparent shadow-none"
            size="lg"
            onClick={() => setStatus("Completed")}
          >
            Completed
          </Button>
          <Button
            className="w-full rounded-full font-semibold h-12 text-[15px] bg-[#d9d9d9] hover:bg-[#c9c9c9] text-foreground border-transparent shadow-none"
            size="lg"
            onClick={() => setStatus("Cancelled")}
          >
            Cancelled
          </Button>
        </ButtonGroup>

        {/* Orders section */}
        <div className="flex flex-col gap-3 mt-5">
          {MOCK_ORDERS.filter((order) => status === "All" || order.status === status).map(
            (order) => (
              <Card
                key={order.id}
                className="p-3 sm:p-4 w-full overflow-hidden border-[#566342]-1 shadow-none rounded-20 group cursor-pointer"
              >
                <CardContent className="p-0 flex flex-row gap-3 sm:gap-5">
                  {/* Image */}
                  <div className="w-[100px] sm:w-[150px] md:w-[200px] aspect-square bg-[#dcdcdc] shrink-0 relative flex items-center justify-center overflow-hidden border border-black/5 rounded-xl"></div>

                  {/* Left content info */}
                  <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
                    <h2 className="text-[18px] sm:text-[22px] md:text-[28px] lg:text-[32px] font-semibold text-foreground leading-tight sm:leading-none tracking-tight truncate">
                      {order.name}
                    </h2>
                    <p className="text-[10px] md:text-[12px] text-muted-foreground uppercase tracking-widest truncate">
                      {order.category}
                    </p>
                    <p className="text-[14px] sm:text-[18px]">
                      <span className="text-[18px] sm:text-[24px] font-bold">
                        ₱{order.price.toFixed(2)}
                      </span>
                      /each
                    </p>
                    <div className="hidden sm:block flex-1"></div>
                    <Button
                      className="hidden sm:flex w-[200px] rounded-full font-semibold h-11 text-[15px] bg-[#d9d9d9] hover:bg-[#c9c9c9] text-foreground border-transparent shadow-none"
                      size="lg"
                    >
                      Buy again
                    </Button>
                  </div>

                  {/* Right content info */}
                  <div className="flex flex-col gap-2 items-end justify-between shrink-0">
                    {/* Top info */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-3">
                      <p className="text-[10px] sm:text-[16px] text-black/40 truncate">
                        #{order.orderId}
                      </p>

                      {/* Status */}
                      <div
                        className={`px-2 py-1 md:p-3 md:w-[140px] lg:w-[190px] align-middle text-center rounded-full font-semibold text-[10px] sm:text-[15px] text-foreground 
                      ${order.status === "Completed" && "bg-[#A7FF84]"}
                      ${order.status === "Pending" && "bg-[#FFD884]"}
                      ${order.status === "Confirmed" && "bg-[#84D8FF]"}
                      ${order.status === "Cancelled" && "bg-[#FF8484]"}`}
                      >
                        {order.status}
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden sm:block flex-1"></div>

                    {/* Bottom info */}
                    <div className="flex flex-row gap-4 sm:gap-8 lg:gap-16 justify-end items-end sm:items-center">
                      <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-5 text-right">
                        <p className="text-[10px] md:text-[14px] sm:text-base text-muted-foreground md:text-foreground leading-none">
                          Quantity
                        </p>
                        <p className="text-[16px] md:text-[20px] sm:text-[24px]">
                          {order.quantity}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-5 text-right">
                        <p className="text-[10px] md:text-[14px] sm:text-base text-muted-foreground md:text-foreground leading-none">
                          Total
                        </p>
                        <p className="text-[16px] md:text-[20px] sm:text-[24px] font-bold">
                          ₱{(order.price * order.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </main>
    </div>
  );
}
