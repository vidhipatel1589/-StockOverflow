import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const CostBreakdown = () => {
  const [costData, setCostData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCostData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/cost-breakdown");
        setCostData(response.data);
      } catch (error) {
        console.error("Failed to fetch cost breakdown:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCostData();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ padding: "40px", width: "100%" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px", textAlign: "center" }}>
          Cost Breakdown by Warehouse Type
        </Typography>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : !costData ? (
          <Typography>No cost data available.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
                <TableRow>
                  <TableCell><strong>Warehouse Type</strong></TableCell>
                  <TableCell><strong>Total Area (m²)</strong></TableCell>
                  <TableCell><strong>Cost Per Square Meter</strong></TableCell>
                  <TableCell><strong>Total Monthly Cost</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(costData).map(([type, values]) => (
                  <TableRow key={type}>
                    <TableCell>{type.replace("_", ", ")}</TableCell>
                    <TableCell>{values.total_area}</TableCell>
                    <TableCell>${values.cost_per_m2}</TableCell>
                    <TableCell>${values.total_cost.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default CostBreakdown;
