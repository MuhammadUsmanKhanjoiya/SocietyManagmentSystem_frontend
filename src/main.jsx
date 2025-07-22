import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
  // import all screens

  import Login from "./components/auth/Login.jsx";
 import SignUp from './components/auth/SignUp.jsx';
  import Layout from "./Layout.jsx";
  import Dashboard from "./components/screens/Dashboard.jsx";
  import Announcement from "./components/screens/Announcement.jsx";
  import Events from "./components/screens/Events.jsx";
  import Gatepass from "./components/screens/Gatepass.jsx";
  import Complain from "./components/screens/Complain.jsx";
  import Neighbourhood from "./components/screens/Neighbourhood.jsx";
  import MaintainenceBill from "./components/screens/MaintainenceBill.jsx";
  import Chat from "./components/screens/Chat.jsx";
  import Staff from "./components/screens/Staff.jsx";
  import Member from "./components/screens/Member.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx"
import AdminRoute from "./components/auth/AdminRoute.jsx";

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
         {/* auth screens */}
        <Route path="login" element={<Login />} />
        <Route element={<AdminRoute />}>
        <Route path="signup" element={<SignUp/>} />
        </Route>
        {/* main screens */}
        <Route element={<ProtectedRoute />}>
             <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="announcement" element={<Announcement />} />
          <Route path="events" element={<Events />} />
          <Route path="gatepass" element={<Gatepass />} />
          <Route path="complain" element={<Complain />} />
          <Route path="neighbourhood" element={<Neighbourhood />} />
          <Route path="maintainenceBill" element={<MaintainenceBill />} />
          <Route path="chat" element={<Chat />} />
          <Route path="staff" element={<Staff/>} />
          <Route path="member" element={<Member />} />
        </Route>
        </Route>
        <Route path="*" element={<h1 className="text-center text-red-500 text-2xl">404 - Page Not Found</h1>} />


      </>
    )
  );

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <RouterProvider router={router} />
         <ToastContainer position="top-right" autoClose={3000} />
    </StrictMode>
  );
