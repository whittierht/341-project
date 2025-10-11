import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getAll = () => api.get("/contacts").then(r => r.data);

export const createOne = (c) => api.post("/contacts", c).then(r => r.data); 

export const updateOne = (id, c) => api.put(`/contacts/${id}`, c); // 204

export const deleteOne = (id) => api.delete(`/contacts/${id}`);
