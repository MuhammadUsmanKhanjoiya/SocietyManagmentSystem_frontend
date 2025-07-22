import React, { useEffect, useState } from "react";
import Header from "./Header";
import { IoMdCloseCircle } from "react-icons/io";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

function Events() {
  const [Events, setEvents] = useState([]);
  const [Eventtitle, setEventTitle] = useState("");
  const [Eventdate, setEventDate] = useState("");
  const [Eventtime, setEventTime] = useState("");
  const [Eventaddress, setEventAddress] = useState("");
  const [EventDetails, setEventDetails] = useState("");
  const [showform, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    // ************** edit *******************//
    if (isEditing) {
      try {
        const res = await axios.put(
          `/Events/${editId}`,
          {
            title: Eventtitle,
            date: Eventdate,
            time: Eventtime,
            address: Eventaddress,
            details: EventDetails,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setEvents(
          Events.map((item) => (item._id === editId ? res.data : item))
        );
        
         setIsEditing(false);
        setEditId(null);
        toast.success("Event updated successfully");
      } catch (error) {
        console.error("Error updating event:", error.message);
        Toast.error("Failed to update event");
      }
    } else {
      // ************** add *******************//
      if (!token) {
        console.error("No token found in localStorage");
        toast.error("You are not authorized to perform this action");
        return;
      }
      try {
        const res = await axios.post(
          "/Events",
          {
            title: Eventtitle,
            date: Eventdate,
            time: Eventtime,
            address: Eventaddress,
            details: EventDetails,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEvents([...Events, res.data]);
        toast.success("Event added successfully");
          
      } catch (error) {
        console.error("Error submitting event:", error.message);
        toast.error("Failed to submit event");
      }
    }
    (setEventTitle(""),
      setEventDate(""),
      setEventAddress(""),
      setEventTime(""));
    setEventDetails("");
    setShowForm(false);
  };

  // ************** get *******************//
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("/Events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched events:", res.data);
        setEvents(res.data);
      } catch (error) {
        log.error("Error fetching events:", error.message);
        toast.error("Failed to load events");
      }
    };
    fetchEvents();
  }, []);

  // ************** delete *******************//
  const handleRemoveEvent = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/Events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(Events.filter((item) => item._id !== id));
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error.message);
      toast.error("Failed to delete event");
    }
  };

  // ************** edit button *******************//
  const handleEditEvent = (item) => {
    setEventTitle(item.title);
    setEventDate(item.date);
    setEventTime(item.time);
    setEventAddress(item.address);
    setEventDetails(item.details);
    setShowForm(true);
    setIsEditing(true);
  };

  return (
    <div className="">
      <Header title={"Events"} />

      {/************** add button *******************/}
      <div
        className="flex justify-center items-center m-4 p-4 bg-[#DBAE5F] rounded-md shadow-md font-semibold
         hover:bg-white hover:duration-150  cursor-pointer"
        onClick={() => setShowForm(true)}
      >
        Add Events
      </div>

      {/*************** from *******************/}
      {showform && (
        <form onSubmit={handleEventSubmit}>
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center  bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-white p-6  rounded-lg shadow-lg w-[90%] md:w-[50%] relative">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                onClick={() => setShowForm(false)}
              >
                <IoMdCloseCircle size={35} />
              </button>
              <h2 className="text-xl font-bold mb-6 text-center">New Events</h2>

              <div className="flex flex-col mb-4">
                <label className="font-medium">Event Title</label>
                <input
                  onChange={(e) => setEventTitle(e.target.value)}
                  value={Eventtitle}
                  className="px-4 py-2 border rounded focus:outline-none"
                  type="text"
                  placeholder="Event Title"
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="font-medium">Date</label>
                <input
                  onChange={(e) => setEventDate(e.target.value)}
                  value={Eventdate}
                  className="px-4 py-2 border rounded focus:outline-none"
                  type="date"
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="font-medium">Time</label>
                <input
                  onChange={(e) => setEventTime(e.target.value)}
                  value={Eventtime}
                  className="px-4 py-2 border rounded focus:outline-none"
                  type="time"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-medium">Address</label>
                <input
                  onChange={(e) => setEventAddress(e.target.value)}
                  value={Eventaddress}
                  className="px-4 py-2 border rounded focus:outline-none"
                  type="text"
                  placeholder="Address"
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="font-medium">Details</label>
                <textarea
                  value={EventDetails}
                  onChange={(e) => setEventDetails(e.target.value)}
                  className="px-4 py-2 border rounded focus:outline-none resize-none"
                  placeholder="Details About Event ..."
                  rows="3"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-[#DBAE5F] w-full py-2 rounded hover:bg-[#996406] text-white font-semibold"
              >
                {isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </form>
      )}
      {/************** veiw *******************/}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Events.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md shadow-[#DBAE5F] p-5 hover:shadow-lg transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-[#DBAE5F] mb-2">
                {item.title}
              </h2>

              <p className="text-gray-700 mb-4 overflow-x-auto">
                {item.details}
              </p>
              <p className="text-gray-700 mb-4 overflow-x-auto">
                {item.address}
              </p>
              <p className="text-gray-700 mb-4 overflow-x-auto">{item.time}</p>

              <div className="flex justify-between aline-center mt-4">
                <p className="text-sm text-gray-500 ">
                  {new Date(item.date).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleEditEvent(item)}
                  className="rounded-md bg-[#DBAE5F] text-white px-4 py-1 rounded hover:bg-white
                hover:text-[#DBAE5F] border-2 hover:border-color-[#DBAE5F]"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleRemoveEvent(item._id)}
                  className="rounded-md bg-[#DBAE5F] text-white px-4 py-1 rounded hover:bg-white
                hover:text-[#DBAE5F] border-2 hover:border-color-[#DBAE5F]"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events;
