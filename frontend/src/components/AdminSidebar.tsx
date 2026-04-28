import {
  ArchiveIcon,
  LayoutGridIcon,
  PieChartIcon,
  SidebarCloseIcon,
  TruckIcon,
  User2Icon,
} from "lucide-react";
//import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const linkStyle =
    "flex flex-row p-4 rounded-[8px] gap-5 hover:bg-[#064e3b] hover:text-white hover:shadow-md items-center w-[300px] transition-all duration-100 ease-in-out";

  //const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className="flex flex-col gap-2 fixed left-0 top-0 pt-[72px] p-2 h-screen z-30 border-r border-[#566342]-1 bg-white">
      <NavLink
        to="/admin/dashboard"
        className={({ isActive }) =>
          isActive ? linkStyle + " bg-[#064e3b] text-white shadow-md" : linkStyle
        }
      >
        <LayoutGridIcon className="h-6 w-6" />
        <p className="">Dashboard</p>
      </NavLink>
      <NavLink
        to="/admin/inventory"
        className={({ isActive }) =>
          isActive ? linkStyle + " bg-[#064e3b] text-white shadow-md" : linkStyle
        }
      >
        <ArchiveIcon className="h-6 w-6" />
        <p>Inventory</p>
      </NavLink>
      <NavLink
        to="/admin/orders"
        className={({ isActive }) =>
          isActive ? linkStyle + " bg-[#064e3b] text-white shadow-md" : linkStyle
        }
      >
        <TruckIcon className="h-6 w-6" />
        <p>Orders</p>
      </NavLink>
      <NavLink
        to="/admin/userman"
        className={({ isActive }) =>
          isActive ? linkStyle + " bg-[#064e3b] text-white shadow-md" : linkStyle
        }
      >
        <User2Icon className="h-6 w-6" />
        <p>User Management</p>
      </NavLink>
      <NavLink
        to="/admin/analytics"
        className={({ isActive }) =>
          isActive ? linkStyle + " bg-[#064e3b] text-white shadow-md" : linkStyle
        }
      >
        <PieChartIcon className="h-6 w-6" />
        <p>Revenue Analytics</p>
      </NavLink>

      {/* Collapse Toggle Icon */}
      <button className="absolute -right-10 top-[85px] h-6 w-6 rounded-[5px] flex items-center justify-center hover:bg-[#064e3b] hover:text-white hover:shadow-md hover:bg-slate-50 transition-colors z-50">
        <SidebarCloseIcon className="h-5 w-5 text-slate-600" />
      </button>
    </aside>
  );
}
