import { useEffect, useState } from "react";
import { getMessages, deleteMessage, updateMessageStatus } from "../../../_services/contacts";

export default function AdminContacts() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);

  // ✅ FIX 1: Pindahkan fetchMessages ke DALAM useEffect
  // Sama seperti fix di admin/orders — fungsi async didefinisikan
  // di dalam useEffect agar ESLint tidak mendeteksi setState di luar effect body.
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await getMessages();
        setMessages(res.data || []);
      } catch (err) {
        console.error("Gagal memuat pesan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // ✅ FIX 3: Fungsi refresh manual — dipanggil dari tombol, bukan dari useEffect
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const res = await getMessages();
      setMessages(res.data || []);
    } catch (err) {
      console.error("Gagal refresh pesan:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus pesan ini?")) {
      try {
        await deleteMessage(id);
        // Update state lokal — tidak perlu fetch ulang semua data
        setMessages((prev) => prev.filter((m) => m.id !== id));
      } catch {
        alert("Gagal menghapus pesan.");
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "unread" ? "read" : "unread";
    try {
      await updateMessageStatus(id, newStatus);
      // Update state lokal secara langsung — tidak perlu fetch ulang
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
    } catch {
      alert("Gagal update status.");
    }
  };

  const formatTanggal = (str) =>
    new Date(str).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  // Hitung jumlah pesan belum dibaca untuk badge
  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            ✉️ Pesan & Keluhan
            {/* ✅ Badge jumlah pesan belum dibaca */}
            {unreadCount > 0 && (
              <span className="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">
                {unreadCount} baru
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Masukan dan keluhan dari pelanggan melalui website.
          </p>
        </div>

        {/* ✅ FIX 3: Tombol refresh manual */}
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {/* Icon refresh */}
          <svg
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {loading ? "Memuat..." : "Refresh"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 text-gray-400 italic">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm">Belum ada pesan masuk.</p>
            <button
              onClick={handleRefresh}
              className="mt-4 text-xs text-indigo-500 hover:underline"
            >
              Klik refresh untuk memuat ulang
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Pengirim</th>
                  <th className="px-6 py-4">Pesan / Keluhan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {messages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      msg.status === "unread" ? "bg-indigo-50/30 font-medium" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <p className="text-gray-800">{msg.name}</p>
                      <p className="text-[11px] text-gray-400">{msg.email}</p>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-gray-600 leading-relaxed">{msg.message}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(msg.id, msg.status)}
                        className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                          msg.status === "unread"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {msg.status === "unread" ? "Belum Dibaca" : "Sudah Dibaca"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-[11px] text-gray-400">
                      {formatTanggal(msg.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}