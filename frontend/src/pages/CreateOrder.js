import React, { useState } from "react";
import { TextField, Button, MenuItem, Typography, Box, Grid } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const ProductEntry = () => {
  const [products, setProducts] = useState([
    { name: "", width: "", height: "", depth: "", weight: "", quantity: "", security: "", temperature: "" }
  ]);

  const navigate = useNavigate();

  const handleChange = (index, event) => {
    const newProducts = [...products];
    newProducts[index][event.target.name] = event.target.value;
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { name: "", width: "", height: "", depth: "", weight: "", security: "", temperature: "" }
    ]);
  };

  const handleContinue = () => {
    const existingGroups = JSON.parse(localStorage.getItem("orderGroups")) || [];
    existingGroups.push(products); // products = current group being submitted
    localStorage.setItem("orderGroups", JSON.stringify(existingGroups));
    navigate("/OrderSummary");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ padding: "40px", width: "100%" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px", textAlign: 'center' }}>
          Product Entry
        </Typography>

        {products.map((product, index) => (
          <Box key={index} sx={{ marginBottom: "20px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Product Name" name="name" value={product.name} onChange={(e) => handleChange(index, e)} />
              </Grid>
              <Grid item xs={4}><TextField fullWidth label="Width" name="width" value={product.width} onChange={(e) => handleChange(index, e)} /></Grid>
              <Grid item xs={4}><TextField fullWidth label="Height" name="height" value={product.height} onChange={(e) => handleChange(index, e)} /></Grid>
              <Grid item xs={4}><TextField fullWidth label="Depth" name="depth" value={product.depth} onChange={(e) => handleChange(index, e)} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Weight" name="weight" value={product.weight} onChange={(e) => handleChange(index, e)} /></Grid>

              <Grid item xs={6}><TextField fullWidth label="Quantity" name="quantity" value={product.quantity} onChange={(e) => handleChange(index, e)}/></Grid>

              <Grid item xs={6}>
                <TextField select fullWidth label="Security Level" name="security" value={product.security} onChange={(e) => handleChange(index, e)}>
                  <MenuItem value="Regular">Regular</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField select fullWidth label="Temperature Requirement" name="temperature" value={product.temperature} onChange={(e) => handleChange(index, e)}>
                  <MenuItem value="Regular">Regular</MenuItem>
                  <MenuItem value="Cold">Cold</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        ))}

        <Button startIcon={<AddCircleOutline />} onClick={addProduct} sx={{ fontWeight: "bold", color: "#28569f" }}>
          Add Another Product
        </Button>

        <Button variant="outlined" sx={{ marginTop: "20px", float: "right" }} onClick={handleContinue}>
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default ProductEntry;
