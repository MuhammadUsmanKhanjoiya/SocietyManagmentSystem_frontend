import React from "react";
import { FaBars } from "react-icons/fa6";

function Header({ title='title' }) {
  return (
    <div className="bg-[#FFFFFF] shadow w-full p-6 flex ">
      <h1 className="font-semibold text-2xl text-[#303030] flex items-center">
        {" "}
        <FaBars className="mr-2" size={24} color="" /> {title}
      </h1>
    </div>
  );
}

export default Header;
