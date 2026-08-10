import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Inventory from "./pages/Inventory";
import Analytics from "./pages/Analytics";
import EditOrder from "./pages/EditOrder";
import AddCustomer from "./pages/AddCustomer";
import AddOrder from "./pages/AddOrder";
import EditCustomer from "./pages/EditCustomer";
import AddProduct from "./pages/AddProduct";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/orders" element={<Orders />} />

        <Route path="/customers" element={<Customers />} />

        <Route path="/inventory" element={<Inventory />} />

        <Route path="/analytics" element={<Analytics />} />
        <Route path="/edit-order/:id" element={<EditOrder />} />
        <Route path="/add-customer" element={<AddCustomer />} />
        <Route path="/add-order" element={<AddOrder />} />
        <Route path="/edit-customer/:id" element={<EditCustomer />} />
        <Route path="/add-product" element={<AddProduct />} />
      </Routes>

    </BrowserRouter>

  );

}

export default App;