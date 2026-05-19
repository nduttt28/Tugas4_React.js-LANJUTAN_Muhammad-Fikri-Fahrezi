import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getGenres } from "../../../_services/genres";
import { getAuthors } from "../../../_services/authors";
import { showBook, updateBook } from "../../../_services/books";

export default function BookEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Preview gambar lama
  const [currentCover, setCurrentCover] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    genre_id: "",
    author_id: "",
    description: "",
    cover_photo: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ambil data Genres, Authors, dan Detail Buku secara paralel
        const [genresResponse, authorsResponse, bookResponse] = await Promise.all([
          getGenres(),
          getAuthors(),
          showBook(id),
        ]);

        // Laravel Resource biasanya membungkus data dalam { data: [...] }
        setGenres(genresResponse?.data || genresResponse);
        setAuthors(authorsResponse?.data || authorsResponse);

        const bookData = bookResponse?.data || bookResponse;

        if (bookData) {
          setFormData({
            title: bookData.title || "",
            price: bookData.price || "",
            stock: bookData.stock || "",
            genre_id: bookData.genre_id || "",
            author_id: bookData.author_id || "",
            description: bookData.description || "",
            cover_photo: null, // Tetap null kecuali user pilih file baru
          });
          // Simpan nama file lama untuk info saja
          setCurrentCover(bookData.cover_photo);
        }
      } catch (error) {
        console.error("Gagal load data edit:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("genre_id", formData.genre_id);
      data.append("author_id", formData.author_id);
      data.append("description", formData.description);
      
      // Hanya append jika user memilih file baru
      if (formData.cover_photo) {
        data.append("cover_photo", formData.cover_photo);
      }

      // updateBook sudah menangani _method: PUT di dalam service-nya
      await updateBook(id, data);
      
      alert("Buku berhasil diperbarui!");
      navigate("/admin/books");
    } catch (error) {
      console.error("Update gagal:", error);
      alert("Gagal mengupdate buku. Pastikan port 8001 sudah aktif.");
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">Loading Data...</div>;

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md dark:bg-gray-800 border border-gray-200">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white border-b pb-4">Edit Book</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-semibold">Judul Buku</label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold">Harga (Rp)</label>
              <input
                type="number"
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold">Stok</label>
              <input
                type="number"
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold">Genre</label>
              <select
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                value={formData.genre_id}
                onChange={(e) => setFormData({ ...formData, genre_id: e.target.value })}
                required
              >
                <option value="">Pilih Genre</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold">Penulis</label>
              <select
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                value={formData.author_id}
                onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
                required
              >
                <option value="">Pilih Penulis</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-semibold">Cover Photo</label>
              {currentCover && !formData.cover_photo && (
                <p className="text-xs text-gray-500 mb-2">Cover saat ini: <span className="font-mono text-indigo-600">{currentCover}</span></p>
              )}
              <input
                type="file"
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 file:bg-gray-100 file:border-0 file:py-2 file:px-4 hover:file:bg-gray-200"
                onChange={(e) => setFormData({ ...formData, cover_photo: e.target.files[0] })}
              />
              <p className="mt-1 text-xs text-gray-400 italic">*Biarkan kosong jika tidak ingin mengganti gambar.</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-semibold">Deskripsi</label>
              <textarea
                rows="4"
                className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-8">
            <button type="submit" className="text-white bg-indigo-600 hover:bg-indigo-700 font-bold rounded-lg text-sm px-8 py-3 transition-colors">
              Update Book
            </button>
            <Link to="/admin/books" className="text-gray-600 border border-gray-300 hover:bg-gray-50 font-medium rounded-lg text-sm px-8 py-3">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}