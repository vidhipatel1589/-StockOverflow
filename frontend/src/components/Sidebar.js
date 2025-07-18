import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Button } from "@mui/material";
import { GridView, AddCircle, Storage, Settings, Logout, MonetizationOnSharp } from "@mui/icons-material";
import { Link,useLocation,useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { useAuth } from '../context/AuthContext';


const Sidebar = () => {

  const location = useLocation(); // Get the current URL path

  // Mapping of routes to active section keys
  const sectionMapping = 
  {
    "/Dashboard": "dashboard",
    "/CreateOrder": "createOrder",
    "/OrderSummary": "orderSummary",
    "/CostBreakdown": "costBreakdown",
    "/Settings": "settings",
  };

  const activeSection = sectionMapping[location.pathname] || ""; // Set active section based on current path
  //Styling for active section
  const activeStyle = {
    backgroundColor: "#28569f", //background for active section
    color: "#fff", //text color for active section
  };

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => 
  {
    logout();
    navigate('/');
  };
  return (
    <div>
    <Drawer
        variant="permanent"
        sx={{
        width: 250,
        flexShrink: 0,
        "& .MuiDrawer-paper": 
        {
            width: 250,
            boxSizing: "border-box",
            backgroundColor: "#333",
            color: "#fff",
        },
        }}>
      <List>
        <ListItem style={{fontSize: "25px", fontWeight: "bold", padding: "16px"}}>⁊Stock⥁verflow</ListItem>
        
        <ListItem>
          <ListItemButton component={Link} to="/Dashboard" 
          style={{
            paddingLeft: 8, 
            paddingRight: 8,
            ...(activeSection === "dashboard" ? activeStyle : {}),//Apply active style if this is the selected section
          }}>
            <ListItemIcon style={{color: "#fff",paddingRight:0}}><GridView /></ListItemIcon>
            <ListItemText
            primary={
            <Typography style={{fontSize: "18px", fontWeight: "bold",marginLeft: -10}}>
                Dashboard
            </Typography>}/>
            </ListItemButton>
        </ListItem>
        
        <ListItem>
          <ListItemButton component={Link} to="/CreateOrder"
          style={{
            paddingLeft: 8, 
            paddingRight: 8,
            ...(activeSection === "createOrder" ? activeStyle : {}),//Apply active style if this is the selected section
          }}>
            <ListItemIcon style={{color: "#fff",paddingRight:0}}><AddCircle /></ListItemIcon>
            <ListItemText
            primary={
            <Typography style={{fontSize: "18px", fontWeight: "bold",marginLeft: -10}}>
                Create Order
            </Typography>}/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton component={Link} to="/OrderSummary"
          style={{
            paddingLeft: 8, 
            paddingRight: 8,
            ...(activeSection === "orderSummary" ? activeStyle : {}),//Apply active style if this is the selected section
          }}>
            <ListItemIcon style={{color: "#fff",paddingRight:0}}><Storage /></ListItemIcon>
            <ListItemText
            primary={
            <Typography style={{fontSize: "18px", fontWeight: "bold",marginLeft: -10}}>
                Order Summary
            </Typography>}/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton component={Link} to="/CostBreakdown"
          style={{
            paddingLeft: 8, 
            paddingRight: 8,
            ...(activeSection === "costBreakdown" ? activeStyle : {}),//Apply active style if this is the selected section
          }}>
            <ListItemIcon style={{color: "#fff",paddingRight:0}}><MonetizationOnSharp /></ListItemIcon>
            <ListItemText
            primary={
            <Typography style={{fontSize: "18px", fontWeight: "bold",marginLeft: -10,whiteSpace: "nowrap"}}>
                Cost Breakdown
            </Typography>}/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton component={Link} to="/Settings" 
          style={{
            paddingLeft: 8, 
            paddingRight: 8,
            ...(activeSection === "settings" ? activeStyle : {}),//Apply active style if this is the selected section
          }}>
            <ListItemIcon style={{color: "#fff",paddingRight:0}}><Settings /></ListItemIcon>
            <ListItemText
            primary={
            <Typography style={{fontSize: "18px", fontWeight: "bold",marginLeft: -10}}>
                Settings
            </Typography>}/>
          </ListItemButton>
        </ListItem>
      </List>

      <div style={{position: "absolute", bottom: 20, left: 20}}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<Logout />}
          onClick={handleLogout}
          style={{marginTop: 8, backgroundColor: "#555", width:"200px"}}
        >
          Logout
        </Button>
      </div> 
    </Drawer>
    </div> 
  );
};

export default Sidebar;
