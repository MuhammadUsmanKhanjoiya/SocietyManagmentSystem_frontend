import React from "react";

function Boxies({ title, number, icon }) {
  return (
    <div className="flex items-center bg-[#FFFFFF] m-3 px-5 py-8 w-fit rounded-md shadow-md">
      <div>
        <h1 className="text-xl">{title}</h1>
        <span className="text-xl font-semibold">{number}</span>
      </div>
      <div className="ml-6 bg-[#996406] p-2 rounded-md">{icon}</div>
    </div>
  );
}

export default Boxies;
