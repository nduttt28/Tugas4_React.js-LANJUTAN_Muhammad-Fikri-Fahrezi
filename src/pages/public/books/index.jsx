import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks } from "../../../_services/books";

export default function Books() {
  // State untuk menyimpan semua buku dari API
  const [books, setBooks] = useState([]);

  // State untuk menyimpan teks yang diketik user di kotak search
  const [searchInput, setSearchInput] = useState("");

  // State untuk kata kunci yang benar-benar dikirim ke API
  // (kita pakai state terpisah agar tidak kirim request tiap ketik huruf)
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk indikator loading (menampilkan "Memuat...")
  const [loading, setLoading] = useState(true);

  // useEffect = kode yang berjalan otomatis saat komponen pertama kali muncul
  // atau saat `searchQuery` berubah (ketika user tekan tombol Cari)
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // Kirim kata kunci ke service, nanti diteruskan ke Laravel API
        const response = await getBooks(searchQuery);

        // Laravel membungkus data dalam { data: [...] }
        // Kita ambil bagian 'data'-nya saja
        const actualData = response?.data || response;
        setBooks(Array.isArray(actualData) ? actualData : []);
      } catch (error) {
        console.error("Gagal ambil data buku:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchQuery]); // Jalankan ulang setiap kali searchQuery berubah

  // Fungsi yang dipanggil saat user klik tombol "Cari" atau tekan Enter
  const handleSearch = (e) => {
    e.preventDefault(); // Mencegah halaman reload
    setSearchQuery(searchInput); // Set kata kunci yang dikirim ke API
  };

  // Fungsi untuk reset search dan tampilkan semua buku lagi
  const handleReset = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  return (
    <section className="bg-gray-50 min-h-screen py-10">
      <div className="mx-auto max-w-screen-xl px-4">

        {/* === HEADER HALAMAN === */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📚 Katalog Buku
          </h1>
          <p className="text-gray-500 text-sm">
            Temukan buku favorit kamu dari koleksi kami
          </p>
        </div>

        {/* === KOTAK SEARCH === */}
        {/* Ini adalah form search. Saat disubmit, handleSearch() dipanggil */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-2 max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Cari judul, penulis, atau genre..."
            value={searchInput}
            // Setiap huruf diketik, update state searchInput
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
          />

          {/* Tombol Cari */}
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            🔍 Cari
          </button>

          {/* Tombol Reset — hanya muncul jika ada kata kunci aktif */}
          {searchQuery && (
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              ✕ Reset
            </button>
          )}
        </form>

        {/* Tampilkan info hasil search jika ada kata kunci */}
        {searchQuery && (
          <div className="mb-4 text-center text-sm text-gray-500">
            Menampilkan hasil untuk: <span className="font-semibold text-indigo-600">"{searchQuery}"</span>
            {" "}— {books.length} buku ditemukan
          </div>
        )}

        {/* === LOADING STATE === */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm">Memuat buku...</p>
            </div>
          </div>
        ) : (
          <>
            {/* === GRID BUKU === */}
            {books.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="flex flex-col h-full rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Gambar Cover Buku */}
                    <Link to={`/books/${book.id}`} className="block overflow-hidden rounded-t-xl">
                      <img
                        className="w-full h-52 object-cover hover:scale-105 transition-transform duration-300"
                        src={
                          book.cover_photo
                            ? `http://localhost:8001/storage/books/${book.cover_photo}`
                            : "https://via.placeholder.com/300x400?text=No+Cover"
                        }
                        alt={book.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/300x400?text=No+Cover";
                        }}
                      />
                    </Link>

                    {/* Informasi Buku */}
                    <div className="flex flex-col flex-grow p-4">
                      {/* Nama Genre (badge kecil) */}
                      {book.genre && (
                        <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full w-fit mb-2">
                          {book.genre.name}
                        </span>
                      )}

                      {/* Judul Buku */}
                      <Link
                        to={`/books/${book.id}`}
                        className="font-semibold text-gray-800 hover:text-indigo-600 line-clamp-2 mb-1 text-sm leading-snug"
                      >
                        {book.title}
                      </Link>

                      {/* Nama Author */}
                      {book.author && (
                        <p className="text-xs text-gray-400 mb-3">
                          oleh {book.author.name}
                        </p>
                      )}

                      {/* Harga dan Tombol Detail */}
                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                        <p className="text-base font-bold text-indigo-600">
                          Rp{Number(book.price || 0).toLocaleString("id-ID")}
                        </p>
                        <Link
                          to={`/books/${book.id}`}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Lihat Detail →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* === STATE KOSONG (tidak ada hasil) === */
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <span className="text-6xl mb-4">📭</span>
                <p className="text-lg font-medium text-gray-600 mb-1">
                  {searchQuery ? `Buku "${searchQuery}" tidak ditemukan` : "Belum ada buku tersedia"}
                </p>
                <p className="text-sm">
                  {searchQuery ? "Coba kata kunci yang lain" : "Silahkan tambahkan buku terlebih dahulu"}
                </p>
                {searchQuery && (
                  <button
                    onClick={handleReset}
                    className="mt-4 text-indigo-600 text-sm underline hover:no-underline"
                  >
                    Tampilkan semua buku
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}