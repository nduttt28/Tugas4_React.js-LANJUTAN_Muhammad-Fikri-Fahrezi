import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getCartTotal,
} from "../../../_services/cart";

export default function CartPage() {
  const navigate = useNavigate();

  
  // Setiap perubahan (hapus/ubah qty) langsung re-read dari localStorage
  // via fungsi refresh(), yang dipanggil dari event handler — bukan dari useEffect.
  const [cartItems, setCartItems] = useState(() => getCart());
  const [total, setTotal]         = useState(() => getCartTotal());

  // Fungsi refresh — dipanggil dari event handler, BUKAN dari useEffect
  const refresh = () => {
    setCartItems(getCart());
    setTotal(getCartTotal());
  };

  const handleRemove = (bookId) => {
    removeFromCart(bookId);
    refresh();
  };

  const handleQtyChange = (bookId, newQty) => {
    if (newQty < 1) return;
    updateQuantity(bookId, newQty);
    refresh();
  };

  const handleClearCart = () => {
    if (window.confirm("Yakin ingin mengosongkan keranjang?")) {
      clearCart();
      refresh();
    }
  };

  const formatRupiah = (angka) =>
    "Rp" + Number(angka).toLocaleString("id-ID");

  const handleCheckout = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Silakan login terlebih dahulu untuk melanjutkan checkout.");
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Keranjang Masih Kosong
          </h2>
          <p className="text-gray-500 mb-6">
            Yuk, mulai belanja buku favorit kamu!
          </p>
          <Link
            to="/books"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Lihat Katalog Buku
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-screen-lg mx-auto px-4">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🛒 Keranjang Belanja</h1>
            <p className="text-gray-500 text-sm mt-1">
              {cartItems.length} jenis buku · {cartItems.reduce((a, i) => a + i.quantity, 0)} item
            </p>
          </div>
          <button
            onClick={handleClearCart}
            className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
          >
            🗑️ Kosongkan
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Daftar Buku ── */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 shadow-sm"
              >
                <Link to={`/books/${item.id}`} className="flex-shrink-0">
                  <img
                    src={
                      item.cover_photo
                        ? `http://localhost:8001/storage/books/${item.cover_photo}`
                        : "https://via.placeholder.com/80x110?text=No+Cover"
                    }
                    alt={item.title}
                    className="w-20 h-28 object-cover rounded-lg border border-gray-100"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/80x110?text=No+Cover";
                    }}
                  />
                </Link>

                <div className="flex-grow min-w-0">
                  <Link
                    to={`/books/${item.id}`}
                    className="font-semibold text-gray-800 hover:text-indigo-600 line-clamp-2 text-sm"
                  >
                    {item.title}
                  </Link>
                  {item.author && (
                    <p className="text-xs text-gray-400 mt-0.5">oleh {item.author}</p>
                  )}
                  <p className="text-indigo-600 font-bold mt-1 text-sm">
                    {formatRupiah(item.price)}
                    <span className="text-gray-400 font-normal"> / buku</span>
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >−</button>
                      <span className="w-10 text-center text-sm font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >+</button>
                    </div>
                    <span className="text-xs text-gray-400">Stok: {item.stock}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between flex-shrink-0">
                  <p className="font-bold text-gray-800 text-sm">
                    {formatRupiah(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors mt-4"
                    title="Hapus dari keranjang"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <Link
              to="/books"
              className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline mt-2"
            >
              ← Lanjut Belanja
            </Link>
          </div>

          {/* ── Ringkasan Pesanan ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm sticky top-24">
              <h2 className="font-bold text-gray-800 text-base mb-4">📋 Ringkasan Pesanan</h2>
              <div className="space-y-2 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate max-w-[150px]">{item.title} ×{item.quantity}</span>
                    <span className="font-medium flex-shrink-0 ml-2">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-bold text-indigo-600 text-lg">{formatRupiah(total)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Belum termasuk ongkos kirim</p>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Lanjut ke Checkout →
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                🔒 Checkout aman via WhatsApp
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}