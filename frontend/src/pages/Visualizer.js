import React, { useState, useEffect } from "react";
import EmployeeSidebar from "../components/EmployeeSidebar";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const Visualizer = () => {
  const [urls, setUrls] = useState({});
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastProducts, setLastProducts] = useState([]);

  useEffect(() => {
    // Fetch visualizations
    fetch("http://localhost:8000/api/v1/run-optimizer")
      .then((res) => res.json())
      .then((data) => {
        setUrls(data);
        const firstKey = Object.keys(data)[0];
        setSelectedWarehouse(firstKey);
        setLoading(false);
        localStorage.removeItem("orderGroups");
      })
      .catch((err) => {
        console.error("Error fetching visualizations:", err);
        setLoading(false);
      });

    // Fetch product overview
    fetch("http://localhost:8000/api/v1/dashboard-summary")
      .then((res) => res.json())
      .then((data) => {
        setLastProducts(data.last_products || []);
      })
      .catch((err) => {
        console.error("Error fetching product overview:", err);
      });
  }, []);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <EmployeeSidebar />

      <Box sx={{ flex: 1, padding: "40px" }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          Visualizer
        </Typography>

        {/* Dropdown Selection */}
        <FormControl fullWidth sx={{ maxWidth: 300, mb: 4, margin: "0 auto" }}>
          <InputLabel id="warehouse-select-label">Select Warehouse (Security, Temperature)</InputLabel>
          <Select
            labelId="warehouse-select-label"
            value={selectedWarehouse}
            label="Select Warehouse (Security, Temperature)"
            onChange={(e) => setSelectedWarehouse(e.target.value)}
          >
            {Object.keys(urls).map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h6" textAlign="center" mb={2}>
          {selectedWarehouse}
        </Typography>

        {/* Visualization */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            height: "800px",
            margin: "0 auto",
            mb: 4,
            borderRadius: 2,
            border: "1px solid #ccc"
          }}
        >
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : urls[selectedWarehouse] ? (
            <iframe
              title={`${selectedWarehouse} Visualization`}
              src={`http://localhost:8000${urls[selectedWarehouse]}`}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "8px",
              }}
            />
          ) : (
            <Typography textAlign="center" mt={4}>
              No visualization available.
            </Typography>
          )}
        </Box>

        {/* Products Overview */}
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            padding: 2,
            mb: 4,
            minHeight: 250,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center", mb: 1 }}>
            Products Overview
          </Typography>

          <Box sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
                <TableRow>
                  <TableCell align="center"><strong>Product Name</strong></TableCell>
                  <TableCell align="center"><strong>Warehouse Type (Security, Temperature)</strong></TableCell>
                  <TableCell align="center"><strong>Location</strong></TableCell>
                  <TableCell align="center"><strong>Container #</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lastProducts.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.warehouse}</TableCell>
                    <TableCell align="center">{row.location}</TableCell>
                    <TableCell align="center">{row.container}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Visualizer;
