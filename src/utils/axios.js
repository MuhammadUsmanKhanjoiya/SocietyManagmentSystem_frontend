import axios from "axios";

const instance = axios.create({
  baseURL: "https://society-backend-ivory.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
