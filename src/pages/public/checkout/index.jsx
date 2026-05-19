import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, clearCart, getCartTotal } from "../../../_services/cart";
import { createOrder, buildWhatsAppURL } from "../../../_services/checkout";

export default function CheckoutPage() {
  const navigate = useNavigate();

  // ✅ FIX: Inisialisasi langsung dari localStorage pakai lazy initializer
  // Fungsi di dalam useState(() => ...) dipanggil SEKALI saat komponen mount.
  // Tidak perlu useEffect + setState lagi → ESLint tidak complain.
  const [cartItems] = useState(() => getCart());
  const [cartTotal] = useState(() => getCartTotal());

  // ✅ FIX: Pre-fill nama juga pakai lazy initializer — tidak perlu setFormData di useEffect
  const [formData, setFormData] = useState(() => {
    const userInfo = JSON.parse(
      localStorage.getItem("userInfo") || localStorage.getItem("UserInfo") || "{}"
    );
    return {
      customer_name:    userInfo.name || "",
      customer_address: "",
      customer_phone:   "",
      notes:            "",
      payment_method:   "cod", // default COD
    };
  });

  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // ✅ useEffect sekarang HANYA untuk redirect — tidak ada setState di dalamnya
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Silakan login terlebih dahulu.");
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [navigate, cartItems.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const orderPayload = {
        customer_name:    formData.customer_name,
        customer_address: formData.customer_address,
        customer_phone:   formData.customer_phone || null,
        notes:            formData.notes || null,
        payment_method:   formData.payment_method,
        items: cartItems.map((item) => ({
          book_id:  item.id,
          quantity: item.quantity,
        })),
      };
      const response = await createOrder(orderPayload);
      if (response.success) {
        setOrderSuccess(response.data);
        clearCart();
      } else {
        setError(response.message || "Gagal membuat pesanan.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWhatsApp = () => {
    if (!orderSuccess) return;
    window.open(buildWhatsAppURL(orderSuccess), "_blank");
  };

  const formatRupiah = (angka) => "Rp" + Number(angka).toLocaleString("id-ID");

  const paymentLabels = {
    cod:      { label: "Bayar di Tempat (COD)", icon: "🚚", desc: "Bayar saat buku tiba di tanganmu." },
    transfer: { label: "Transfer Bank",          icon: "🏦", desc: "Admin kirim rekening setelah konfirmasi." },
  };

  // ── Halaman Sukses ──
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">Pesanan Berhasil Dibuat!</h2>
          <p className="text-gray-500 text-sm mb-6">Lanjutkan konfirmasi via WhatsApp Admin.</p>
          <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">No. Pesanan</span>
              <span className="font-semibold text-gray-800">{orderSuccess.order_number}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                Menunggu Konfirmasi
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Metode Bayar</span>
              <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {orderSuccess.payment_method === "cod" ? "🚚 Bayar di Tempat (COD)" : "🏦 Transfer Bank"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-indigo-600">{formatRupiah(orderSuccess.total_amount)}</span>
            </div>
          </div>
          <button
            onClick={handleOpenWhatsApp}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Konfirmasi via WhatsApp Admin
          </button>
          <Link to="/books" className="block text-sm text-indigo-600 hover:underline">
            Lanjut Belanja Buku Lain →
          </Link>
        </div>
      </div>
    );
  }

  // ── Form Checkout ──
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-screen-md mx-auto px-4">

        <div className="mb-6">
          <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Keranjang
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">📋 Checkout</h1>
          <p className="text-gray-500 text-sm mt-1">Isi data pengiriman, lalu pesanan dikirim via WhatsApp Admin</p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <span className="text-base mt-0.5">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          {/* ── Kiri: Form ── */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

                <h2 className="font-semibold text-gray-700 text-base pb-2 border-b border-gray-100">
                  Data Penerima
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="customer_name" value={formData.customer_name}
                    onChange={handleChange} placeholder="contoh: Budi Santoso" required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nomor WhatsApp / HP
                    <span className="text-gray-400 font-normal ml-1">(opsional)</span>
                  </label>
                  <input type="tel" name="customer_phone" value={formData.customer_phone}
                    onChange={handleChange} placeholder="contoh: 08123456789"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Alamat Pengiriman <span className="text-red-500">*</span>
                  </label>
                  <textarea name="customer_address" value={formData.customer_address}
                    onChange={handleChange} required rows={3}
                    placeholder="contoh: Jl. Merdeka No. 10, RT 02/RW 05, Bandung"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder-gray-300 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Catatan <span className="text-gray-400 font-normal">(opsional)</span>
                  </label>
                  <textarea name="notes" value={formData.notes}
                    onChange={handleChange} rows={2}
                    placeholder="contoh: Tolong dikemas dengan bubble wrap"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder-gray-300 resize-none"
                  />
                </div>

                {/* Metode Pembayaran */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metode Pembayaran <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {Object.entries(paymentLabels).map(([key, val]) => (
                      <label key={key}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          formData.payment_method === key
                            ? "border-indigo-400 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input type="radio" name="payment_method" value={key}
                          checked={formData.payment_method === key}
                          onChange={handleChange}
                          className="mt-0.5 accent-indigo-600"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-700">{val.icon} {val.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{val.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Memproses Pesanan...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Pesan via WhatsApp Admin
                    </>
                  )}
                </button>

              </div>
            </form>
          </div>

          {/* ── Kanan: Ringkasan ── */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <h2 className="font-semibold text-gray-700 text-sm mb-4">🛒 Ringkasan Pesanan</h2>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 items-start">
                    <img
                      src={item.cover_photo ? `http://localhost:8001/storage/books/${item.cover_photo}` : "https://via.placeholder.com/48x64?text=?"}
                      alt={item.title}
                      className="w-10 h-14 object-cover rounded-md border border-gray-100 flex-shrink-0"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/48x64?text=?"; }}
                    />
                    <div className="flex-grow min-w-0">
                      <p className="text-xs font-medium text-gray-700 line-clamp-2 leading-snug">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatRupiah(item.price)} × {item.quantity}</p>
                    </div>
                    <p className="text-xs font-semibold text-gray-700 flex-shrink-0">
                      {formatRupiah(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Total</span>
                  <span className="font-bold text-indigo-600">{formatRupiah(cartTotal)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Belum termasuk ongkos kirim</p>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Metode Bayar</span>
                  <span className="text-xs font-semibold text-indigo-600">
                    {paymentLabels[formData.payment_method]?.icon}{" "}
                    {formData.payment_method === "cod" ? "COD" : "Transfer"}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}