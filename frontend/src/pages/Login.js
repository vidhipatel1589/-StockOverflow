// import React, { useEffect, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import {
//   Avatar,
//   Grid,
//   Paper,
//   TextField,
//   Button,
//   Typography,
//   Divider,
// } from '@mui/material';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';
// import './Login.css';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth(); 
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');


//   const handleLogin = () => {
//     if (username === 'admin' && password === 'admin123') {
//       const user = { name: 'Employee', role: 'employee' };
//       login(user);
//       navigate('/EmployeeDashboard'); 
//     } else if (username === 'user' && password === '1234') {
//       const user = { name: 'Client', role: 'client' };
//       login(user);
//       navigate('/Dashboard');
//     } else {
//       alert('Invalid credentials');
//     }
//   };
  

//   useEffect(() => {}, []);

//   return (
//     <Grid className="login-container">
//       <Paper elevation={10} className="paper">
//         <Grid align="center">
//           <Avatar className="avatar">
//             <LockOutlinedIcon />
//           </Avatar>
//           <h2>Sign in</h2>
//         </Grid>
//         <TextField
//           label="Email"
//           variant="filled"
//           fullWidth
//           required
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="text-field"
//         />
//         <TextField
//           label="Password"
//           type="password"
//           variant="filled"
//           fullWidth
//           required
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="text-field"
//         />

//         {error && <Typography className="error-message">{error}</Typography>}

//         <Button
//           type="button"
//           color="primary"
//           className="button"
//           fullWidth
//           variant="contained"
//           onClick={handleLogin}
//         >
//           Sign In
//         </Button>

//         <Divider className="divider">or</Divider>

//         <div id="google-signin" style={{ display: 'flex', justifyContent: 'center' }}></div>

//         <Typography className="signup-link">
//           Don't have an account? <Link to="/signup">Sign up</Link>
//         </Typography>
//       </Paper>
//     </Grid>
//   );
// };

// export default Login;



import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Avatar,Grid,Paper,TextField,Button,Typography,Divider} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const paperStyle = { padding: 30, height: '53vh', width: 280, margin: '150px auto' };
  const avatarStyle = { backgroundColor: '#28569f' };
  const buttonStyle = { margin: '5px 0', backgroundColor: '#28569f' };
  const fieldStyle = { margin: '20px 0' };
  const signupStyle = { margin: '0 5px', display: 'inline-block' };

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      const user = { name: 'Employee', role: 'employee' };
      login(user);
      navigate('/EmployeeDashboard'); 
    } else if (username === 'user' && password === '1234') {
      const user = { name: 'Client', role: 'client' };
      login(user);
      navigate('/Dashboard');
    } else {
      alert('Invalid credentials');
    }
  };
  

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '300297785084-8bemkn4hrm9cjpvb206p7fafd23pjbor.apps.googleusercontent.com',
        callback: handleCredentialResponse
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin'),
        { theme: 'outline', size: 'large' }
      );
    }
  }, []);

  const handleCredentialResponse = (response) => {
    const user = jwtDecode(response.credential);
    login(user);
    navigate('/Dashboard');
  };

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center" sx={{ mb: 3 }}>
          <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
          <h2>Sign in</h2>
        </Grid>
        <TextField
          id="username"
          label="Username"
          variant="filled"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          variant="filled"
          style={fieldStyle}
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="button"
          color="primary"
          style={buttonStyle}
          fullWidth
          variant="contained"
          onClick={handleLogin}
        >
          Sign In
        </Button>
        <Divider style={{ margin: '20px 0' }}>or</Divider>
        <div id="google-signin" style={{ display: 'flex', justifyContent: 'center' }}></div>
        <Typography style={{ margin: '10px 35px', fontSize: '14px' }}>
          Don't have an account?
          <Link to="/signup" style={signupStyle}>
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default Login;