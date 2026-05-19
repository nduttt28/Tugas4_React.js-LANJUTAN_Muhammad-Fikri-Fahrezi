import { useJwt } from "react-jwt";
import API from "../_api";

/**
 * Fungsi Login
 * Mengirim kredensial ke backend dan mengembalikan data (token/user)
 */
export const login = async ({ email, password }) => {
  try {
    const { data } = await API.post('/login', { email, password });
    return data;
  } catch (error) {
    console.log(error); // Sesuai permintaanmu menggunakan console.log
    throw error;
  }
};

/**
 * Fungsi Logout (Sesuai Standar Dosen)
 * 1. Mengirim token ke backend untuk di-revoke
 * 2. Menyertakan Header Authorization Bearer
 * 3. Menghapus data dari localStorage setelah berhasil
 */
export const logout = async (token) => {
  try {
    // Memanggil API logout dengan payload token dan header Bearer
    const { data } = await API.post('/logout', { token }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    // Menghapus semua session di sisi klien
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("UserInfo"); // Antisipasi perbedaan case kunci

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Hook untuk Mendekode Token
 * Memeriksa validitas dan masa kadaluarsa token JWT
 */
export const useDecodeToken = (token) => {
  // Menggunakan library react-jwt untuk validasi
  const { decodedToken, isExpired } = useJwt(token);

  try {
    // Jika tidak ada token
    if (!token) {
      return {
        success: false,
        message: "Token tidak ditemukan",
        data: null
      };
    }

    // Jika token sudah kadaluarsa
    if (isExpired) {
      return {
        success: false,
        message: "Token expired",
        data: null
      };
    }

    // Jika token valid
    return {
      success: true,
      message: "Token valid",
      data: decodedToken
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null
    };
  }
};

export const register = async (userData) => {
  try {
    const { data } = await API.post('/register', userData);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};