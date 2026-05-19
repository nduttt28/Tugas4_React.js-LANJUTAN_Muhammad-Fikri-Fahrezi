import { useEffect, useState } from "react";
import { getAuthors, deleteAuthor } from "../../../_services/authors";
import { Link } from "react-router-dom";

export default function AdminAuthors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const data = await getAuthors();
      setAuthors(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus penulis ini? Semua buku milik penulis ini mungkin akan terpengaruh.")) {
      try {
        await deleteAuthor(id);
        fetchAuthors();
      } catch (err) {
        alert("Gagal menghapus penulis.");
      }
    }
  };

  const filteredAuthors = authors.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">✍️ Kelola Penulis</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar semua penulis buku di sistem.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Cari penulis..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
          />
          <Link to="/admin/authors/create" className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors whitespace-nowrap">
            + Tambah Penulis
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-6 py-4">Nama Penulis</th>
              <th className="px-6 py-4">Bio</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
               <tr><td colSpan="3" className="px-6 py-10 text-center text-gray-400 italic">Memuat data...</td></tr>
            ) : filteredAuthors.length > 0 ? (
              filteredAuthors.map((author) => (
                <tr key={author.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-800">{author.name}</td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{author.bio || "-"}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Link to={`/admin/authors/edit/${author.id}`} className="text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg font-medium transition-colors">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(author.id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium transition-colors">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" className="px-6 py-10 text-center text-gray-400">Tidak ada data penulis.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
