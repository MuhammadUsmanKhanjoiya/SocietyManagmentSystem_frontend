import axios from "axios";

const instance = axios.create({
  baseURL: "https://society-backend-0spo.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
