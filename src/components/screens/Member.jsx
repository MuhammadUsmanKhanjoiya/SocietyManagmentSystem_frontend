import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

function Member() {
  const [members, setMembers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  {
    /*********** get ***********/
  }
  useEffect(() => {
    const fetchMembers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMembers(res.data);
        const currentUserRes = await axios.get("/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUserId(currentUserRes.data._id);
        toast.success("Members loaded successfully.");
      } catch (error) {
       
        console.error("Error fetching users:", error.response?.data?.message);
      }
    };

    fetchMembers();
  }, []);

  {
    /*********** delete ***********/
  }
  const handleRemove = async (id) => {
    const token = localStorage.getItem("token");
    if (id === currentUserId) {
      toast.error("You cannot delete your own account.");
      return;
    }
    try {
      await axios.delete(`/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMembers((prev) => prev.filter((user) => user._id !== id));
      toast.success("User deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete user.");
      console.error("Delete failed:", error.response?.data?.message);
    }
  };

  return (
    <div>
      <Header title="Members" />
      <div className="flex justify-end px-6 py-4">
        <button
          onClick={() => window.location.href = "/signup"}
          className="bg-[#DBAE5F] text-black px-4 py-2 rounded hover:bg-white mr-4 hover:text-[#DBAE5F] border-2 border-[#DBAE5F] font-semibold"
        >
          Create User
        </button>
      </div>

      <div className="overflow-x-auto px-6 py-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left text-lg font-semibold text-gray-700">
                Name
              </th>
              <th className="py-3 px-4 text-left text-lg font-semibold text-gray-700">
                House No
              </th>
              <th className="py-3 px-4 text-left text-lg font-semibold text-gray-700">
                Email
              </th>
              <th className="py-3 px-4 text-left text-lg font-semibold text-gray-700">
                Role
              </th>
              <th className="py-3 px-4 text-left text-lg font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((user, index) => (
              <tr
                key={user._id}
                className="border-t border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-4 text-gray-800">{user.name}</td>
                <td className="py-3 px-4 text-gray-600">{user.HouseNumber}</td>
                <td className="py-3 px-4 text-gray-500">{user.email}</td>
                <td className="py-3 px-4 text-gray-500 capitalize">
                  {user.role}
                </td>
                <td className="py-3 px-4 text-center">
                  {user._id !== currentUserId && (
                    <button
                      onClick={() => handleRemove(user._id)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Member;
