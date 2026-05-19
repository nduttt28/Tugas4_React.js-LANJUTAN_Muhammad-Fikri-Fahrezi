import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { deleteBook, getBooks } from "../../../_services/books";
import { getGenres } from "../../../_services/genres";
import { getAuthors } from "../../../_services/authors";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [search, setSearch] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, genresData, authorsData] = await Promise.all([
          getBooks(),
          getGenres(),
          getAuthors(),
        ]);
        setBooks(booksData || []);
        setGenres(genresData || []);
        setAuthors(authorsData || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const getGenreName = (id) => {
    const genre = genres.find((g) => g.id === id);
    return genre ? genre.name : "Unknown";
  };

  const getAuthorName = (id) => {
    const author = authors.find((a) => a.id === id);
    return author ? author.name : "Unknown";
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(id);
        setBooks(books.filter((book) => book.id !== id));
      } catch (err) {
        alert("Failed to delete book.");
      }
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <section className="bg-gray-50 p-3 sm:p-5">
        <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                   🔍
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5 outline-none transition-all"
                  placeholder="Cari judul buku..."
                />
              </div>
            </div>
            <div className="w-full md:w-auto">
              <Link
                to="/admin/books/create"
                className="flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl text-sm px-5 py-2.5 transition-colors"
              >
                + Tambah Buku
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-[10px] text-gray-400 uppercase bg-gray-50 font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-4">Judul Buku</th>
                  <th className="px-4 py-4">Harga</th>
                  <th className="px-4 py-4 text-center">Stok</th>
                  <th className="px-4 py-4">Cover</th>
                  <th className="px-4 py-4">Genre</th>
                  <th className="px-4 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                      <th className="px-4 py-4 font-semibold text-gray-800 whitespace-nowrap">
                        {book.title}
                      </th>
                      <td className="px-4 py-4 text-indigo-600 font-bold">
                        Rp{Number(book.price).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-4 text-center font-medium">{book.stock}</td>
                      <td className="px-4 py-4">
                        <img 
                          src={book.cover_photo ? `http://localhost:8001/storage/books/${book.cover_photo}` : "https://via.placeholder.com/40x60?text=No+Cover"} 
                          alt={book.title} 
                          className="w-10 h-14 object-cover rounded shadow-sm"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/40x60?text=No+Cover"; }}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-bold uppercase">
                          {getGenreName(book.genre_id)}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-1">{getAuthorName(book.author_id)}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                           <Link to={`/admin/books/edit/${book.id}`} className="text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg font-medium transition-colors">
                             Edit
                           </Link>
                           <button onClick={() => handleDelete(book.id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium transition-colors">
                             Hapus
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-gray-400">
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}