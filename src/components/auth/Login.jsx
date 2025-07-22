import { useState } from "react";
import { toast } from "react-toastify";
import axios from "../../utils/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  {/************** login *******************/}
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });

 console.log("Raw response", res);
      const { token, user } = res.data;
      console.log("token",token);
      console.log("user",user);
      
      if (!token || !user) {
        toast.error("Invalid response from server");
        return;
      }
      console.log("tokan" , res.data);
      
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      
      if (user.role === "admin") {
        window.location.href = "/dashboard";
      } else if (user.role === "member") {
        window.location.href = "/member-home";
      } else {
        window.location.href = "/";
      }
      toast.success("Login successful");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#DBAE5F] h-screen flex justify-center items-center">
      <div className="w-[40%] bg-[#F5F5F5] p-8 rounded-lg shadow-md text-[#000000]">
        <h1 className="text-center text-3xl font-bold my-6">Login</h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-col mb-8">
            <label className="font-bold">Email</label>
            <input
              className="border-2 rounded border-[#303030] px-4 py-2 bg-transparent"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col mb-8">
            <label className="font-bold">Password</label>
            <input
              className="border-2 rounded border-[#303030] px-4 py-2 bg-transparent"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#DBAE5F] hover:bg-[#996406] text-white py-2 rounded-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
