import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useDecodeToken, logout } from "../_services/auth";
import { useEffect, useState } from "react";

/**
 * Admin Layout
 *
 * Perubahan dari versi asli:
 * - Tambah menu "Pesanan" yang mengarah ke /admin/orders
 * - Tambah menu "Users" tetap ada
 * - Logo diganti ke BukuKu
 * - Link aktif di-highlight sesuai halaman
 */
export default function AdminLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut]     = useState(false);

  const token     = localStorage.getItem("accessToken");
  const savedInfo = localStorage.getItem("userInfo") || localStorage.getItem("UserInfo");
  const userInfo  = JSON.parse(savedInfo || "{}");
  const decodedData = useDecodeToken(token);

  useEffect(() => {
    if (!token || !decodedData || !decodedData.success) {
      navigate("/login");
      return;
    }
    if (userInfo?.role !== "admin") {
      navigate("/");
    }
  }, [token, decodedData, navigate, userInfo]);

  if (!token || userInfo?.role !== "admin") return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout(token);
      navigate("/login");
    } catch {
      localStorage.clear();
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
      setIsDropdownOpen(false);
    }
  };

  // Helper: cek apakah path ini aktif untuk highlight menu
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  // Class untuk link menu sidebar
  const menuCls = (path) =>
    `flex items-center p-2 text-sm font-medium rounded-lg transition-colors ${
      isActive(path)
        ? "bg-indigo-50 text-indigo-700"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="antialiased bg-gray-50 min-h-screen">

      {/* ── Navbar Atas ── */}
      <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed left-0 right-0 top-0 z-50">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <span className="font-bold text-gray-800">
              Buku<span className="text-indigo-600">Ku</span>
              <span className="text-xs font-normal text-gray-400 ml-1">Admin</span>
            </span>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors"
            >
              {/* Avatar inisial */}
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                {(userInfo.name || "A").charAt(0).toUpperCase()}
              </div>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-gray-100 shadow-lg z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">{userInfo.name || "Admin"}</p>
                  <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
                </div>
                <div className="p-1">
                  <Link
                    to="/"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    🏠 Lihat Toko
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium"
                  >
                    {isLoggingOut ? "Keluar..." : "🚪 Logout"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Sidebar Kiri ── */}
      <aside className="fixed top-0 left-0 z-40 w-56 h-screen pt-14 bg-white border-r border-gray-200">
        <div className="overflow-y-auto py-5 px-3 h-full">

          {/* Menu Utama */}
          <ul className="space-y-1">
            <li>
              <Link to="/admin" className={menuCls("/admin")
                .replace(isActive("/admin/books") || isActive("/admin/users") || isActive("/admin/orders") ? "bg-indigo-50 text-indigo-700" : "", "text-gray-700 hover:bg-gray-100")
              }>
                <svg className="w-5 h-5 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Dashboard
              </Link>
            </li>

            <li>
              <Link to="/admin/users" className={menuCls("/admin/users")}>
                <svg className="w-5 h-5 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Daftar User
              </Link>
            </li>
          </ul>

          {/* Divider */}
          <div className="my-4 border-t border-gray-100"></div>
          <p className="px-2 text-xs font-semibold text-gray-400 uppercase mb-2">Kelola Toko</p>

          <ul className="space-y-1">
            <li>
              <Link to="/admin/books" className={menuCls("/admin/books")}>
                <svg className="w-5 h-5 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Kelola Buku
              </Link>
            </li>

            <li>
              <Link to="/admin/authors" className={menuCls("/admin/authors")}>
                <svg className="w-5 h-5 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Kelola Penulis
              </Link>
            </li>

            <li>
              <Link to="/admin/genres" className={menuCls("/admin/genres")}>
                <svg className="w-5 h-5 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Kelola Genre
              </Link>
            </li>

            {/* ← MENU BARU: Pesanan */}
            <li>
              <Link to="/admin/orders" className={menuCls("/admin/orders")}>
                <svg className="w-5 h-5 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Pesanan Masuk
              </Link>
            </li>

            <li>
              <Link to="/admin/contacts" className={menuCls("/admin/contacts")}>
                <svg className="w-5 h-5 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Pesan Masuk
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="ml-56 pt-14 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>

    </div>
  );
}