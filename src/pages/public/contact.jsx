import { useState } from "react";
import { sendMessage } from "../../_services/contacts";

/**
 * Halaman Contact Us (Hubungi Kami)
 */
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await sendMessage(formData);
      if (res.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch {
      alert("Gagal mengirim pesan. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Hubungi Kami 👋</h1>
          <p className="text-gray-500">Punya pertanyaan atau keluhan? Sampaikan di bawah ini.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Info Card */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0">
                📍
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Alamat Kantor</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Jl. Perpustakaan No. 123, <br />
                  Kota Literasi, Indonesia 12345
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0">
                📞
              </div>
              <div>
                <h3 className="font-bold text-gray-800">WhatsApp Admin (Order)</h3>
                <p className="text-gray-500 text-sm mt-1">+62 815-4272-2924</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0">
                ✉️
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Email Support</h3>
                <p className="text-gray-500 text-sm mt-1">halo@bukuku.id</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            {success ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  ✓
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Terima Kasih!</h3>
                <p className="text-gray-500 text-sm mt-2">Keluhan Anda telah kami terima dan akan segera diproses oleh tim admin.</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-6 text-indigo-600 font-semibold hover:underline text-sm"
                >
                  Kirim pesan lagi
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Anda</label>
                  <input 
                    type="text" 
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm" 
                    placeholder="Masukkan nama..." 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm" 
                    placeholder="Masukkan email..." 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pesan / Keluhan</label>
                  <textarea 
                    rows="4" 
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm resize-none" 
                    placeholder="Apa yang bisa kami bantu?"
                  ></textarea>
                </div>
                <button 
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Mengirim..." : "Kirim Keluhan"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
