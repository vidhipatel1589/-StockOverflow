import React, { useEffect, useState } from "react";
import axios from "axios";
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import EmployeeSidebar from "../components/EmployeeSidebar";

const EmployeeDashboard = () => {
  const [stats, setStats] = useState([]);
  const [warehouseTable, setWarehouseTable] = useState([]);
  const [chartSurface, setChartSurface] = useState([]);
  const [chartRevenue, setChartRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/employee-dashboard");
        const data = res.data;

        const s = data.stats;
        setStats([
          { title: "Total Storage Units", value: s.total_units },
          { title: "Monthly Revenue", value: s.monthly_revenue, prefix: "$" },
          { title: "Total Products", value: s.total_products },
          { title: "Most Used Warehouse", value: s.most_used_warehouse }
        ]);

        setWarehouseTable(data.warehouse_table || []);
        setChartSurface(data.chart_surface || []);
        setChartRevenue(data.chart_revenue || []);
      } catch (error) {
        console.error("Error fetching employee dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <EmployeeSidebar />
      <Box
        sx={{
          flexGrow: 1,
          padding: "30px",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh"
        }}
      >
        {/* Top Stat Cards */}
        <Grid container spacing={13} sx={{ marginBottom: 3 }}>
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
                  textAlign: "center"
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ marginBottom: "2px" }}
                >
                  {card.title}
                </Typography>

                {card.title.includes("Most Used Warehouse") && (
                  <Typography
                    variant="caption"
                    sx={{ color: "#888", marginBottom: "4px", marginTop: 0 }}
                  >
                    (Security, Temperature)
                  </Typography>
                )}

                <Typography variant="h6" fontWeight="bold">
                  {card.prefix ?? ""}
                  {card.value?.toLocaleString?.() ?? "N/A"}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Warehouse Overview Table */}
        <Paper
          elevation={2}
          sx={{
            width: "1100px",
            padding: 2,
            mb: 4,
            minHeight: 250,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", textAlign: "center", mb: 1 }}
          >
            Warehouse Overview
          </Typography>

          <Box sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
                <TableRow>
                  <TableCell align="center">
                    <strong>Warehouse Name</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Total Products</strong>
                  </TableCell>
                  <TableCell align="center">
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {warehouseTable.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.products}</TableCell>
                    <TableCell align="center">{row.clients}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>

        {/* Charts */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {/* Surface Area Used Chart */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                width: "500px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", mb: 3 }}
              >
                Total Warehouse Surface Area Used
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartSurface}>
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

          {/* Monthly Revenue Chart */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                width: "500px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", mb: 3 }}
              >
                Monthly Revenue
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartRevenue}>
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
        </Grid>
      </Box>
    </Box>
  );
};

export default EmployeeDashboard;
