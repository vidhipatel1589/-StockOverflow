// src/api/product.js
import API from "./api";

// Create a new product
export const createProduct = (productData) => {
  return API.post("/products/", productData);
};

// Fetch a product by ID
export const getProduct = (productId) => {
  return API.get(`/products/${productId}`); 
};

export const getProducts = () => {
    return API.get("/products/");
  };



