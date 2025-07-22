import React from "react";
import axios from "../../utils/axios";
import { useEffect, useState } from "react";

function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [newStaff, setNewStaff] = useState({ name: "", role: "" , shift:"",contact:""});

  const token = localStorage.getItem("token");
  useEffect(() => {
      fetchStaff();
    }, []);
  

  const fetchStaff = async () => {
    try {
      const response = await axios.get("/staff"); // GET staff list
      const shuffled = response.data.sort(() => 0.5 - Math.random());
      setStaffList(shuffled.slice(0, 4));
    } catch (error) {
      console.error("Error fetching staff:", error.message);
    }
  };
   const addStaff = async () => {
    if (!newStaff.name || !newStaff.role) { 
      alert("Please fill in all fields");
      return;
    }
    try {
      const response = await axios.post("/staff", newStaff, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffList([...staffList, response.data]);
      setNewStaff({ name: "", role: ""  ,shift:"",contact:""}); // Reset form
    } catch (error) {
      console.error("Error adding staff:", error.message);
    }
  }

    const deleteStaff = async (id) => {
    try {
      await axios.delete(`/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffList(staffList.filter((staff) => staff._id !== id));
    } catch (error) {
      console.error("Error deleting staff:", error.message);
    }
  }
  return(
    <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-[#DBAE5F]">Staff</h2>

          {/* Add Staff Form */}
          <div className="mb-4 flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Name"
              className="border px-2 py-1 rounded w-full md:w-1/2"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Role"
              className="border px-2 py-1 rounded w-full md:w-1/2"
              value={newStaff.role}
              onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
            />
             <input
              type="text"
              placeholder="shift"
              className="border px-2 py-1 rounded w-full md:w-1/2"
              value={newStaff.shift}
              onChange={(e) => setNewStaff({ ...newStaff, shift: e.target.value })}
            />
             <input
              type="Number"
              placeholder="contact"
              className="border px-2 py-1 rounded w-full md:w-1/2"
              value={newStaff.contact}
              onChange={(e) => setNewStaff({ ...newStaff, contact: e.target.value })}
            />
            <button
              onClick={addStaff}
              className="bg-[#DBAE5F] text-white px-4 py-1 rounded"
            >
              Add Staff
            </button>
          </div>

          {/* Staff List */}
          {staffList.length === 0 ? (
            <p className="text-gray-600">No staff data found.</p>
          ) : (
            <ul className="space-y-4">
              {staffList.map((staff, index) => (
                <li
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg shadow-sm flex justify-between items-center hover:shadow-md transition"
                >
                  <div className="font-semibold text-lg">{staff.name}</div>
                  <div className="text-sm text-gray-500">{staff.role}</div>
                  <div className="text-sm text-gray-500">{staff.shift}</div>
                  <div className="text-sm text-gray-500">{staff.contact}</div>
                  <button
                    onClick={() => deleteStaff(staff._id)}
                    className="text-red-500 hover:text-red-700"   
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
  ) 
}

export default Staff;
