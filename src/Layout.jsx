
import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./components/screens/SideBar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Layout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5  bg-[#DBAE5F]">
        <SideBar />
      </div>

      {/* Right Content with scrollable area */}
      <div className="w-4/5 bg-[#F5F5F5] overflow-y-auto p-4">
        <Outlet />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default Layout;
