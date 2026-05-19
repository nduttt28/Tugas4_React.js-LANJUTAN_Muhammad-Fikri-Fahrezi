import { BrowserRouter, Route, Routes } from "react-router-dom";

// Layout
import PublicLayout from "./layouts/public";
import AdminLayout  from "./layouts/admin";

// Halaman Public
import Home         from "./pages/public";
import Books        from "./pages/public/books";
import BookShow     from "./pages/public/books/show";
import CartPage     from "./pages/public/cart";
import CheckoutPage from "./pages/public/checkout";
import MyOrders     from "./pages/public/orders";
import AboutPage    from "./pages/public/about";
import ContactPage  from "./pages/public/contact";

// Halaman Auth
import Login    from "./pages/auth/login";
import Register from "./pages/auth/register";

// Halaman Admin
import Dashboard         from "./pages/admin";
import AdminBooks       from "./pages/admin/books";
import BookCreate       from "./pages/admin/books/create";
import BookEdit         from "./pages/admin/books/edit";
import AdminAuthors     from "./pages/admin/authors";
import AuthorCreate     from "./pages/admin/authors/create";
import AuthorEdit       from "./pages/admin/authors/edit";
import AdminGenres      from "./pages/admin/genres";
import GenreCreate      from "./pages/admin/genres/create";
import GenreEdit        from "./pages/admin/genres/edit";
import AdminUsers       from "./pages/admin/users";
import AdminOrders      from "./pages/admin/orders";
import AdminContacts    from "./pages/admin/contacts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route index            element={<Home />} />
          <Route path="books"     element={<Books />} />
          <Route path="books/:id" element={<BookShow />} />
          <Route path="cart"      element={<CartPage />} />
          <Route path="checkout"  element={<CheckoutPage />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="about"     element={<AboutPage />} />
          <Route path="contact"   element={<ContactPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="login"    element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="books">
            <Route index           element={<AdminBooks />} />
            <Route path="create"   element={<BookCreate />} />
            <Route path="edit/:id" element={<BookEdit />} />
            <Route path="show/:id" element={<BookShow />} />
          </Route>
          <Route path="authors">
            <Route index           element={<AdminAuthors />} />
            <Route path="create"   element={<AuthorCreate />} />
            <Route path="edit/:id" element={<AuthorEdit />} />
          </Route>
          <Route path="genres">
            <Route index           element={<AdminGenres />} />
            <Route path="create"   element={<GenreCreate />} />
            <Route path="edit/:id" element={<GenreEdit />} />
          </Route>
          <Route path="users"    element={<AdminUsers />} />
          <Route path="orders"   element={<AdminOrders />} />
          <Route path="contacts" element={<AdminContacts />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen bg-gray-50 text-center px-4">
            <div>
              <p className="text-6xl mb-4">🔍</p>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
              <p className="text-gray-500 mb-6">Halaman tidak ditemukan.</p>
              <a href="/" className="text-indigo-600 hover:underline text-sm">← Kembali ke Home</a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;