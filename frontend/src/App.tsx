import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import PrivateRoute from "@/components/PrivateRoute";
import Orders from "@/pages/Orders";
import Inventory from "@/pages/Inventory";
import AdminDashboard from "./pages/AdminDashboard";
import SalesReport from "./pages/SalesReport";
import UserManagement from "./pages/UserManagement";
import NotFound from "@/pages/NotFound";

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/userman" element={<UserManagement />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/analytics" element={<SalesReport />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Catch-all: render the 404 Not Found page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
