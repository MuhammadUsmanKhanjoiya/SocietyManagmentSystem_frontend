import { useEffect, useState } from "react"
import Header from "./Header"
import {
  getAllBills,
  createBill,
  updateBill,
  deleteBill,
  getMyBills,
  payBill,
} from "../screens/maintenanceBillService"
import { toast } from "react-toastify"
import { IoMdCloseCircle } from "react-icons/io"
import { useMemo } from "react";

export default function MaintainenceBill() {
  const [bills, setBills] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: "",
    month: "",
    year: new Date().getFullYear(),
    amount: "",
    dueDate: "",
    members: [],
  })
  const [editingId, setEditingId] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [monthFilter, setMonthFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")



  useEffect(() => {
  const savedStatus = localStorage.getItem("statusFilter") 
  const savedMonth = localStorage.getItem("monthFilter") 
    setStatusFilter(savedStatus)
  setMonthFilter(savedMonth)
}, [])

useEffect(() => {
  localStorage.setItem("statusFilter", statusFilter)
  
}, [statusFilter])

// Save month filter when it changes
useEffect(() => {
  localStorage.setItem("monthFilter", monthFilter)
}, [monthFilter])

  useEffect(() => {
    if (!token || !role) return
    fetchBills()
  }, [token, role])

  
  

  async function fetchBills() {
    try {
      setLoading(true)
      const res = role === "admin" ? await getAllBills(token) : await getMyBills(token)
      console.log("📦 Bills fetched from API:", res.data)
      setBills(res.data)
    } catch (error) {
      console.error("Failed to load bills:", error)
      toast.error("Failed to load bills")
    } finally {
      setLoading(false)
    }
  }
useEffect(() => {
  console.log("🔍 Filtered Rows:", filteredRows);
}, [filteredRows]);
const filteredRows = useMemo(() => {
  const allRows = role === "admin"
    ? bills.flatMap((bill) =>
        bill.members.map((m) => ({
          billId: bill._id,
          title: bill.title,
          month: bill.month,
          year: bill.year,
          amount: bill.amount,
          dueDate: bill.dueDate,
          memberId: m.memberId,
          memberName: m.name,
          houseNumber: m.houseNumber,
          status: m.status,
        }))
      )
    : bills.map((b) => ({
        billId: b._id,
        title: b.title,
        month: b.month,
        year: b.year,
        amount: b.amount,
        dueDate: b.dueDate,
        status: b.status || "unpaid",
      }));

  return allRows
    .filter((r) => statusFilter === "all" || r.status === statusFilter)
    .filter((r) => monthFilter === "all" || r.month === monthFilter)
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
}, [bills, role, statusFilter, monthFilter]);

  const openForm = (bill = null) => {
    if (bill) {
      setEditingId(bill._id)
      setForm({
        title: bill.title,
        month: bill.month,
        year: bill.year,
        amount: String(bill.amount),
        dueDate: bill.dueDate.slice(0, 10),
        members: bill.members.map((m) => ({
          memberId: m.memberId,
          name: m.name,
          status: m.status,
        })),
      })
    } else {
      setEditingId(null)
      setForm({
        title: "",
        month: "",
        year: new Date().getFullYear(),
        amount: "",
        dueDate: "",
        members: [],
      })
    }
    setSearchTerm("")
    setShowForm(true)
  }

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const billData = { ...form, amount: Number(form.amount) }
      if (editingId) {
        await updateBill(editingId, billData, token)
        toast.success("Bill updated successfully!")
      } else {
        await createBill(billData, token)
        toast.success("Bill created successfully!")
      }
      setShowForm(false)
      fetchBills()
    } catch (error) {
      console.error("Save failed:", error)
      toast.error("Failed to save bill. Please try again.")
    }
  }


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return
    try {
      await deleteBill(id, token)
      toast.success("Bill deleted successfully!")
      fetchBills()
    } catch (error) {
      console.error("Delete failed:", error)
      toast.error("Failed to delete bill. Please try again.")
    }
  }

  const handlePay = async (billId) => {
    if (!window.confirm("Mark this bill as paid?")) return
    const originalBills = [...bills]
    setBills((prev) =>
      prev.map((b) =>
        b._id === billId ? { ...b, status: "paid" } : b
      )
    )
    toast.info("Marking bill as paid...")
    try {
      await payBill(billId, token)
      toast.success("Bill marked as paid!")
      fetchBills()
    } catch (error) {
      console.error("Payment failed:", error)
      toast.error("Failed to mark bill as paid. Please try again.")
      setBills(originalBills)
    }
  }

  const months = [
    "",
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  return (
    <div className="p-6">
      <Header title="Maintenance Bills" />
      {role === "admin" && (
        <>
          <button
            onClick={() => openForm()}
            className="mb-4 mt-4 bg-[#DBAE5F] hover:bg-[#996406] text-white py-2 px-4 rounded"
          >
            New Bill
          </button>
          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <label htmlFor="status-filter" className="mr-2 font-medium">Filter by status:</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
            <div>
              <label htmlFor="month-filter" className="mr-2 font-medium">Filter by month:</label>
              <select
                id="month-filter"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option value="all">All</option>
                {months.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[50%] relative">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800"
            >
              <IoMdCloseCircle size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Bill" : "New Bill"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {role === "admin" && editingId && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Search Member</h3>
                  <input
                    type="text"
                    placeholder="Search member..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border px-2 py-1 rounded w-full mb-2"
                  />
                  {searchTerm && (
                    <div className="max-h-48 overflow-y-auto pr-1 border rounded p-2">
                      {form.members
                        .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((m) => (
                          <div key={m.memberId} className="flex items-center mb-2">
                            <span className="flex-1 truncate">{m.name}</span>
                            <select
                              className="w-[120px] border rounded px-2 py-1 ml-2"
                              value={m.status}
                              onChange={(e) => {
                                const updated = [...form.members]
                                const idx = updated.findIndex(mem => mem.memberId === m.memberId)
                                if (idx !== -1) {
                                  updated[idx].status = e.target.value
                                  setForm((f) => ({ ...f, members: updated }))
                                }
                              }}
                            >
                              <option value="unpaid">Unpaid</option>
                              <option value="paid">Paid</option>
                            </select>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
              {["title", "month", "year", "amount", "dueDate"].map((field) => (
                <label key={field} className="block mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  {field === "month" ? (
                    <select
                      name="month"
                      value={form.month}
                      onChange={handleChange}
                      required
                      className="w-full border px-2 py-1 rounded mt-1"
                    >
                      <option value="">Select Month</option>
                      {months.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      name={field}
                      type={field === "year" || field === "amount" ? "number" : field === "dueDate" ? "date" : "text"}
                      value={form[field]}
                      onChange={handleChange}
                      required
                      className="w-full border px-2 py-1 rounded mt-1"
                    />
                  )}
                </label>
              ))}
              <button type="submit" className="bg-[#DBAE5F] hover:bg-[#996406] text-white py-2 rounded w-full mt-4">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading bills...</div>
      ) : filteredRows.length === 0 ? (
        <div className="text-center py-10 text-gray-600">No bills found.</div>
      ) : (
        <div className="overflow-auto rounded-md border">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Title</th>
                {role === "admin" && (
                  <>
                    <th className="p-2 text-left">Member</th>
                    <th className="p-2 text-left">House</th>
                  </>
                )}
                <th className="p-2 text-left">Month</th>
                <th className="p-2 text-left">Year</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Due</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const shownEditButtons = new Set()
                return filteredRows.map((r, index, arr) => {
                  const isFirstForBill = !shownEditButtons.has(r.billId) && arr.findIndex((x) => x.billId === r.billId) === index
                  if (isFirstForBill) shownEditButtons.add(r.billId)
                  return (
                    <tr key={`${r.billId}-${r.memberId || "me"}`} className="border-t">
                      <td className="p-2">{r.title}</td>
                      {role === "admin" && (
                        <>
                          <td className="p-2">{r.memberName}</td>
                          <td className="p-2">{r.houseNumber}</td>
                        </>
                      )}
                      <td className="p-2">{r.month}</td>
                      <td className="p-2">{r.year}</td>
                      <td className="p-2">{r.amount}</td>
                      <td className="p-2">{new Date(r.dueDate).toLocaleDateString()}</td>
                      <td className="p-2 capitalize">{r.status}</td>
                      <td className="p-2 space-x-2">
                        {role === "admin"
                          ? isFirstForBill && (
                              <>
                                <button
                                  onClick={() => openForm(bills.find((b) => b._id === r.billId) || null)}
                                  className="text-blue-600 hover:underline"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(r.billId)}
                                  className="text-red-600 hover:underline ml-2"
                                >
                                  Delete
                                </button>
                              </>
                            )
                          : r.status === "unpaid" && (
                              <button onClick={() => handlePay(r.billId)} className="text-green-600 hover:underline">
                                Pay
                              </button>
                            )}
                      </td>
                    </tr>
                  )
                })
              })()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}






