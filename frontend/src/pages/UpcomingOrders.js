import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmployeeSidebar from "../components/EmployeeSidebar";

const UpcomingOrder = () => {
  const [latestGroup, setLatestGroup] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const groups = JSON.parse(localStorage.getItem("orderGroups")) || [];
    const latest = groups.length > 0 ? groups[groups.length - 1] : [];
    setLatestGroup(latest);
  }, []);

  // const handleContinue = () => {
  //   navigate("/visualizer");  // or your actual route
  // };
  
  return (
    <Box sx={{ display: "flex" }}>
      <EmployeeSidebar />
      <Box sx={{ padding: "40px", width: "100%" }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          Upcoming Order
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
              <TableRow>
                <TableCell><strong>Product</strong></TableCell>
                <TableCell><strong>Dimensions (mm)</strong></TableCell>
                <TableCell><strong>Weight (kg)</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Security Level</strong></TableCell>
                <TableCell><strong>Room Requirement</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {latestGroup.map((p, idx) => (
                <TableRow key={idx}>
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

        <Button
          variant="outlined"
          sx={{ marginTop: "30px", float: "right" }}
          onClick={() => navigate("/Visualizer")}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default UpcomingOrder;
