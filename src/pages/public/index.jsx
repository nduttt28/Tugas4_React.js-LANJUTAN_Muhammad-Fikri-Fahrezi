import { useEffect, useState } from "react";
import Hero from "../../components/hero";
import Testimonial from "../../components/testimonial";
import { getBooks } from "../../_services/books";
import { Link } from "react-router-dom";

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        // Ambil 4 buku pertama saja untuk ditampilkan di Home
        setFeaturedBooks(data.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const formatRupiah = (angka) => "Rp" + Number(angka).toLocaleString("id-ID");

  return (
    <>
      <Hero />

      {/* Section: Rekomendasi Buku */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">📚 Rekomendasi Untukmu</h2>
              <p className="text-gray-500 mt-2">Buku-buku pilihan terbaik minggu ini.</p>
            </div>
            <Link to="/books" className="text-indigo-600 font-semibold hover:underline flex items-center gap-1">
              Lihat Semua Katalog <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
               <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredBooks.map((book) => (
                <Link 
                  key={book.id} 
                  to={`/books/${book.id}`}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img 
                      src={book.cover_photo ? `http://localhost:8001/storage/books/${book.cover_photo}` : "https://via.placeholder.com/300x400?text=No+Cover"} 
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 line-clamp-1 mb-1">{book.title}</h3>
                    <p className="text-xs text-gray-400 mb-3">{book.author?.name || "Penulis Anonim"}</p>
                    <p className="text-indigo-600 font-bold">{formatRupiah(book.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Testimonial />
    </>
  );
}