import API from "../_api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

/**
 * Kirim pesan baru (Public)
 */
export const sendMessage = async (payload) => {
  const { data } = await API.post("/contacts", payload);
  return data;
};

/**
 * Ambil semua pesan masuk (Admin)
 */
export const getMessages = async () => {
  const { data } = await API.get("/admin/contacts", { headers: authHeader() });
  return data;
};

/**
 * Update status pesan (Admin)
 */
export const updateMessageStatus = async (id, status) => {
  const { data } = await API.patch(`/admin/contacts/${id}/status`, { status }, { headers: authHeader() });
  return data;
};

/**
 * Hapus pesan (Admin)
 */
export const deleteMessage = async (id) => {
  const { data } = await API.delete(`/admin/contacts/${id}`, { headers: authHeader() });
  return data;
};
