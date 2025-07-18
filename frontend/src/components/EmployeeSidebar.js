import { Drawer,List,ListItem,ListItemButton,ListItemIcon,ListItemText,Button,Typography,} from "@mui/material";
import { GridView,EventNote,Logout,Settings,Schema} from "@mui/icons-material"; 
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
  
  const EmployeeSidebar = () => {
    const location = useLocation();
  
    const sectionMapping = {
      "/EmployeeDashboard": "employeeDashboard",
      "/UpcomingOrders": "upcomingOrders",
      "/Visualizer": "visualizer",
      "/EmployeeSettings": "employeeSettings",
    };
  
    const activeSection = sectionMapping[location.pathname] || "";
  
    const activeStyle = {
      backgroundColor: "#28569f",
      color: "#fff",
    };
  
     const navigate = useNavigate();
      const { logout } = useAuth();
    
      const handleLogout = () => 
      {
        logout();
        navigate('/');
      };
  
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
            backgroundColor: "#333",
            color: "#fff",
          },
        }}
      >
        <List>
          <ListItem style={{ fontSize: "25px", fontWeight: "bold", padding: "16px" }}>
            ⁊Stock⥁verflow
          </ListItem>
  
          <ListItem>
            <ListItemButton
              component={Link}
              to="/EmployeeDashboard"
              style={{
                paddingLeft: 8,
                paddingRight: 8,
                ...(activeSection === "employeeDashboard" ? activeStyle : {}),
              }}
            >
              <ListItemIcon style={{ color: "#fff", paddingRight: 0 }}>
                <GridView />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography style={{ fontSize: "18px", fontWeight: "bold", marginLeft: -10 }}>
                    Dashboard
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
  
          <ListItem>
            <ListItemButton
              component={Link}
              to="/UpcomingOrders"
              style={{
                paddingLeft: 8,
                paddingRight: 8,
                ...(activeSection === "upcomingOrders" ? activeStyle : {}),
              }}
            >
              <ListItemIcon style={{ color: "#fff", paddingRight: 0 }}>
                <EventNote />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography style={{ fontSize: "18px", fontWeight: "bold", marginLeft: -10 }}>
                    Upcoming Orders
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
  
          <ListItem>
            <ListItemButton
              component={Link}
              to="/Visualizer"
              style={{
                paddingLeft: 8,
                paddingRight: 8,
                ...(activeSection === "visualizer" ? activeStyle : {}),
              }}
            >
              <ListItemIcon style={{ color: "#fff", paddingRight: 0 }}>
                <Schema />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography style={{ fontSize: "18px", fontWeight: "bold", marginLeft: -10 }}>
                    Visualizer
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              component={Link}
              to="/EmployeeSettings"
              style={{
                paddingLeft: 8,
                paddingRight: 8,
                ...(activeSection === "employeeSettings" ? activeStyle : {}),
              }}
            >
              <ListItemIcon style={{color: "#fff",paddingRight:0}}><Settings /></ListItemIcon>
              <ListItemText
                primary={
                  <Typography style={{ fontSize: "18px", fontWeight: "bold", marginLeft: -10 }}>
                    Settings
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </List>
  
        <div style={{ position: "absolute", bottom: 20, left: 20 }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Logout />}
            onClick={handleLogout}
            style={{ marginTop: 8, backgroundColor: "#555", width: "200px" }}
          >
            Logout
          </Button>
        </div>
      </Drawer>
    );
  };
  
  export default EmployeeSidebar;
  