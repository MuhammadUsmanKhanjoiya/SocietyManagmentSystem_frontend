import { useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const[houseNumber , setHouseNumber] = useState ("");
  const [loading, setLoading] = useState(false);


const [message, setMessage] = useState("");

  {
    /************** signUp *******************/
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/registor",
        {
          name: username,
          email,
          password,
          role: "member",
          HouseNumber : houseNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("User registered successfully");
    } catch (err) {
      console.error(err.response?.data?.message);
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#DBAE5F] h-screen flex justify-center items-center">
      <div className="w-[40%] bg-[#F5F5F5] p-8 rounded-lg shadow-md text-[#000000]">
        <h1 className="text-center text-3xl font-bold my-6">
          Admin Create User
        </h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          {message && (
            <p className="text-center text-green-600 mb-4">{message}</p>
          )}
          <label className="font-bold">Username</label>
          <input
            className="border-2 rounded border-[#303030] px-4 py-2 bg-transparent mb-4"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
            required
          />
          <label className="font-bold">Email</label>
          <input
            className="border-2 rounded border-[#303030] px-4 py-2 bg-transparent mb-4"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            required
          />

          <label className="font-bold">Password</label>
          <input
            className="border-2 rounded border-[#303030] px-4 py-2 bg-transparent mb-4"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            required
          />
             <label className="font-bold">House Number</label>
          <input
            className="border-2 rounded border-[#303030] px-4 py-2 bg-transparent mb-4"
            onChange={(e) => setHouseNumber(e.target.value)}
            value={houseNumber}
            type="text"
            required
          />


          <button
            type="submit"
            className="bg-[#DBAE5F] hover:bg-[#996406] text-white py-2 rounded-md"
          >
            {loading ? "User Creating.." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
