/**
 * Halaman About Us (Tentang Kami)
 */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-indigo-600 py-20 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Membaca Adalah Jendela Dunia 🌍</h1>
          <p className="text-indigo-100 text-lg md:text-xl">
            BukuKu hadir untuk mendekatkan literasi kepada siapa saja, kapan saja, dan di mana saja.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Kisah Kami</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Dimulai dari sebuah rak buku kecil di sudut kamar, BukuKu tumbuh dengan satu misi sederhana: memberikan akses mudah ke buku-buku berkualitas bagi seluruh masyarakat Indonesia.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Kami percaya bahwa setiap buku memiliki pembacanya masing-masing. Oleh karena itu, kami menyediakan berbagai genre, mulai dari fiksi yang menghibur hingga literatur pendidikan yang mencerahkan.
            </p>
          </div>
          <div className="bg-indigo-50 rounded-3xl p-8 flex items-center justify-center text-8xl">
            📚✨
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Mengapa Memilih BukuKu?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-2">Kualitas Terjamin</h3>
              <p className="text-gray-500 text-sm">Semua buku yang kami jual adalah 100% original dari penerbit terpercaya.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-2">Pengiriman Cepat</h3>
              <p className="text-gray-500 text-sm">Kami bekerja sama dengan ekspedisi terbaik untuk memastikan bukumu sampai tepat waktu.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-2">Layanan Ramah</h3>
              <p className="text-gray-500 text-sm">Admin kami siap membantu konsultasi buku yang cocok untuk kebutuhanmu.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
