import API from "../_api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const getGenres = async () => {
  const { data } = await API.get("/genres");
  return data.data;
};

export const createGenre = async (payload) => {
  const { data } = await API.post("/genres", payload, { headers: authHeader() });
  return data;
};

export const updateGenre = async (id, payload) => {
  const { data } = await API.put(`/genres/${id}`, payload, { headers: authHeader() });
  return data;
};

export const deleteGenre = async (id) => {
  const { data } = await API.delete(`/genres/${id}`, { headers: authHeader() });
  return data;
};

export const getGenreById = async (id) => {
  const { data } = await API.get(`/genres/${id}`);
  return data.data;
};