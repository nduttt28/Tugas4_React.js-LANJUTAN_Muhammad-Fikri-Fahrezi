import API from "../_api";

/**
 * ADMIN SERVICES
 * ==============
 * Kumpulan fungsi untuk kebutuhan halaman Admin.
 * Semua request di sini butuh token JWT (hanya boleh diakses Admin).
 *
 * Cara kerja auth di Axios:
 * Setiap request menyertakan header:  Authorization: Bearer <token>
 * Laravel membaca token ini via middleware 'auth:api' dan 'role:admin'
 */

// Helper: ambil token dari localStorage dan jadikan header Authorization
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

// USER ENDPOINTS

/**
 * Ambil semua user yang terdaftar
 * GET /api/admin/users
 */
export const getAllUsers = async () => {
  const { data } = await API.get("/admin/users", { headers: authHeader() });
  return data;
};

// ORDER ENDPOINTS

/**
 * Ambil semua pesanan (admin)
 * GET /api/orders
 */
export const getAllOrders = async () => {
  const { data } = await API.get("/orders", { headers: authHeader() });
  return data;
};

/**
 * Update status pesanan
 * PATCH /api/orders/{id}/status
 *
 * @param {number} id     - ID order
 * @param {string} status - 'pending' | 'confirmed' | 'cancelled'
 */
export const updateOrderStatus = async (id, status) => {
  const { data } = await API.patch(
    `/orders/${id}/status`,
    { status },
    { headers: authHeader() }
  );
  return data;
};

/**
 * Ambil statistik untuk Dashboard
 * GET /api/admin/stats
 */
export const getDashboardStats = async () => {
  const { data } = await API.get("/admin/stats", { headers: authHeader() });
  return data;
};
