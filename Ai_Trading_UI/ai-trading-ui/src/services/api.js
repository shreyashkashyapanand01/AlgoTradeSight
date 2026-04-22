import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
});

// ---------------- STOCK ----------------
export const analyzeStock = (symbol) =>
  API.get(`/stock/${symbol}`);

export const scanMarket = () =>
  API.get(`/stock/scan`);

// ---------------- MARKET ----------------
export const getLiveTicker = () =>
  API.get(`/api/market/ticker`);

// ---------------- TRADE ----------------
export const analyzeTrades = (data) =>
  API.post("/trade/analyze", data);

export const uploadTradesCSV = (formData) =>
  API.post("/trade/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

// ---------------- USER ----------------
export const createUser = (data) =>
  API.post("/user", data);

export const getUsers = () =>
  API.get("/user");

export const getUserById = (id) =>
  API.get(`/user/${id}`);

export const updateUser = (id, data) =>
  API.put(`/user/${id}`, data);

export const deleteUser = (id) =>
  API.delete(`/user/${id}`);


// ---------------- PORTFOLIO ----------------

// Add Holding
export const addHolding = (userId, data) =>
  API.post(`/portfolio/holding/${userId}`, data);

// Get Holdings
export const getHoldings = (userId) =>
  API.get(`/portfolio/holding/${userId}`);

// Update Holding
export const updateHolding = (holdingId, data) =>
  API.put(`/portfolio/holding/${holdingId}`, data);

// Delete Holding
export const deleteHolding = (holdingId) =>
  API.delete(`/portfolio/holding/${holdingId}`);

// Analyze Portfolio (AI)
export const analyzePortfolio = (userId) =>
  API.get(`/portfolio/analyze/${userId}`);