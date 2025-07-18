import API from "./api";  // import your axios instance

// Create a new Order

// (Optional) You can add more functions here later like getOrders(), deleteOrder(), etc.

export const createOrder = (data) => API.post("/orders/", data);
export const createProduct = (data) => API.post("/product/", data);
