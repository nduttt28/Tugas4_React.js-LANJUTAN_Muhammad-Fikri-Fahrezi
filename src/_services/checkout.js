import API from "../_api";

/**
 * CHECKOUT SERVICE
 * ================
 * File ini mengurus pengiriman data order ke Laravel API.
 *
 * Cara kerja:
 * 1. Terima data checkout dari halaman React
 * 2. Kirim ke endpoint POST /api/orders via Axios
 * 3. Laravel simpan ke database dan kembalikan data order
 * 4. Kita gunakan data itu untuk membuat link WhatsApp
 */

/**
 * Buat order baru ke Laravel
 *
 * @param {object} orderData - Data order dari form checkout
 * Contoh:
 * {
 *   customer_name: "Budi Santoso",
 *   customer_address: "Jl. Mawar No. 5, Bandung",
 *   customer_phone: "08123456789",
 *   notes: "Dikemas rapi ya",
 *   items: [
 *     { book_id: 1, quantity: 2 },
 *     { book_id: 5, quantity: 1 },
 *   ]
 * }
 *
 * @returns {object} Data order yang baru dibuat dari Laravel
 */
export const createOrder = async (orderData) => {
  try {
    // Ambil token JWT dari localStorage untuk dikirim sebagai header Authorization
    const token = localStorage.getItem("accessToken");

    const response = await API.post("/orders", orderData, {
      headers: {
        // Bearer token = cara Laravel tahu siapa yang sedang login
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Gagal membuat order:", error);
    throw error; // Lempar error ke komponen yang memanggil fungsi ini
  }
};

/**
 * Buat pesan WhatsApp otomatis dari data order
 *
 * Format pesan yang dihasilkan:
 * ================================
 * Halo Admin! Saya ingin memesan buku:
 *
 * No. Pesanan: ORD-ABC12345
 * Nama: Budi Santoso
 * Alamat: Jl. Mawar No. 5
 *
 * Detail Pesanan:
 * 1. Laskar Pelangi x2 = Rp150.000
 * 2. Bumi Manusia x1 = Rp85.000
 *
 * Total: Rp235.000
 *
 * Mohon konfirmasi pesanan saya. Terima kasih!
 * ================================
 *
 * @param {object} order - Data order dari response Laravel
 * @param {Array}  cartItems - Array item dari localStorage cart (untuk judul buku)
 * @returns {string} URL WhatsApp yang siap dibuka
 */
export const buildWhatsAppURL = (order) => {
  // Nomor WhatsApp admin 
  // Format internasional: 62 = kode Indonesia, tanpa tanda +
  const ADMIN_WA_NUMBER = "6281542722924"; //

  // Format harga ke Rupiah
  const formatRupiah = (angka) =>
    "Rp" + Number(angka).toLocaleString("id-ID");

  // Buat daftar item pesanan
  // order.items berasal dari relasi OrderItem di Laravel
  const itemLines = order.items
    .map((item, index) => {
      const title = item.book?.title || `Buku ID ${item.book_id}`;
      const subtotal = formatRupiah(item.subtotal);
      return `${index + 1}. ${title} x${item.quantity} = ${subtotal}`;
    })
    .join("\n"); 

  // Susun pesan lengkap
  const pesan = `Halo Admin! Saya ingin memesan buku dari toko BukuKu.

*No. Pesanan:* ${order.order_number}
*Nama:* ${order.customer_name}
*Alamat:* ${order.customer_address}
${order.customer_phone ? `*No. HP:* ${order.customer_phone}` : ""}
${order.notes ? `*Catatan:* ${order.notes}` : ""}

*Detail Pesanan:*
${itemLines}

*Total: ${formatRupiah(order.total_amount)}*

Mohon konfirmasi pesanan saya. Terima kasih! 🙏`;

  // encodeURIComponent() mengubah teks biasa menjadi format URL yang aman
  // (spasi jadi %20, enter jadi %0A, dll.)
  const pesanEncoded = encodeURIComponent(pesan);

  // wa.me adalah URL resmi WhatsApp untuk buka chat langsung
  return `https://wa.me/${ADMIN_WA_NUMBER}?text=${pesanEncoded}`;
};

/**
 * Ambil riwayat pesanan milik user
 * GET /api/my-orders
 */
export const getMyOrders = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const { data } = await API.get("/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("Gagal mengambil riwayat pesanan:", error);
    throw error;
  }
};
