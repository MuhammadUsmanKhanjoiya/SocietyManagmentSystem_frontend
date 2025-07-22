import React, { useEffect, useState } from "react";
import Header from "./Header";
import { IoMdCloseCircle } from "react-icons/io";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

function Announcement() {
  const [announcements, setAnnouncements] = useState([]);
  const [Announcementtitle, setAnnouncementTitle] = useState("");
  const [Announcementdate, setAnnouncementDate] = useState("");
  const [Announcementdescription, setAnnouncementdescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      // ************** edit *******************//
      if (isEditing) {
        const res = await axios.put(
          `/Announcements/${editId}`,
          {
            title: Announcementtitle,
            description: Announcementdescription,
            date: Announcementdate,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAnnouncements(
          announcements.map((item) => (item._id === editId ? res.data : item))
        );
        toast.success("Announcement updated successfully");
        setIsEditing(false);
        setEditId(null);
      } else {
        // ************** add *******************//
        const res = await axios.post(
          "/Announcements",
          {
            title: Announcementtitle,
            description: Announcementdescription,
            date: Announcementdate,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAnnouncements([...announcements, res.data]);
        toast.success("Announcement added successfully");
      }

      setShowForm(false);
      setAnnouncementTitle("");
      setAnnouncementdescription("");
      setAnnouncementDate("");
    } catch (error) {
      toast.error("Failed to submit announcement");
      console.error(
        "Announcement submission failed:",
        error.response?.data?.message
      );
    }
  };

  // ************** get *******************//
  useEffect(() => {
    const fetchAnnouncements = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get("/Announcements", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAnnouncements(res.data);
      } catch (err) {
        toast.error("Failed to load announcements");
        console.error(
          "Failed to load announcements:",
          err.response?.data?.message
        );
      }
    };

    fetchAnnouncements();
  }, []);

  // ************** delete *******************//
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`/Announcements/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAnnouncements(announcements.filter((item) => item._id !== id));
      toast.success("Announcement deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err.response?.data?.message);
      toast.error("Failed to delete announcement");
    }
  };

  // ************** edit handle*******************//
  const handleEdit = (announcement) => {
    setAnnouncementTitle(announcement.title);
    setAnnouncementdescription(announcement.description);
    setAnnouncementDate(announcement.date.slice(0, 10));
    setEditId(announcement._id);
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <div className="">
      <Header title={"Announcement"} />

      <div
        className="flex justify-center items-center m-4 p-4 bg-[#DBAE5F] rounded-md shadow-md font-semibold
         hover:bg-white hover:duration-150  cursor-pointer "
        onClick={() => {
          setShowForm(true);
          setIsEditing(false);
          setAnnouncementTitle("");
          setAnnouncementdescription("");
          setAnnouncementDate("");
        }}
      >
        Add Announcement
      </div>
{/* // ************** form *******************/}
      {showForm && (
        <form onSubmit={handleAnnouncementSubmit}>
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg w-[90%] md:w-[50%] relative">
              <button
                className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                onClick={() => setShowForm(false)}
                type="button"
              >
                <IoMdCloseCircle size={35} />
              </button>
              <h2 className="text-xl font-bold mb-6 text-center">
                {isEditing ? "Edit Announcement" : "New Announcement"}
              </h2>

              <div className="flex flex-col mb-4">
                <label className="font-medium">Date</label>
                <input
                  value={Announcementdate}
                  onChange={(e) => setAnnouncementDate(e.target.value)}
                  className="px-4 py-2 border rounded focus:outline-none"
                  type="date"
                  required
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="font-medium">Title</label>
                <input
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  value={Announcementtitle}
                  className="px-4 py-2 border rounded focus:outline-none"
                  type="text"
                  placeholder="Title"
                  required
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="font-medium">Description</label>
                <textarea
                  onChange={(e) => setAnnouncementdescription(e.target.value)}
                  value={Announcementdescription}
                  className="px-4 py-2 border rounded focus:outline-none resize-none"
                  placeholder="Description"
                  rows="4"
                  required
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
{/* // ************** veiw *******************/}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm shadow-[#DBAE5F] p-5 hover:shadow-lg transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-[#DBAE5F] mb-2">
                {item.title}
              </h2>
              <p className="text-gray-700 mb-4">{item.description}</p>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                  {new Date(item.date).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Announcement;
