import React, { useState } from 'react';
import {
  Avatar,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    role: 'CLIENT',
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role: e.target.value,
    });
  };

  const handleSignup = async () => {
    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service to continue.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/signup', {
        ...formData,
        is_google_account: false,
      });

      if (response.status === 200) {
        alert('Signup successful! Please log in.');
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      alert('Signup failed. Try again.');
    }
  };

  return (
    <Grid className="signup-container">
      <Paper elevation={20} className="paper">
        <Grid align="center" sx={{ mb: 3 }}>
          <Avatar className="avatar">
            <PersonAddIcon />
          </Avatar>
          <h2>Sign up</h2>
        </Grid>
  
        <div className="form-row">
          <TextField
            id="name"
            label="Name"
            variant="filled"
            className="text-field"
            fullWidth
            required
            onChange={handleChange}
            value={formData.name}
          />
        </div>
  
        <div className="form-row">
          <TextField
            id="email"
            label="Email"
            variant="filled"
            className="text-field"
            fullWidth
            required
            onChange={handleChange}
            value={formData.email}
          />
        </div>
  
        <div className="form-row">
          <TextField
            id="phone_number"
            label="Phone Number"
            variant="filled"
            className="text-field"
            fullWidth
            required
            onChange={handleChange}
            value={formData.phone_number}
          />
        </div>
  
        <div className="form-row">
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="filled"
            className="text-field"
            fullWidth
            required
            onChange={handleChange}
            value={formData.password}
          />
        </div>
  
        <div className="form-row role-select">
          <FormControl fullWidth className="text-field" required>
            <InputLabel>Role</InputLabel>
            <Select
              id="role"
              value={formData.role}
              onChange={handleRoleChange}
              label="Role"
            >
              <MenuItem value="CLIENT">Client</MenuItem>
              <MenuItem value="EMPLOYEE">Employee</MenuItem>
            </Select>
          </FormControl>
        </div>
  
        {/* Terms of Service Agreement */}
        <Grid container alignItems="center" style={{ marginTop: '10px', marginBottom: '10px' }} className="form-row">
          <input
            type="checkbox"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            id="tos"
            style={{ marginRight: '8px' }}
          />
          <label htmlFor="tos">
            I agree to the <a href="/terms" target="_blank">Terms of Service</a>
          </label>
        </Grid>
  
        {error && <Typography className="error-message">{error}</Typography>}
  
        <div className="form-row">
          <Button
            type="button"
            color="primary"
            className="button"
            fullWidth
            variant="contained"
            onClick={handleSignup}
          >
            Sign up
          </Button>
        </div>
  
        <Typography className="signup-link">
          Already have an account? <Link to="/">Sign in</Link>
        </Typography>
      </Paper>
    </Grid>
  );
  
};

export default Signup;
