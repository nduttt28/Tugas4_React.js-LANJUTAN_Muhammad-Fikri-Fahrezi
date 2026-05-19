import { useState, useEffect } from "react";
import { getAuthorById, updateAuthor } from "../../../_services/authors";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function AdminAuthorEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAuthorById(id);
        setName(data.name);
        setBio(data.bio || "");
      } catch (err) {
        alert("Gagal mengambil data penulis.");
        navigate("/admin/authors");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAuthor(id, { name, bio });
      navigate("/admin/authors");
    } catch (err) {
      alert("Gagal mengupdate penulis.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-20">Memuat data...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/admin/authors" className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-gray-800">✏️ Edit Penulis</h1>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Biografi (Opsional)</label>
            <textarea 
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            ></textarea>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Update Penulis"}
            </button>
            <Link to="/admin/authors" className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
