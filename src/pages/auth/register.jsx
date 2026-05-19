import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
// Pastikan path import ini benar sesuai struktur folder src/_services/auth.js kamu
import { register } from "../../_services/auth"; 

export default function Register() {
  const navigate = useNavigate();

  // 1. State Management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi Frontend
    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      setError("Semua field wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      // Mengirim data ke Laravel
      const result = await register(formData);
      
      if (result) {
        alert("Registrasi Berhasil! Silakan masuk.");
        navigate("/login");
      }
    } catch (err) {
      // Menangkap error dari Laravel (misal: email/username sudah ada)
      setError(err.response?.data?.message || "Registrasi Gagal. Periksa kembali data Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
            Create an account
          </h1>

          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400" role="alert">
              {error}
            </div>
          )}

          {/* autoComplete="off" pada form membantu mencegah saran email yang salah */}
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit} autoComplete="off">
            
            {/* 1. FULL NAME */}
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Masukkan Nama Lengkap"
                required
              />
            </div>

            {/* 2. EMAIL */}
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="name@example.com"
                required
              />
            </div>

            {/* 3. USERNAME - Menggunakan autoComplete="username" agar browser tidak mengisinya dengan email */}
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="example_" 
                required
              />
            </div>

            {/* 4. PASSWORD */}
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Processing..." : "Create an account"}
            </button>

            <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-500">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}