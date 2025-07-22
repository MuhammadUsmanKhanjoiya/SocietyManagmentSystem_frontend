import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "../../utils/axios";
import { IoMdCloseCircle } from "react-icons/io";
import { toast } from "react-toastify";

function Neighbourhood() {
  const [places, setPlaces] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  {
    /************** get *******************/
  }
  useEffect(() => {
    const fetchNeighbourhood = async () => {
      const token = localStorage.getItem("token");
     console.log("TOKEN:", token);
      try {
        const response = await axios.get("/Neighbourhood", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlaces(response.data);
           toast.success("Neighbourhood load successfully");
      } catch (error) {
           toast.error("Error fetching neighbourhoods");
        console.error("Error fetching neighbourhoods:", error.message);
      }
    };
    fetchNeighbourhood();
  }, []);

  const handleNeighbourhoodSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    {
      /************** edit *******************/
    }
    try {
      if (isEditing) {
        const res = await axios.put(
          `/Neighbourhood/${editId}`,
          {
            title,
            subtitle,
            description,
            contactNumber,
            imageUrl,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPlaces(
          places.map((item) => (item._id === editId ? res.data : item))
        );
        toast.success("Neighbourhood updated successfully");
        setIsEditing(false);
        setEditId(null);
      } else {
        {
          /************** add *******************/
        }
        const res = await axios.post(
          "/Neighbourhood",
          {
            title,
            subtitle,
            description,
            contactNumber,
            imageUrl,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPlaces([...places, res.data]);
        toast.success("Neighbourhood added successfully");

      }
    } catch (error) {
      toast.error("Error submitting neighbourhood");
      console.error("Error submitting neighbourhood:", error.message);
    }

    setTitle("");
    setSubtitle("");
    setDescription("");
    setContactNumber("");
    setImageUrl("");
    setShowForm(false);
  };
  {
    /************** delete *******************/
  }
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/Neighbourhood/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlaces(places.filter((item) => item._id !== id));
      toast.success("Neighbourhood deleted successfully");
    } catch (error) {
      toast.error("Error deleting neighbourhood");
      console.error("Error deleting neighbourhood:", error.message);
    }
  };

  {
    /************** edit *******************/
  }
  const handleEdit = (item) => {
    setTitle(item.title);
    setSubtitle(item.subtitle);
    setDescription(item.description);
    setContactNumber(item.contactNumber);
    setImageUrl(item.imageUrl);
    setIsEditing(true);
    setEditId(item._id);
    setShowForm(true);
  };

  return (
    <div>
      <Header title={"Neighbourhood"} />
      <div
        className="flex justify-center items-center m-4 p-4 bg-[#DBAE5F] rounded-md shadow-md font-semibold
         hover:bg-white hover:duration-150  cursor-pointer "
        onClick={() => setShowForm(true)}
      >
        Add Neighbourhood
      </div>
      {/************** form *******************/}
      {showForm && (
        <form onSubmit={handleNeighbourhoodSubmit}>
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[50%] relative">
              <button
                className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                onClick={() => setShowForm(false)}
              >
                <IoMdCloseCircle size={35} />
              </button>

              <h2 className="text-xl font-bold mb-6 text-center">
                Neighbourhood
              </h2>

              <div className="flex flex-col mb-4">
                <label className="font-medium">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-4 py-2 border rounded focus:outline-none"
                  type="text"
                  placeholder="Title"
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="font-medium">Subtitle</label>
                <input
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="px-4 py-2 border rounded focus:outline-none"
                  type="text"
                  placeholder="Subtitle"
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="font-medium">Contact Number</label>
                <input
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="px-4 py-2 border rounded focus:outline-none"
                  type="text"
                  placeholder="0300-0000000"
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="font-medium">Image URL</label>
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="px-4 py-2 border rounded focus:outline-none"
                  type="text"
                  placeholder="Paste image URL"
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-4 py-2 border rounded focus:outline-none resize-none"
                  placeholder="Description"
                  rows="3"
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
      {places.map((item, index) => (
        <div key={index} className="w-full bg-white m-4 p-6 rounded shadow-sm">
          <div className="">
            <h1 className="text-3xl font-semibold">{item.title}</h1>
            <div className="flex item-center mt-3">
              <div className="w-1/4 mr-4 p-4 shadow-md rounded-md">
                {item.imageUrl}
              </div>
              <div className="flex flex-col pb-8 p-4 shadow-md rounded-md">
                <h1 className="text-xl font-bold mb-4">{item.subtitle}</h1>
                <p className="mb-2">{item.description}</p>
                <span className="mb-4">Contact: {item.contactNumber}</span>
                <div>
                  <button
                    onClick={() => handleEdit(item)}
                    className="rounded-md bg-[#DBAE5F] text-white px-4 py-1 hover:bg-white 
                    hover:text-[#DBAE5F] border-2 border-[#DBAE5F] mr-10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="rounded-md bg-[#DBAE5F] text-white px-4 py-1 hover:bg-white hover:text-[#DBAE5F] border-2 border-[#DBAE5F]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Neighbourhood;
