import React from "react";
import "./MobileHeader.css";
import logo from "../../assets/lca-logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate, useLocation } from "react-router-dom";

const MobileHeader = () => {
  const navigate = useNavigate();
  const search = useLocation().pathname;
  let retrievedObject = localStorage.getItem("user");
  const user = JSON.parse(retrievedObject);
  const [state, setState] = React.useState({
    right: false,
  });
  let anchor = "right";

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };


  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 300 }}
      role="presentation"
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List style={{ backgroundColor: "#00a0ad" }}>
        <ListItem disablePadding>
          <div className="MobileNavBar__head">
            <img className="mobile__header__logo2" src={logo} alt="logo" />
            <div
              className="mobile__header__close"
              onClick={toggleDrawer(anchor, false)}
            >
              <CloseIcon fontSize="large" style={{ color: "#41424C" }} />
            </div>
          </div>
        </ListItem>
      </List>
      <List>
        <ListItem disablePadding component={Link} to="/">
          <ListItemButton>
            <ListItemText style={search === "/" ? { color: "#00a0ad" } : { color: "white" }} primary="Home" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider sx={{ width: "100%" }} />
      <List>
        <ListItem disablePadding component={Link} to="/aboutus">
          <ListItemButton>
            <ListItemText style={search === "/aboutus" ? { color: "#00a0ad" } : { color: "white" }} primary="About Us" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider sx={{ width: "100%" }} />
      <List>
        <ListItem disablePadding component={Link} to="/Updates">
          <ListItemButton>
            <ListItemText style={search === "/Updates" ? { color: "#00a0ad" } : { color: "white" }} primary="Updates" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider sx={{ width: "100%" }} />
      <List>
        <ListItem disablePadding component={Link} to="/Gallery">
          <ListItemButton>
            <ListItemText style={search === "/Gallery" ? { color: "#00a0ad" } : { color: "white" }} primary="Gallery" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider sx={{ width: "100%" }} />
      {localStorage.getItem("token") && localStorage.userType === "User" ? (
        <>

          <List>
            <ListItem disablePadding component={Link} to="/Login">
              <ListItemButton>
                <ListItemText style={{ color: "white" }} primary="Go to Dashboard" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      ) : (
        <>
          <List>
            <ListItem disablePadding component={Link} to="/Login">
              <ListItemButton>
                <ListItemText style={search === "/Login" || search === "/UserPanel" ? { color: "#00a0ad" } : { color: "white" }} primary="Login" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider sx={{ width: "100%" }} />
          <List>
            <ListItem disablePadding component={Link} to="/signup">
              <ListItemButton>
                <ListItemText style={search === "/signup" ? { color: "#00a0ad" } : { color: "white" }} primary="Register" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}

      <Divider sx={{ width: "100%" }} />
    </Box>
  );
  return (
    <div className="MobileNavBar">
      <div className="MobileNavBar__box">
        <div className="MobileNavBar__left">
          <div className="MobileNavBar__left__logo">
            <Link to="/">
              <img className="mobile__header__logo" src={logo} alt="logo" />
            </Link>
          </div>
        </div>
        <div className="MobileNavBar__right">
          <div
            onClick={toggleDrawer("right", true)}
            className="MobileNavBar__right__btn"
          >
            <MenuIcon sx={{ fontSize: 30 }} style={{ color: "#00a0ad" }} />
          </div>
          <Drawer
            PaperProps={{
              sx: {
                backgroundColor: "#41424C",
              },
            }}
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
