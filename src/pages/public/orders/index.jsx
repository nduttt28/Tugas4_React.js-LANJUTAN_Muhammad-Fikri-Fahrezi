import { useEffect, useState } from "react";
import { getMyOrders } from "../../../_services/checkout";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data || []);
      } catch (err) {
        console.error("Gagal memuat pesanan:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatRupiah = (angka) => "Rp" + Number(angka).toLocaleString("id-ID");

  // Config badge status pesanan
  const statusConfig = {
    pending:   { label: "Menunggu",      cls: "bg-yellow-100 text-yellow-700" },
    confirmed: { label: "Dikonfirmasi",  cls: "bg-green-100 text-green-700"  },
    cancelled: { label: "Dibatalkan",    cls: "bg-red-100 text-red-600"      },
  };

  // ── BARU: config badge metode & status pembayaran ──
  const paymentMethodConfig = {
    cod:      { label: "🚚 Bayar di Tempat (COD)", cls: "bg-indigo-50 text-indigo-700"  },
    transfer: { label: "🏦 Transfer Bank",          cls: "bg-blue-50 text-blue-700"     },
  };

  const paymentStatusConfig = {
    unpaid: { label: "Belum Dibayar", cls: "bg-orange-50 text-orange-600" },
    paid:   { label: "Sudah Dibayar", cls: "bg-green-100 text-green-700"  },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">📋 Riwayat Pesanan</h1>
          <p className="text-gray-500 text-sm mt-1">Lihat status dan detail buku yang kamu beli.</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 font-medium">Kamu belum pernah melakukan pemesanan.</p>
            <Link to="/books" className="mt-4 inline-block text-indigo-600 font-semibold hover:underline">
              Mulai Belanja Sekarang →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusCfg  = statusConfig[order.status]  || statusConfig.pending;
              // BARU: ambil config pembayaran, fallback ke cod jika belum ada (data lama)
              const payMethodCfg = paymentMethodConfig[order.payment_method] || paymentMethodConfig.cod;
              const payStatusCfg = paymentStatusConfig[order.payment_status] || paymentStatusConfig.unpaid;

              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                  {/* ── Header card ── */}
                  <div className="p-5 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-bold text-gray-800">{order.order_number}</span>
                        {/* Badge status pesanan */}
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${statusCfg.cls}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric",
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-indigo-600">{formatRupiah(order.total_amount)}</p>
                      <p className="text-xs text-gray-400">{order.items?.length || 0} buku</p>
                    </div>
                  </div>

                  {/* ── BARU: Info pembayaran ── */}
                  <div className="px-5 pb-4 flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${payMethodCfg.cls}`}>
                      {payMethodCfg.label}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${payStatusCfg.cls}`}>
                      {payStatusCfg.label}
                    </span>
                  </div>

                  {/* ── Daftar item buku ── */}
                  <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                          <img
                            src={item.book?.cover_photo
                              ? `http://localhost:8001/storage/books/${item.book.cover_photo}`
                              : "https://via.placeholder.com/20x30"}
                            alt=""
                            className="w-5 h-7 object-cover rounded shadow-sm"
                          />
                          <span className="text-[11px] font-medium text-gray-700 truncate max-w-[120px]">
                            {item.book?.title}
                          </span>
                          <span className="text-[11px] text-gray-400">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}