import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import Header from "./Header";
import { toast } from "react-toastify";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [recipient, setRecipient] = useState(null);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMessages();
    if (role === "admin") {
      fetchUsers();
      fetchBlockedUsers();
    }
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("/chat/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch {
      toast.error("Failed to load messages");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/chat/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  const fetchBlockedUsers = async () => {
    try {
      const res = await axios.get("/chat/blocked", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlockedUsers(res.data);
    } catch {
      toast.error("Failed to load blocked status");
    }
  };

  const sendMessage = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await axios.post(
        "/chat/send",
        {
          content,
          recipient: role === "admin" ? recipient || null : undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent("");
      setRecipient(null);
      fetchMessages();
    } catch (err) {
      toast.error(err.response?.data?.error || "Send failed");
      if (err.response?.data?.error.includes("blocked")) {
        setBlocked(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await axios.delete(`/chat/message/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMessages();
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleBlock = async (id, isBlocked) => {
    try {
      const url = isBlocked ? `/chat/unblock/${id}` : `/chat/block/${id}`;
      await axios.post(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(isBlocked ? "Unblocked" : "Blocked");
      fetchBlockedUsers();
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="p-4">
      <Header title="Group Chat" />

      <div className="bg-white rounded shadow p-4 max-h-[60vh] overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-3 p-2 rounded ${
              msg.sender?.role === "admin" ? "bg-blue-50" : "bg-gray-50"
            }`}
          >
            <div className="text-sm text-gray-700">

              <span className="text-gray-500 text-xs">
                {msg.recipient ? "(Private)" : ""}
              </span>
            </div>

            <div className="text-sm text-gray-700">
<strong>{msg.sender?.name || "Unknown Sender"}</strong>

              <span className="text-gray-500 text-xs">
                {msg.recipient ? "(Private)" : ""}
              </span>
            </div>
            <div className="text-base">{msg.content}</div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(msg.createdAt).toLocaleString()}
            </div>
            {role === "admin" && (
              <button
                onClick={() => deleteMessage(msg._id)}
                className="text-red-500 text-xs mt-1"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {blocked ? (
        <div className="text-red-600 text-center font-semibold">
          You are blocked from sending messages.
        </div>
      ) : (
        <div className="flex gap-2 mb-4">
          {role === "admin" && (
            <input
              type="text"
              placeholder="Recipient ID (optional)"
              className="border px-2 py-1 rounded w-1/4"
              value={recipient || ""}
              onChange={(e) => setRecipient(e.target.value)}
            />
          )}
          <input
            type="text"
            placeholder="Type a message"
            className="border px-2 py-1 rounded flex-1"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      )}

      {/* Admin Controls for Blocking */}
      {role === "admin" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Manage Members</h2>
          <div className="max-h-60 overflow-y-auto">
            {users.map((u) => (
              <div
                key={u._id}
                className="flex justify-between items-center mb-2"
              >
                <span>
                  {u.name} ({u.role})
                </span>
                {u.role === "member" && (
                  <button
                    onClick={() =>
                      toggleBlock(u._id, blockedUsers.includes(u._id))
                    }
                    className={`px-3 py-1 rounded text-white ${
                      blockedUsers.includes(u._id)
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {blockedUsers.includes(u._id) ? "Unblock" : "Block"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
