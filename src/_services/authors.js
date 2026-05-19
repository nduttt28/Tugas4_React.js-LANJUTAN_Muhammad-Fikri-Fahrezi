import API from "../_api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const getAuthors = async () => {
  const { data } = await API.get("/authors");
  return data.data;
};

export const createAuthor = async (payload) => {
  const { data } = await API.post("/authors", payload, { headers: authHeader() });
  return data;
};

export const updateAuthor = async (id, payload) => {
  const { data } = await API.put(`/authors/${id}`, payload, { headers: authHeader() });
  return data;
};

export const deleteAuthor = async (id) => {
  const { data } = await API.delete(`/authors/${id}`, { headers: authHeader() });
  return data;
};

export const getAuthorById = async (id) => {
  const { data } = await API.get(`/authors/${id}`);
  return data.data;
};