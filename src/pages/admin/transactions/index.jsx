import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Halaman Transaksi
 *
 * Halaman ini mengarahkan ke halaman Pesanan Masuk (/admin/orders)
 * karena semua data transaksi/pesanan sudah dikelola di sana.
 */
export default function AdminTransactions() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin/orders", { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-400 text-sm">Mengalihkan ke halaman Pesanan...</p>
    </div>
  );
}