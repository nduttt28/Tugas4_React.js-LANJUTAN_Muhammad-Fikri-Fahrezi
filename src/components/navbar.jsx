import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "../_services/auth";
import { getCartCount } from "../_services/cart";

/**
 * Komponen Navbar
 * 
 * 
 */
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const loadData = () => {
    const savedToken = localStorage.getItem("accessToken");
    const savedInfo =
      localStorage.getItem("userInfo") || localStorage.getItem("UserInfo");

    if (savedToken) setToken(savedToken);
    if (savedInfo) setUserInfo(JSON.parse(savedInfo));

    setCartCount(getCartCount());
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout(localStorage.getItem("accessToken"));
      setToken(null);
      setUserInfo({});
      navigate("/login");
    } catch {
      localStorage.clear();
      setToken(null);
      setUserInfo({});
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isActive = (path) => location.pathname === path;
  const linkBase = "text-sm font-medium transition-colors duration-150 px-1 py-1";
  const linkActive = `${linkBase} text-indigo-600 border-b-2 border-indigo-500`;
  const linkInactive = `${linkBase} text-gray-600 hover:text-indigo-600`;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-screen-xl px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <span className="font-bold text-lg text-gray-800">
            Buku<span className="text-indigo-600">Ku</span>
          </span>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/" className={isActive("/") ? linkActive : linkInactive}>Home</Link>
          <Link to="/books" className={isActive("/books") ? linkActive : linkInactive}>Katalog Buku</Link>
          <Link to="/about" className={isActive("/about") ? linkActive : linkInactive}>Tentang Kami</Link>
          <Link to="/contact" className={isActive("/contact") ? linkActive : linkInactive}>Kontak</Link>
        </nav>

        {/* Kanan Desktop: Cart + Auth */}
        <div className="hidden lg:flex items-center gap-3">

          {/* Ikon Cart + Badge */}
          <Link
            to="/cart"
            className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            title="Keranjang Belanja"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {token && userInfo.name ? (
            <>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700">
                  {userInfo.name}
                </p>

                {userInfo.role && (
                  <span className="text-[10px] text-indigo-500 font-medium uppercase">
                    {userInfo.role}
                  </span>
                )}
              </div>

              <Link
                to="/my-orders"
                className="text-xs text-gray-600 hover:text-indigo-600 font-medium border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                📋 Pesanan Saya
              </Link>

              {userInfo.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg font-medium hover:bg-amber-200 transition-colors"
                >
                  Admin Panel
                </Link>
              )}

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? "..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-indigo-600 font-medium"
              >
                Masuk
              </Link>

              <Link
                to="/register"
                className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-lg font-medium transition-colors"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* Mobile: Cart + Hamburger */}
        <div className="lg:hidden flex items-center gap-2">

          <Link to="/cart" className="relative p-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className="p-2 text-gray-600 hover:text-indigo-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2">

          <nav className="flex flex-col gap-3 mb-4">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={isActive("/") ? linkActive : linkInactive}
            >
              Home
            </Link>

            <Link
              to="/books"
              onClick={() => setMenuOpen(false)}
              className={isActive("/books") ? linkActive : linkInactive}
            >
              Katalog Buku
            </Link>

            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className={isActive("/cart") ? linkActive : linkInactive}
            >
              Keranjang {cartCount > 0 && `(${cartCount})`}
            </Link>

            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className={isActive("/about") ? linkActive : linkInactive}
            >
              Tentang Kami
            </Link>

            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className={isActive("/contact") ? linkActive : linkInactive}
            >
              Kontak
            </Link>
          </nav>

          <div className="border-t border-gray-100 pt-3 flex gap-2">
            {token ? (
              <button
                onClick={handleLogout}
                className="w-full text-sm text-white bg-indigo-600 py-2 rounded-lg font-medium"
              >
                Logout ({userInfo.name})
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex-1 text-center text-sm border border-indigo-600 text-indigo-600 py-2 rounded-lg font-medium"
                >
                  Masuk
                </Link>

                <Link
                  to="/register"
                  className="flex-1 text-center text-sm bg-indigo-600 text-white py-2 rounded-lg font-medium"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}