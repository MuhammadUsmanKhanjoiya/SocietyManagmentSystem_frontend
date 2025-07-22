import Header from "./Header";
import { IoMdCloseCircle } from "react-icons/io";
import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

function Complain() {
  const [Complains, setComplains] = useState([]);
  const [ComplainDate, setComplainDate] = useState("");
  const [ApartmentNumber, setApartmentNumber] = useState("");
  const [ContactNumber, setContactNumber] = useState("");
  const [ComplainTitle, setComplainTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [status, setstatus]= useState("")
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  {
    /************** get *******************/
  }
  useEffect(() => {
    const fetchComplains = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/Complains", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplains(response.data);
                
      } catch (error) {
        toast.error("Error fetching complains:",error.message);        
        console.error("Error fetching complains:", error.message);
      }
    };
    fetchComplains();
  }, []);

  const handleComplainSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      {
        /************** edit *******************/
      }
      if (isEditing) {
        const res = await axios.put(
          `/Complains/${editId}`,
          {
            date: ComplainDate,
            HouseNumber: ApartmentNumber,
            contactNumber: ContactNumber,
            status:status,
            title: ComplainTitle,
            description: Description,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setComplains(
          Complains.map((item) => (item._id === editId ? res.data : item))
        );
        toast.success("Announcement Updated successfully");
        setIsEditing(false);
        setEditId(null);
      } else {
        {
          /************** add *******************/
        }
        const res = await axios.post(
          "/Complains",
          {
            date: ComplainDate,
            HouseNumber: ApartmentNumber,
            contactNumber: ContactNumber,
            title: ComplainTitle,
            description: Description,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setComplains([...Complains, res.data]);
      toast.success("Announcement add successfully");
      }
    } catch (error) {
        toast.error("Error submitting complain:",error.message);        
      console.error("Error submitting complain:", error.message);
    }

    (setComplainDate(""),
      setApartmentNumber(""),
      setContactNumber(""),
      setComplainTitle(""),
      setDescription(""));
    setShowForm(false);
  };
  {
    /************** delete *******************/
  }
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/Complains/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplains(Complains.filter((item) => item._id !== id));
    toast.success("Announcement deleted successfully");
    } catch (error) {
        toast.error("Error deleting complain:",error.message);        
       console.error("Error deleting complain:", error.message);
    }
  };
  {
    /************** edit button *******************/
  }
  const handleEdit = (item) => {
    setComplainDate(item.date);
    setApartmentNumber(item.HouseNumber);
    setContactNumber(item.contactNumber);
    setComplainTitle(item.title);
    setDescription(item.description);
    setIsEditing(true);
    setEditId(item._id);
    setShowForm(true);
  };

  return (
    <div>
      <Header title={"Complain"} />
      {/************** add button *******************/}
      <div
        className="flex justify-center items-center m-4 p-4 bg-[#DBAE5F] rounded-md shadow-md font-semibold
         hover:bg-white hover:duration-150  cursor-pointer"
        onClick={() => setShowForm(true)}
      >
        Add Complain
      </div>

      {/************** form *******************/}
      {showForm && (
        <form onSubmit={handleComplainSubmit}>
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center  bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-white p-6  rounded-lg shadow-lg w-[90%] md:w-[50%] relative">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                onClick={() => setShowForm(false)}
              >
                <IoMdCloseCircle size={35} />
              </button>
              <h2 className="text-xl font-bold mb-6 text-center">Complain</h2>

              <div className="flex flex-col mb-4">
                <label className="font-medium">Complain Date</label>
                <input
                  value={ComplainDate}
                  onChange={(e) => setComplainDate(e.target.value)}
                  className="px-4 py-2 border rounded focus:outline-none"
                  type="date"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-medium">House/Apartment Number</label>
                <input
                  onChange={(e) => setApartmentNumber(e.target.value)}
                  value={ApartmentNumber}
                  className="px-4 py-2 border rounded focus:outline-none"
                  type="text"
                  placeholder="A area 234"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-medium">Contact Number</label>
                <input
                  onChange={(e) => setContactNumber(e.target.value)}
                  value={ContactNumber}
                  className="px-4 py-2 border rounded focus:outline-none"
                  type="text"
                  placeholder="0300-0000000"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-medium">status</label>
                <input
                  onChange={(e) => setstatus(e.target.value)}
                  value={status}
                  className="px-4 py-2 border rounded focus:outline-none"
                  type="text"
                  placeholder="status"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-medium">Title</label>
                <input
                  onChange={(e) => setComplainTitle(e.target.value)}
                  value={ComplainTitle}
                  className="px-4 py-2 border rounded focus:outline-none"
                  type="text"
                  placeholder="Title name"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-medium">Description</label>
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  value={Description}
                  className="px-4 py-2 border rounded focus:outline-none resize-none"
                  placeholder="Details"
                  rows="3"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-[#DBAE5F] w-full py-2 rounded hover:bg-[#996406] text-white font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      )}
      {/************** veiw *******************/}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Complains.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md shadow-[#DBAE5F] p-5 hover:shadow-lg transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-[#DBAE5F] mb-2">
                {item.title}
              </h2>

              <p className="text-gray-700 mb-4 overflow-x-auto">
                {item.description}
              </p>
              <p className="text-gray-700 mb-4 overflow-x-auto">
                {item.contactNumber}
              </p>
              <p className="text-gray-700 mb-4 overflow-x-auto">
                {item.HouseNumber}
              </p>
              <p className="text-gray-700 mb-4 overflow-x-auto">
                {item.status}
              </p>

              <div className="flex justify-between aline-center mt-4">
                <p className="text-sm text-gray-500 ">{new Date(item.date).toLocaleString()}</p>
                <button
                  onClick={() => handleEdit(item)}
                  className="rounded-md bg-[#DBAE5F] 
               text-white px-4 py-1 rounded hover:bg-white hover:text-[#DBAE5F] border-2 
               hover:border-color-[#DBAE5F]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
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

export default Complain;
