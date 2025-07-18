import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import EmployeeSidebar from '../components/EmployeeSidebar';
import { useNavigate } from "react-router-dom";

const EmployeeSettings = () => {
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);

    const handleDeleteAccount = () => {
      setShowSuccess(true);
  
      // Delay navigation by 2 seconds
      setTimeout(() => {
        navigate("/"); 
      }, 2000);
    };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Outer Colored Container */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          p: 10,
        }}
      >
        {/* Inner Container */}
        <Box
          sx={{
            backgroundColor: '#fff',
            border: '2px solid #28569f', 
            borderRadius: 2,
            p: 4,
            maxWidth: 700,
            width: '100%',
            boxShadow: 3,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            mb={3}
          >
            Profile Settings
          </Typography>

          {showSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Account deleted successfully. Redirecting to Login page...
            </Alert>
          )}

          <Paper
            elevation={0}
            sx={{
              p: 2,
              background: 'transparent',
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="Name"
              defaultValue="Mark Paul"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Username"
              defaultValue="markpaul13"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email account"
              defaultValue="markpaul1234@gmail.com"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Mobile number"
              defaultValue="822-333-4550"
              margin="normal"
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 3,
              }}
            >
              <Button variant="outlined" color="error" onClick={handleDeleteAccount} disabled={showSuccess}>
                Delete Account
              </Button>
              <Button variant="outlined" color="primary" disabled={showSuccess}>
                Save
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeSettings;
