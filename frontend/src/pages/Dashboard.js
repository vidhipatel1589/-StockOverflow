import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import axios from "axios";

import { BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [lastProducts, setLastProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Placeholder chart data (replace with your actual logic)
  const chartData = [
    { name: "Regular", value: 3000 },
    { name: "High-Security", value: 1500 },
    { name: "Temperature", value: 500 },
  ];

  const [costChart, setCostChart] = useState([]);
  const [spaceChart, setSpaceChart] = useState([]);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/dashboard-summary");
        const data = res.data;
  
        setStats([
          { title: "Total Products", value: data.total_products },
          { title: "Total Storage Units", value: data.total_containers },
          { title: "Total Monthly Cost", value: data.total_monthly_cost, prefix: "$" },
          { title: "Total Storage Months", value: data.total_storage_months },
          { title: "Most Used Storage", value: data.most_used_warehouse }
        ]);
  
        setLastProducts(data.last_products || []);
        setCostChart(data.cost_chart || []);
        setSpaceChart(data.space_chart || []);
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      }
    };
  
    fetchStats();
  }, []);
  

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          padding: "30px",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        {/* Stat Cards */}
        <Grid container spacing={5} sx={{ marginBottom: 3 }}>
          {stats.map((card, idx) => (
            <Grid item xs={10} sm={6} md={3} key={idx}>
              <Paper
                elevation={3}
                sx={{
                  width: "162px",
                  minHeight: 100,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {card.title}
                </Typography>
                {card.title === "Most Used Storage" && (
                  <Typography variant="caption" sx={{ color: "#888", mb: 1 }}>
                    (Security, Temperature)
                  </Typography>
                )}
                <Typography variant="h6" fontWeight="bold">
                  {card.prefix ?? ""}{card.value.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Products Overview */}
        <Paper
          elevation={2}
          sx={{
            width: "1100px",
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

          {/* Table */}
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

        {/* Charts Section  */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {/* Chart 1 */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                width: "500px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ marginLeft: "30px", textAlign: "center", mb: 3 }}
              >
                Monthly Storage Cost Breakdown
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
              <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Chart 2 */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                width: "500px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ marginLeft: "30px", textAlign: "center", mb: 3 }}
              >
                Warehouse Space Usage
              </Typography>
              {/* Insert your actual chart here */}
              <Box sx={{ flexGrow: 1 }}>
              <ResponsiveContainer width="100%" height={300}>
              <BarChart data={spaceChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Client C16 Graphs */}
<Grid container spacing={4} sx={{ mt: 2 }}>
  {/* C16 Cost Breakdown PNG */}
  <Grid item xs={12} md={6}>
    <Paper
      elevation={3}
      sx={{
        p: 2,
        width: "500px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h6" textAlign="center" mb={2}>
        Client C16 Monthly Cost Breakdown
      </Typography>
      <Box
        component="img"
        src="http://localhost:8000/static/client_costs/client_c16_costs.png"
        alt="Client C16 Cost Breakdown"
        sx={{ width: "100%", height: "auto", borderRadius: 2 }}
      />
    </Paper>
  </Grid>
      {/* C16 Space Usage PNG */}
      <Grid item xs={12} md={6}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            width: "500px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" textAlign="center" mb={2}>
            Client C16 Warehouse Space Usage
          </Typography>
          <Box
            component="img"
            src="http://localhost:8000/static/client_space_usage/client_c16_space_usage.png"
            alt="Client C16 Space Usage"
            sx={{ width: "100%", height: "auto", borderRadius: 2 }}
          />
        </Paper>
      </Grid>
    </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
