import React, { useEffect, useState } from "react";
import Header from "./Header";
import Boxies from "./Boxies";
import axios from "../../utils/axios";
import {
  FaUser,
  FaUserCircle,
  FaRegMoneyBillAlt,
  FaFileAlt,
} from "react-icons/fa";
import Staff from "./Staff";

function Dashboard() {
  const [members, setMembers] = useState([]);
  const [unpaidBillCount, setUnpaidBillCount] = useState(0);
  const [unpaidBillList, setUnpaidBillList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStaff();
    fetchMembers();
    fetchUnpaidBills();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error.message);
    }
  };

  const fetchUnpaidBills = async () => {
    try {
      const response = await axios.get("/maintenancebills", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allUnpaid = response.data.flatMap((bill) =>
        bill.members
          .filter((m) => m.status === "unpaid")
          .map((m) => ({
            billTitle: bill.title,
            month: bill.month,
            amount: bill.amount,
            dueDate: bill.dueDate,
            memberName: m.name,
            houseNumber: m.houseNumber,
          }))
      );

      setUnpaidBillCount(allUnpaid.length);
      setUnpaidBillList(allUnpaid);
    } catch (error) {
      console.error("Error fetching unpaid bills:", error.message);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await axios.get("/staff"); // GET staff list
      const shuffled = response.data.sort(() => 0.5 - Math.random());
      setStaffList(shuffled.slice(0, 4));
    } catch (error) {
      console.error("Error fetching staff:", error.message);
    }
  };
    
  
  return (
    <div className="p-6">
      <Header title={"Dashboard"} />

      {/* Summary Boxes */}
      <div className="flex flex-wrap gap-6">
        <Boxies
          title={"Total Members"}
          number={members.length}
          icon={<FaUser size={40} color="#DBAE5F" />}
        />
        <Boxies
          title={"Total Staff"}
          number={staffList.length}
          icon={<FaUserCircle size={40} color="#DBAE5F" />}
        />
        <Boxies
          title={"Society Fund"}
          number={"120L"}
          icon={<FaRegMoneyBillAlt size={40} color="#DBAE5F" />}
        />
        <Boxies
          title={"Unpaid Bills"}
          number={unpaidBillCount}
          icon={<FaFileAlt size={40} color="#DBAE5F" />}
        />
      </div>

      {/* Split Layout */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Unpaid Bill List */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-[#DBAE5F]">
            Unpaid Bills
          </h2>
          {unpaidBillList.length === 0 ? (
            <p className="text-gray-600">All bills are paid. 🎉</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-left border rounded">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3">Member</th>
                    <th className="p-3">House</th>
                    <th className="p-3">Bill</th>
                    <th className="p-3">Month</th>
                    <th className="p-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {unpaidBillList.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50 transition-all"
                    >
                      <td className="p-3">{item.memberName}</td>
                      <td className="p-3">{item.houseNumber}</td>
                      <td className="p-3">{item.billTitle}</td>
                      <td className="p-3">{item.month}</td>
                      <td className="p-3">{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Staff List + Add Staff */}
       <Staff/>
      </div>
    </div>
  );
}

export default Dashboard;
