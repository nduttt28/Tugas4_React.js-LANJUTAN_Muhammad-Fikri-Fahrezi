import { useEffect, useState } from "react";
import { getAllUsers } from "../../../_services/admin";

/**
 * Halaman Admin: Daftar User Terdaftar
 *
 * Menampilkan semua user yang sudah daftar di aplikasi.
 * Data diambil dari GET /api/admin/users (hanya admin yang bisa akses).
 */
export default function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");  // Untuk filter di frontend

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data || []);
      } catch (err) {
        console.error("Gagal memuat data user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter user berdasarkan nama atau email (dilakukan di frontend, bukan API)
  // Ini lebih simpel karena jumlah user biasanya tidak terlalu banyak
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Format tanggal ke format Indonesia: "15 Mei 2026"
  const formatTanggal = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">👥 Daftar User</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Total {users.length} user terdaftar
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 font-semibold text-gray-600 text-xs uppercase">#</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 text-xs uppercase">Nama</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 text-xs uppercase">Email</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 text-xs uppercase">Role</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 text-xs uppercase">Bergabung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 text-gray-400">{index + 1}</td>
                      <td className="px-5 py-3.5">
                        {/* Avatar inisial nama */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-indigo-600">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{user.email}</td>
                      <td className="px-5 py-3.5">
                        {/* Badge Role: warna berbeda untuk admin vs customer */}
                        <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          user.role === "admin"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-indigo-50 text-indigo-600"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {formatTanggal(user.created_at)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-gray-400">
                      <p className="text-4xl mb-2">👤</p>
                      <p className="text-sm">
                        {search ? `User "${search}" tidak ditemukan` : "Belum ada user terdaftar"}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}