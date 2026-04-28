import {
  ArchiveIcon,
  LayoutGridIcon,
  PieChartIcon,
  PanelLeftClose,
  PanelLeftOpen,
  TruckIcon,
  User2Icon,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const linkStyle =
    "flex flex-row p-4 rounded-[8px] hover:bg-[#064e3b] hover:text-white hover:shadow-md items-center transition-all duration-300 ease-in-out";

  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      className={`flex flex-col gap-2 fixed left-0 top-0 pt-[72px] p-2 h-screen z-30 border-r border-[#566342]-1 bg-white transition-all duration-300 ease-in-out ${isOpen ? "w-[300px]" : "w-[73px]"}`}
    >
      <NavLink
        to="/admin/dashboard"
        className={({ isActive }) =>
          isActive ? linkStyle + " bg-[#064e3b] text-white shadow-md" : linkStyle
        }
      >
        <LayoutGridIcon className="h-6 w-6 shrink-0" />
        <p
          className={`truncate transition-all duration-300 ease-in-out whitespace-nowrap ${isOpen ? "opacity-100 max-w-xs ml-5" : "opacity-0 max-w-0 ml-0"}`}
        >
          Dashboard
        </p>
      </NavLink>
      <NavLink
        to="/admin/inventory"
        className={({ isActive }) =>
          isActive ? linkStyle + " bg-[#064e3b] text-white shadow-md" : linkStyle
        }
      >
        <ArchiveIcon className="h-6 w-6 shrink-0" />
        <p
          className={`truncate transition-all duration-300 ease-in-out whitespace-nowrap ${isOpen ? "opacity-100 max-w-xs ml-5" : "opacity-0 max-w-0 ml-0"}`}
        >
          Inventory
        </p>
      </NavLink>
      <NavLink
        to="/admin/orders"
        className={({ isActive }) =>
          isActive ? linkStyle + " bg-[#064e3b] text-white shadow-md" : linkStyle
        }
      >
        <TruckIcon className="h-6 w-6 shrink-0" />
        <p
          className={`truncate transition-all duration-300 ease-in-out whitespace-nowrap ${isOpen ? "opacity-100 max-w-xs ml-5" : "opacity-0 max-w-0 ml-0"}`}
        >
          Orders
        </p>
      </NavLink>
      <NavLink
        to="/admin/userman"
        className={({ isActive }) =>
          isActive ? linkStyle + " bg-[#064e3b] text-white shadow-md" : linkStyle
        }
      >
        <User2Icon className="h-6 w-6 shrink-0" />
        <p
          className={`truncate transition-all duration-300 ease-in-out whitespace-nowrap ${isOpen ? "opacity-100 max-w-xs ml-5" : "opacity-0 max-w-0 ml-0"}`}
        >
          User Management
        </p>
      </NavLink>
      <NavLink
        to="/admin/analytics"
        className={({ isActive }) =>
          isActive ? linkStyle + " bg-[#064e3b] text-white shadow-md" : linkStyle
        }
      >
        <PieChartIcon className="h-6 w-6 shrink-0" />
        <p
          className={`truncate transition-all duration-300 ease-in-out whitespace-nowrap ${isOpen ? "opacity-100 max-w-xs ml-5" : "opacity-0 max-w-0 ml-0"}`}
        >
          Revenue Analytics
        </p>
      </NavLink>

      {/* Collapse Toggle Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-10 top-[88px] h-6 w-6 rounded-[5px] flex items-center justify-center hover:bg-[#064e3b] hover:shadow-md hover:bg-slate-50 transition-all z-50"
      >
        {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
      </button>
    </aside>
  );
}
