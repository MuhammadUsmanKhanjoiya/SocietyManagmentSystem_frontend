import React from "react";
import { Link } from "react-router-dom";
//  Importing the icons from react-icons
import { RxDashboard } from "react-icons/rx";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoLocationOutline, IoChatboxEllipsesOutline } from "react-icons/io5";
import { TbDoorEnter } from "react-icons/tb";
import { MdEventNote } from "react-icons/md";
import { GrHostMaintenance } from "react-icons/gr";
import { GiSpy } from "react-icons/gi";
import { FaBarsStaggered } from "react-icons/fa6";
import { RiLogoutCircleLine } from "react-icons/ri";

function SideBar() {
 
   const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login"; // Redirect after logout
  };
   

  return (
    <div className="sidebar ">
      <div className="sidebar-list">
        {/* LOGO */}
        <h1 className="font-bold p-6">Society Management System</h1>

        {/* SERVIES LIST */}
        <ul className="sidebar-list-items mt-2 overflow-y-auto">
          <Link to="/dashboard">
            <li className="py-3 hover:bg-[#996406] px-8 flex  items-center ">
              {" "}
              <RxDashboard size={20} className="mr-2" /> Dashboard
            </li>
          </Link>
          <Link to="/announcement">
            <li className="py-3 hover:bg-[#996406] px-8 flex  items-center">
              <IoIosNotificationsOutline size={20} className="mr-2" />{" "}
              Announcement
            </li>
          </Link>
          <Link to="/events">
            <li className="py-3 hover:bg-[#996406] px-8 flex  items-center">
              <MdEventNote size={20} className="mr-2" /> Events
            </li>
          </Link>
          <Link to="/complain">
            <li className="py-3 hover:bg-[#996406] px-8 flex  items-center">
              <GiSpy size={20} className="mr-2" /> Complain
            </li>
          </Link>
          <Link to="/gatepass">
            <li className="py-3 hover:bg-[#996406] px-8 flex  items-center">
              <TbDoorEnter size={20} className="mr-2" /> GatePass
            </li>
          </Link>
          <Link to="/neighbourhood">
            <li className="py-3 hover:bg-[#996406] px-8 flex  items-center">
              <IoLocationOutline size={20} className="mr-2" /> Neighbourhood
            </li>
          </Link>
          <Link to="/maintainenceBill">
            <li className="py-3 hover:bg-[#996406] px-8 flex  items-center">
              <GrHostMaintenance size={20} className="mr-2" /> Maintainence Bill
            </li>
          </Link>
          <Link to="/chat">
            <li className="py-3 hover:bg-[#996406] px-8 flex  items-center">
              <IoChatboxEllipsesOutline size={20} className="mr-2" /> Chat
            </li>
          </Link>
          <Link to="/member">
            <li className="py-3 hover:bg-[#996406] px-8 flex  items-center">
              <FaBarsStaggered size={18} className="mr-2" /> All users
            </li>
          </Link>
 <li
            onClick={handleLogout}
            className="cursor-pointer mt-6 py-3 hover:bg-[#996406] px-8 flex items-center"
          >
            <RiLogoutCircleLine size={18} className="mr-2" /> Logout
          </li>
                  </ul>
      </div>
    </div>
  );
}

export default SideBar;
