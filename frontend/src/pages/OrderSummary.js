import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../api/product";

const OrderSummary = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const groups = JSON.parse(localStorage.getItem("orderGroups")) || [];
    const lastGroup = groups.length > 0 ? groups[groups.length - 1] : [];
    setProducts(lastGroup);
  }, []);

  const handleSaveOrder = async () => {
    try {
      setLoading(true);

      for (let p of products) {
        const payload = {
          name: p.name,
          width: parseFloat(p.width),
          height: parseFloat(p.height),
          depth: parseFloat(p.depth),
          weight: parseFloat(p.weight),
          quantity: parseInt(p.quantity, 10),
          security: p.security,
          temperature: p.temperature,
        };
  
        console.log("Submitting product:", payload);
        const response = await createProduct(payload);
        console.log("Saved to backend:", response.data);
      }
  
      //products saved and in right tables
      alert("All products successfully saved.");
      localStorage.removeItem("products");
      navigate("/CostBreakdown");
    } catch (error) {
      console.error("Error saving products:", error);
      alert("Failed to submit order. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ padding: "40px", width: "100%" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px", textAlign: "center" }}>
          Order Summary
        </Typography>

        {products.length === 0 ? (
          <Typography>No products available.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Dimensions</strong></TableCell>
                  <TableCell><strong>Weight</strong></TableCell>
                  <TableCell><strong>Quantity</strong></TableCell>
                  <TableCell><strong>Security</strong></TableCell>
                  <TableCell><strong>Temperature</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((p, index) => (
                  <TableRow key={index}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{`${p.width}x${p.height}x${p.depth}`}</TableCell>
                    <TableCell>{p.weight}</TableCell>
                    <TableCell>{p.quantity}</TableCell>
                    <TableCell>{p.security}</TableCell>
                    <TableCell>{p.temperature}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Button
          variant="contained"
          sx={{ marginTop: "30px", float: "right" }}
          disabled={loading}
          onClick={handleSaveOrder}
        >
          {loading ? "Saving..." : "Submit Order"}
        </Button>
      </Box>
    </Box>
  );
};

export default OrderSummary;
