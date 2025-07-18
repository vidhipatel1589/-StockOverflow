import React, { useState } from "react";
import { createProduct, getProduct } from "../api/product";

const TestProducts = () => {
  const [product, setProduct] = useState(null);
  const [fetchedProduct, setFetchedProduct] = useState(null);

  const testCreateProduct = async () => {
    const productData = {
      Name: "Desk Lamp",
      Height: 30,
      Width: 15,
      Depth: 15,
      Weight: 5,
      Price: 49.99,
      Temperature_requirement: 20.0,
      Security_level: 1
    };
    try {
      const response = await createProduct(productData);
      console.log("✅ Product Created:", response.data);
      setProduct(response.data);
    } catch (error) {
      console.error("❌ Error creating product:", error.response?.data || error.message);
    }
  };

  const testGetProduct = async (id) => {
    try {
      const response = await getProduct(id);
      console.log("✅ Product Fetched:", response.data);
      setFetchedProduct(response.data);
    } catch (error) {
      console.error("❌ Error fetching product:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>Test Products API</h2>
      <button onClick={testCreateProduct}>Create Product</button>
      {product && (
        <div>
          <h4>Created Product:</h4>
          <pre>{JSON.stringify(product, null, 2)}</pre>
          <button onClick={() => testGetProduct(product.Product_ID)}>Fetch This Product</button>
        </div>
      )}
      {fetchedProduct && (
        <div>
          <h4>Fetched Product:</h4>
          <pre>{JSON.stringify(fetchedProduct, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestProducts;
