import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12">
        
        {/* Konten Kiri */}
        <div className="flex-1 text-center lg:text-left z-10">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-indigo-600 uppercase bg-indigo-50 rounded-full">
            Toko Buku Terlengkap & Terpercaya
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Temukan Dunia Baru di Setiap <span className="text-indigo-600">Halaman</span>.
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto lg:mx-0">
            Koleksi buku terlengkap dari berbagai genre. Mulai dari literatur klasik hingga rilis terbaru. Kami hadir untuk memenuhi dahaga membacamu.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Link 
              to="/books" 
              className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
            >
              Mulai Jelajahi Katalog
            </Link>
            <Link 
              to="/about" 
              className="px-8 py-4 bg-white text-gray-700 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all"
            >
              Tentang Kami
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-50 grayscale">
             <span className="font-bold text-xl">Gramedia</span>
             <span className="font-bold text-xl">Bentang</span>
             <span className="font-bold text-xl">Mizan</span>
          </div>
        </div>

        {/* Konten Kanan (Visual) */}
        <div className="flex-1 relative flex justify-center">
          <div className="w-64 h-80 md:w-80 md:h-96 bg-indigo-600 rounded-3xl rotate-6 absolute -z-10 opacity-10 animate-pulse"></div>
          <div className="w-64 h-80 md:w-80 md:h-96 bg-indigo-500 rounded-3xl -rotate-3 absolute -z-10 opacity-20"></div>
          <div className="text-[150px] md:text-[200px] select-none">
            📚
          </div>
        </div>
      </div>
      
      {/* Dekorasi Background */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
    </section>
  );
}
