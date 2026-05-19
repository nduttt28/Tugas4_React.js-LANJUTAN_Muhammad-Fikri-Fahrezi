import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../../_services/admin";

export default function AdminOrders() {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filterStatus, setFilter]   = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [updating, setUpdating]     = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getAllOrders();
        setOrders(res.data || []);
      } catch (err) {
        console.error("Gagal memuat pesanan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // [] = hanya jalan sekali saat halaman pertama dibuka

  const handleStatusChange = async (orderId, newStatus) => {
    const konfirmasi = window.confirm(
      `Yakin ubah status pesanan ini menjadi "${newStatus}"?`
    );
    if (!konfirmasi) return;

    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert("Gagal mengubah status. Coba lagi.");
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const formatRupiah = (angka) => "Rp" + Number(angka).toLocaleString("id-ID");

  const formatTanggal = (str) =>
    new Date(str).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const statusConfig = {
    pending:   { label: "Menunggu",      cls: "bg-yellow-100 text-yellow-700" },
    confirmed: { label: "Dikonfirmasi",  cls: "bg-green-100 text-green-700"  },
    cancelled: { label: "Dibatalkan",    cls: "bg-red-100 text-red-600"      },
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const countByStatus = (s) => orders.filter((o) => o.status === s).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">📦 Pesanan Masuk</h1>
        <p className="text-sm text-gray-500 mt-0.5">Total {orders.length} pesanan</p>
      </div>

      {/* Tab Filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          { key: "all",       label: "Semua",        count: orders.length },
          { key: "pending",   label: "Menunggu",     count: countByStatus("pending") },
          { key: "confirmed", label: "Dikonfirmasi", count: countByStatus("confirmed") },
          { key: "cancelled", label: "Dibatalkan",   count: countByStatus("cancelled") },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterStatus === tab.key
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
              filterStatus === tab.key ? "bg-indigo-500 text-white" : "bg-white text-gray-500"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Konten */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-2">📭</p>
          <p className="text-sm">Tidak ada pesanan dengan status ini</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const cfg        = statusConfig[order.status] || statusConfig.pending;
            const isExpanded = expandedId === order.id;
            const isUpdating = updating === order.id;

            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

                {/* Header baris order */}
                <div className="px-5 py-4 flex flex-wrap items-center gap-3">
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-800 text-sm">{order.order_number}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.cls}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {order.user?.name || "Unknown"} · {formatTanggal(order.created_at)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-indigo-600 text-sm">{formatRupiah(order.total_amount)}</p>
                    <p className="text-xs text-gray-400">{order.items?.length || 0} jenis buku</p>
                  </div>

                  {/* Tombol aksi */}
                  <div className="flex gap-2 flex-shrink-0">
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(order.id, "confirmed")}
                          disabled={isUpdating}
                          className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? "..." : "✓ Konfirmasi"}
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, "cancelled")}
                          disabled={isUpdating}
                          className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 border border-red-200"
                        >
                          Batalkan
                        </button>
                      </>
                    )}
                    {order.status === "confirmed" && (
                      <span className="text-xs text-green-600 font-medium">✓ Selesai dikonfirmasi</span>
                    )}
                    {order.status === "cancelled" && (
                      <span className="text-xs text-red-500 font-medium">✗ Dibatalkan</span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0"
                    title={isExpanded ? "Sembunyikan detail" : "Lihat detail"}
                  >
                    <svg
                      className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Detail expand */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Info Pelanggan</p>
                        <p className="text-sm text-gray-800 font-medium">{order.customer_name}</p>
                        <p className="text-xs text-gray-500">{order.customer_address}</p>
                        {order.customer_phone && (
                          <p className="text-xs text-gray-500">📞 {order.customer_phone}</p>
                        )}
                      </div>
                      {order.notes && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Catatan</p>
                          <p className="text-sm text-gray-600 italic">"{order.notes}"</p>
                        </div>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Buku yang Dipesan</p>
                    <div className="space-y-2">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-gray-100">
                          <img
                            src={
                              item.book?.cover_photo
                                ? `http://localhost:8001/storage/books/${item.book.cover_photo}`
                                : "https://via.placeholder.com/40x56?text=?"
                            }
                            alt={item.book?.title}
                            className="w-9 h-12 object-cover rounded border border-gray-100 flex-shrink-0"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/40x56?text=?"; }}
                          />
                          <div className="flex-grow min-w-0">
                            <p className="text-sm font-medium text-gray-800 line-clamp-1">
                              {item.book?.title || `Buku ID ${item.book_id}`}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatRupiah(item.price_per_item)} × {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-700 flex-shrink-0">
                            {formatRupiah(item.subtotal)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                      <span className="text-sm font-semibold text-gray-700">Total Pesanan</span>
                      <span className="font-bold text-indigo-600">{formatRupiah(order.total_amount)}</span>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}