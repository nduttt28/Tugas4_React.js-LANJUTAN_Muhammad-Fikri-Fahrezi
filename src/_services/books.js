import API from "../_api";

/**
 * Ambil semua buku dari Laravel.
 * 
 * @param {string} search - Kata kunci pencarian (opsional)
 * 
 * Cara kerja:
 * - Jika `search` diisi: GET /api/books?search=harry+potter
 * - Jika `search` kosong: GET /api/books (ambil semua)
 * 
 * Laravel akan menerima `$request->query('search')` dan melakukan
 * pencarian di database dengan LIKE query.
 */
export const getBooks = async (search = "") => {
  try {
    // Siapkan parameter untuk dikirim ke URL
    // Jika search ada isinya, tambahkan ke params
    const params = {};
    if (search && search.trim() !== "") {
      params.search = search.trim();
    }

    // Axios otomatis ubah params jadi query string di URL
    // Contoh: { search: "harry" } → ?search=harry
    const { data } = await API.get("/books", { params });

    // Laravel membungkus data dalam properti 'data'
    return data.data || data;
  } catch (error) {
    console.error("Gagal mengambil daftar buku:", error);
    throw error;
  }
};

/**
 * Ambil detail satu buku berdasarkan ID.
 * Contoh: GET /api/books/3
 */
export const getBookById = async (id) => {
  try {
    const { data } = await API.get(`/books/${id}`);
    return data.data || data;
  } catch (error) {
    console.error(`Gagal mengambil detail buku ID ${id}:`, error);
    throw error;
  }
};

/**
 * Tambah buku baru (dengan upload gambar).
 * Menggunakan FormData karena ada file gambar.
 */
export const createBook = async (formData) => {
  try {
    const response = await API.post("/books", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    console.error("Gagal menambah buku:", error);
    throw error;
  }
};

/**
 * Update data buku.
 * Laravel butuh _method=PUT karena FormData tidak bisa pakai PUT langsung.
 */
export const updateBook = async (id, formData) => {
  try {
    if (formData instanceof FormData) {
      formData.append("_method", "PUT");
    }
    const response = await API.post(`/books/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    console.error(`Gagal update buku ID ${id}:`, error);
    throw error;
  }
};

/**
 * Hapus buku dari database.
 */
export const deleteBook = async (id) => {
  try {
    const response = await API.delete(`/books/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Gagal menghapus buku ID ${id}:`, error);
    throw error;
  }
};

// Alias untuk kompatibilitas di show.jsx
export const showBook = getBookById;