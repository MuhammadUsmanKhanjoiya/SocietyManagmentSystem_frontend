import Header from "./Header";
import { IoMdCloseCircle } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

function Gatepass() {
  const [Gatepasses, SetGatepasses] = useState([]);
  const [gatepassDate, setGatepassDate] = useState(null);
  const [people, setPeople] = useState("");
  const [cnic, setCnic] = useState("");
  const [purpose, setPurpose] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const { RangePicker } = DatePicker;

  {
    /************** get *******************/
  }
  useEffect(() => {
    const fetchGatepasses = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/GetPass", {
          headers: { Authorization: `Bearer ${token}` },
        });
        SetGatepasses(response.data);
      } catch (error) {
        toast.error("Failed to load gatepasses");
        console.error("Error fetching gatepasses:", error.message);
      }
    };
    fetchGatepasses();
  }, []);

  const handleGatepassSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formattedDates =
      gatepassDate && gatepassDate.length === 2
        ? [gatepassDate[0].toISOString(), gatepassDate[1].toISOString()]
        : [];

    try {
      {
        /************** edit *******************/
      }
      if (editId) {
        const res = await axios.put(
          `/GetPass/${editId}`,
          {
            date: formattedDates,
            numberOfPeople: people,
            CNIC: cnic,
            purpose: purpose,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        SetGatepasses(
          Gatepasses.map((item) => (item._id === editId ? res.data : item))
        );
        toast.success("Gatepass updated successfully");
        setEditId(null);
      } else {
        {
          /************** add  *******************/
        }
        const res = await axios.post(
          "/GetPass",
          {
            date: formattedDates,
            numberOfPeople: people,
            CNIC: cnic,
            purpose: purpose,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        SetGatepasses([...Gatepasses, res.data]);
      }
      toast.success("GatePass Add successfully");
    } catch (error) {
      toast.error("Error in  submitting gatepass");
      console.error("Error submitting gatepass:", error.message);
    }

    setGatepassDate(null);
    setPeople("");
    setCnic("");
    setPurpose("");
    setShowForm(false);
    setEditId(null);
  };

  {
    /************** delete *******************/
  }
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/GetPass/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      SetGatepasses(Gatepasses.filter((item) => item._id !== id));
      toast.success("Gatepass deleted successfully");
    } catch (error) {
      toast.error("Error deleting gatepass");
      console.error("Error deleting gatepass:", error.message);
    }
  };

  {
    /************** edit button *******************/
  }
  const handleEdit = (item) => {
    setEditId(item._id);
    setGatepassDate([dayjs(item.date[0]), dayjs(item.date[1])]);
    setPeople(item.numberOfPeople);
    setCnic(item.CNIC);
    setPurpose(item.purpose);
    setShowForm(true);
  };

  return (
    <div>
      <Header title={"Gatepass"} />

      <div
        onClick={() => {
          setShowForm(true);
          setEditId(null);
          setGatepassDate(null);
          setPeople("");
          setCnic("");
          setPurpose("");
        }}
        className="flex justify-center items-center m-4 p-4 bg-[#DBAE5F] rounded-md shadow-md font-semibold
         hover:bg-white hover:duration-150  cursor-pointer "
      >
        Make Gatepass
      </div>

      {/************** from *******************/}
      {showForm && (
        <form onSubmit={handleGatepassSubmit}>
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg w-[90%] md:w-[50%] relative">
              <button
                type="button"
                className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                onClick={() => setShowForm(false)}
              >
                <IoMdCloseCircle size={35} />
              </button>
              <h2 className="text-xl font-bold mb-6 text-center">
                {editId ? "Edit Gatepass" : "Make Happy Entries"}
              </h2>

              <div className="flex flex-col mb-4">
                <label className="font-medium">Date</label>
                <Space direction="vertical" size={12}>
                  <RangePicker
                    className="w-full px-4 py-2 border rounded focus:outline-none"
                    showTime
                    onChange={(dates) => setGatepassDate(dates)}
                    value={gatepassDate}
                  />
                </Space>
              </div>

              <div className="flex flex-col mb-4">
                <label className="font-medium">Number of people</label>
                <input
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  className="px-4 py-2 border rounded focus:outline-none"
                  type="number"
                  placeholder="Number"
                  min="1"
                  required
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="font-medium">CNIC Numbers</label>
                <input
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  className="px-4 py-2 border rounded focus:outline-none"
                  type="text"
                  placeholder="12345-6789012-3"
                  pattern="\d{5}-\d{7}-\d{1}"
                  title="Format: 12345-6789012-3"
                  required
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="font-medium">Purpose</label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="px-4 py-2 border rounded focus:outline-none resize-none"
                  placeholder="Details"
                  rows="4"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-[#DBAE5F] w-full py-2 rounded hover:bg-[#996406] text-white font-semibold"
              >
                {editId ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/************** view *******************/}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Gatepasses.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md shadow-[#DBAE5F] p-5 hover:shadow-lg transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-[#DBAE5F] mb-2">
              CNIC: {item.CNIC}
            </h2>
            <p className="text-gray-700 mb-2">People: {item.numberOfPeople}</p>
            <p className="text-gray-700 mb-2">Purpose: {item.purpose}</p>
            {item.date?.length === 2 && (
              <p className="text-sm text-gray-500">
                From: {dayjs(item.date[0]).format("DD MMM YYYY hh:mm A")} <br />
                To: {dayjs(item.date[1]).format("DD MMM YYYY hh:mm A")}
              </p>
            )}

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(item)}
                className="rounded-md bg-[#DBAE5F] text-white px-4 py-1 hover:bg-white hover:text-[#DBAE5F] border-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="rounded-md bg-[#DBAE5F] text-white px-2 hover:bg-white hover:text-[#DBAE5F] border-2"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gatepass;