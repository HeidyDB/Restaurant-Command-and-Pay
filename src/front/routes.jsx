import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import Login from "./pages/Login";
import Private from "./pages/Private";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import RequestReset from "./pages/RequestReset";
//import TableMap from "./pages/TableMap";
import OrdersDashboard from "./pages/OrdersDashboard";
import Admin from "./pages/Admin";
import Tables from "./pages/Tables";
import TableOrder from "./pages/TableOrder";
import Menu from "./pages/Menu";






export const router = createBrowserRouter(
  createRoutesFromElements(

    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      <Route path="/" element={<Login />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/login" element={<Login />} />
      <Route path="/private" element={<Private />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/request-reset-password" element={<RequestReset />} />
      <Route path="/orders-dashboard" element={<OrdersDashboard />} />
      <Route path="/admin-bar" element={<Admin />} />
      <Route path="/tables" element={<Tables />} />
      <Route path="/table-order/:id" element={<TableOrder />} />
      <Route path="/menu/:order_id" element={<Menu />} />

    </Route>
  ),
);
