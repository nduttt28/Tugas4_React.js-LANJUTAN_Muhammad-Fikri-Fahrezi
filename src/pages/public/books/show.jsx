import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { showBook } from "../../../_services/books";
import { addToCart, getCart } from "../../../_services/cart";

/**
 * Halaman Detail Buku
 * 
 * Perubahan dari versi sebelumnya:
 * - Tombol "Tambah ke Keranjang" sekarang BERFUNGSI
 * - Ada input angka untuk memilih jumlah buku
 * - Ada feedback (notifikasi) setelah berhasil tambah ke cart
 * - Ada info "sudah di cart" jika buku sudah ada di keranjang
 */
export default function BookShow() {
  const { id } = useParams();      // Ambil ID dari URL: /books/:id
  const navigate = useNavigate();

  // State untuk data buku dari API
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // State untuk jumlah buku yang ingin dipesan
  const [qty, setQty] = useState(1);

  // State untuk notifikasi setelah klik "Tambah ke Keranjang"
  // null = tidak tampil | "success" = berhasil | "already" = sudah di cart
  const [notification, setNotification] = useState(null);

  // State untuk cek apakah buku ini sudah ada di cart
  const [isInCart, setIsInCart] = useState(false);

  // Ambil data buku dari API saat halaman dibuka
  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        setLoading(true);
        const response = await showBook(id);
        const actualData = response?.data || response;
        setBook(actualData);

        // Cek apakah buku ini sudah di keranjang
        const cart = getCart();
        const found = cart.find((item) => item.id === Number(id));
        setIsInCart(!!found); // !! mengubah nilai jadi true/false
      } catch (err) {
        console.error("Gagal memuat detail buku:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetail();
  }, [id]);

  // ── Fungsi Tambah ke Cart ──
  const handleAddToCart = () => {
    const token = localStorage.getItem("accessToken");

    // Cek apakah sudah login
    if (!token) {
      alert("Silakan login terlebih dahulu untuk menambahkan ke keranjang.");
      navigate("/login");
      return;
    }

    // Panggil fungsi addToCart dari cart service
    // Fungsi ini menyimpan data ke localStorage dan mengembalikan "added" atau "updated"
    const result = addToCart(book, qty);

    // Tampilkan notifikasi berdasarkan hasilnya
    setNotification(result); // "added" atau "updated"
    setIsInCart(true);        // Tandai bahwa buku sudah ada di cart

    // Sembunyikan notifikasi setelah 3 detik
    setTimeout(() => setNotification(null), 3000);
  };

  // ── Format harga ke Rupiah ──
  const formatRupiah = (angka) =>
    "Rp" + Number(angka).toLocaleString("id-ID");

  // ── Loading State ──
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Memuat detail buku...</p>
        </div>
      </div>
    );
  }

  // ── Buku tidak ditemukan ──
  if (!book) {
    return (
      <div className="text-center py-20 bg-gray-50 min-h-screen">
        <p className="text-5xl mb-4">📭</p>
        <h2 className="text-xl font-bold text-gray-700">Buku tidak ditemukan.</h2>
        <Link to="/books" className="text-indigo-600 hover:underline mt-4 inline-block text-sm">
          ← Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-screen-lg mx-auto px-4">

        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            to="/books"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Katalog
          </Link>
        </nav>

        {/* ── Notifikasi Berhasil ── */}
        {/*
          Notifikasi ini muncul selama 3 detik setelah user klik "Tambah ke Keranjang".
          Menggunakan kondisi: notification && (...) artinya hanya tampil jika notification tidak null.
        */}
        {notification && (
          <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
            <span className="text-lg">✅</span>
            <div>
              <p className="font-semibold">
                {notification === "added"
                  ? "Berhasil ditambahkan ke keranjang!"
                  : "Jumlah di keranjang diperbarui!"}
              </p>
              <Link to="/cart" className="text-green-600 underline text-xs">
                Lihat keranjang →
              </Link>
            </div>
          </div>
        )}

        {/* ── Kartu Detail Buku ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

            {/* Kolom Gambar */}
            <div className="flex justify-center bg-gray-50 rounded-xl p-6">
              <img
                className="max-h-80 w-auto object-contain rounded-lg shadow-md"
                src={
                  book.cover_photo
                    ? `http://localhost:8001/storage/books/${book.cover_photo}`
                    : "https://via.placeholder.com/300x420?text=No+Cover"
                }
                alt={book.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300x420?text=No+Cover";
                }}
              />
            </div>

            {/* Kolom Informasi */}
            <div>
              {/* Badge genre */}
              {book.genre && (
                <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {book.genre.name}
                </span>
              )}

              {/* Judul */}
              <h1 className="text-2xl font-bold text-gray-800 leading-snug mb-1">
                {book.title}
              </h1>

              {/* Author */}
              {book.author && (
                <p className="text-sm text-gray-500 mb-4">
                  oleh <span className="font-medium text-gray-700">{book.author.name}</span>
                </p>
              )}

              {/* Harga */}
              <p className="text-3xl font-black text-indigo-600 mb-1">
                {formatRupiah(book.price)}
              </p>

              {/* Stok */}
              <div className="flex items-center gap-2 mb-6">
                <span
                  className={`w-2 h-2 rounded-full ${book.stock > 0 ? "bg-green-500" : "bg-red-400"}`}
                ></span>
                <span className={`text-sm font-medium ${book.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                  {book.stock > 0 ? `Tersedia (${book.stock} pcs)` : "Stok Habis"}
                </span>
              </div>

              {/* Deskripsi */}
              <div className="border-t border-gray-100 pt-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Deskripsi</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {book.description || "Deskripsi belum tersedia."}
                </p>
              </div>

              {/* ── Pilih Jumlah + Tombol ── */}
              {book.stock > 0 && (
                <div className="space-y-3">
                  {/* Pilih Quantity */}
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Jumlah:</label>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      {/* Tombol Kurang */}
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        −
                      </button>

                      {/* Angka Quantity */}
                      <span className="w-12 text-center text-sm font-bold text-gray-800">
                        {qty}
                      </span>

                      {/* Tombol Tambah */}
                      <button
                        onClick={() => setQty((q) => Math.min(book.stock, q + 1))}
                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-gray-400">maks. {book.stock}</span>
                  </div>

                  {/* Tombol Tambah ke Keranjang */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    🛒 {isInCart ? "Tambah Lagi ke Keranjang" : "Tambah ke Keranjang"}
                  </button>

                  {/* Shortcut ke halaman cart jika sudah ada item */}
                  {isInCart && (
                    <Link
                      to="/cart"
                      className="w-full flex items-center justify-center gap-2 border border-indigo-300 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 rounded-xl transition-colors text-sm"
                    >
                      Lihat Keranjang →
                    </Link>
                  )}
                </div>
              )}

              {/* Pesan stok habis */}
              {book.stock <= 0 && (
                <div className="bg-red-50 border border-red-100 text-red-500 text-sm py-3 px-4 rounded-xl text-center">
                  Stok buku ini sedang habis. Cek lagi nanti ya!
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}