import { useEffect, useState } from "react";
import { getDashboardStats } from "../../_services/admin";

/**
 * Halaman Admin: Dashboard
 * 
 * Menampilkan ringkasan data aplikasi:
 * - Total Buku
 * - Total User
 * - Total Pesanan
 * - Total Pendapatan (dari order yang dikonfirmasi)
 */
export default function Dashboard() {
  const [stats, setStats] = useState({
    total_books: 0,
    total_users: 0,
    total_orders: 0,
    total_income: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat statistik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatRupiah = (angka) => "Rp" + Number(angka).toLocaleString("id-ID");

  const cards = [
    {
      title: "Total Buku",
      value: stats.total_books,
      icon: "📚",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total User",
      value: stats.total_users,
      icon: "👥",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Pesanan Masuk",
      value: stats.total_orders,
      icon: "📦",
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Total Pendapatan",
      value: formatRupiah(stats.total_income),
      icon: "💰",
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Selamat datang di panel admin BukuKu. Berikut ringkasan data toko Anda.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${card.color}`}>
                  {card.icon}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Welcome Section */}
      <div className="mt-10 bg-indigo-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-indigo-100">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold mb-2">Halo Admin! 👋</h2>
          <p className="text-indigo-100 text-sm max-w-md">
            Semua sistem berjalan dengan normal. Anda dapat mengelola stok buku, melihat pesanan baru, atau memantau user terdaftar melalui menu di samping.
          </p>
          <button 
            onClick={() => window.location.href = "/admin/orders"}
            className="mt-6 bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors"
          >
            Lihat Pesanan Terbaru →
          </button>
        </div>
        <div className="text-8xl hidden md:block opacity-20">🚀</div>
      </div>
    </div>
  );
}