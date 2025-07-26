import axios from "../../utils/axios" // Assuming this path is correct for your axios instance

export const getAllBills = async (token) =>
const res = await  axios.get("/maintenancebills", {
    headers: { Authorization: `Bearer ${token}` },
  })
console.log("✅ /maintenancebills response:", response.data);

export const createBill = (data, token) =>
  axios.post("/maintenancebills", data, {
    headers: { Authorization: `Bearer ${token}` },
  })

export const updateBill = (id, data, token) =>
  axios.put(`/maintenancebills/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })

export const deleteBill = (id, token) =>
  axios.delete(`/maintenancebills/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

export const getMyBills = (token) =>
  axios.get("/maintenancebills/my", {
    headers: { Authorization: `Bearer ${token}` },
  })

export const payBill = (billId, token) =>
  axios.put(`/maintenancebills/pay/${billId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  })
