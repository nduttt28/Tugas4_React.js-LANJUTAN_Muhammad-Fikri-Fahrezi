/**
 * CART SERVICE
 * ============
 * File ini mengurus semua operasi keranjang belanja.
 * 
 * Data cart disimpan di localStorage browser (bukan database).
 * Kenapa localStorage?
 * - Data tetap ada meski browser di-refresh
 * - Tidak perlu tabel baru di database
 * - Nanti saat checkout, baru data dikirim ke Laravel
 * 
 * Format data di localStorage:
 * key: "cart"
 * value: JSON string dari array buku
 * 
 * Contoh isi cart di localStorage:
 * [
 *   {
 *     id: 1,
 *     title: "Laskar Pelangi",
 *     price: 75000,
 *     cover_photo: "abc123.jpg",
 *     quantity: 2,        ← berapa banyak yang dipesan
 *     stock: 10           ← stok tersedia di toko
 *   },
 *   ...
 * ]
 */

// ─── Nama key yang dipakai di localStorage ───
const CART_KEY = "bookstore_cart";

// 1. Ambil semua item dari cart
export const getCart = () => {
  // localStorage.getItem() mengambil data string dari browser
  // JSON.parse() mengubah string JSON kembali jadi array/object JavaScript
  const cartData = localStorage.getItem(CART_KEY);
  return cartData ? JSON.parse(cartData) : []; // Jika kosong, kembalikan array kosong
};

// 2. Simpan cart ke localStorage
const saveCart = (cartItems) => {
  // JSON.stringify() mengubah array JavaScript jadi string JSON
  // localStorage hanya bisa menyimpan string, jadi perlu dikonversi dulu
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
};

// 3. Tambah buku ke cart
/**
 * @param {object} book - Objek buku dari API (id, title, price, cover_photo, stock, dll)
 * @param {number} qty  - Jumlah yang ingin ditambahkan (default: 1)
 * @returns {string}    - Pesan hasil: "added" atau "updated"
 */
export const addToCart = (book, qty = 1) => {
  const cart = getCart(); // Ambil cart yang sudah ada

  // Cari apakah buku ini sudah ada di cart
  // findIndex() mencari posisi/index item di array
  const existingIndex = cart.findIndex((item) => item.id === book.id);

  if (existingIndex >= 0) {
    // Buku SUDAH ADA di cart → tambah quantity-nya saja
    const newQty = cart[existingIndex].quantity + qty;

    // Pastikan quantity tidak melebihi stok yang tersedia
    cart[existingIndex].quantity = Math.min(newQty, book.stock);

    saveCart(cart);
    return "updated"; 
  } else {
    cart.push({
      id: book.id,
      title: book.title,
      price: book.price,
      cover_photo: book.cover_photo,
      author: book.author?.name || "",   // Nama penulis (dari relasi)
      genre: book.genre?.name || "",     // Nama genre (dari relasi)
      stock: book.stock,
      quantity: qty,
    });

    saveCart(cart);
    return "added"; 
  }
};

// 4. Hapus satu item dari cart berdasarkan ID buku
export const removeFromCart = (bookId) => {
  const cart = getCart();
  // filter() membuat array baru yang hanya berisi item yang TIDAK dihapus
  const updatedCart = cart.filter((item) => item.id !== bookId);
  saveCart(updatedCart);
};

// 5. Update quantity satu item di cart
export const updateQuantity = (bookId, newQty) => {
  const cart = getCart();

  // map() membuat array baru dengan mengubah setiap item
  const updatedCart = cart.map((item) => {
    if (item.id === bookId) {
      // Kalau ini item yang dicari, update quantity-nya
      // Pastikan quantity minimal 1 dan tidak melebihi stok
      return { ...item, quantity: Math.max(1, Math.min(newQty, item.stock)) };
    }
    return item; // Item lain tidak diubah
  });

  saveCart(updatedCart);
};

// 6. Kosongkan seluruh cart
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};

// 7. Hitung total harga semua item di cart
export const getCartTotal = () => {
  const cart = getCart();
  // reduce() menjumlahkan semua item
  // acc = accumulator (penampung total yang terus bertambah)
  // item = setiap item dalam array cart
  return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

// 8. Hitung total jumlah item (untuk badge di navbar)
export const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((acc, item) => acc + item.quantity, 0);
};