import React from "react";
import "./Admin.css";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import SendIcon from "@mui/icons-material/Send";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Dashboard from "./Dashboard/Dashboard";
import Users from "./Users/Users";
import Books from "./Books/Books";
import Updates from "./Updates/Updates";
import Banner from "./Banner/Banner";
import Statistics from "./Statistics/Statistics";
import Video from "./Video/Video";
import Gallery from "./Gallery/Gallery";
import Testimonials from "./Testimonials/Testimonials";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCourse from "./AddCourse/AddCourse";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LanguageIcon from "@mui/icons-material/Language";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import Logo from "../../assets/lca-logo.png";
import Logo2 from "../../assets/lca-logo-modified.png";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Description from "@mui/icons-material/Description";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import TextField from "@mui/material/TextField";
import CollectionsIcon from "@mui/icons-material/Collections";
import MenuItem from "@mui/material/MenuItem";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Menu from "@mui/material/Menu";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import SchoolIcon from "@mui/icons-material/School";
import AllCourses from "./AllCourses/AllCourses";
import Modal from "@mui/material/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import BarChartIcon from "@mui/icons-material/BarChart";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import SettingsIcon from "@mui/icons-material/Settings";
import Training from "./Trainings/Trainings";
import LearningPartners from "./LearningPartners/LearningPartners";
import Reports from "./Reports/Reports";
import IssuedBooks from "./IssuedBooks/IssuedBooks";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const drawerWidth = 250;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  // zIndex: theme.zIndex.drawer + 1,

  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    justifyContent: "space-between",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
// const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Admin = ({ refresh, setrefresh }) => {
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [route, setRoute] = React.useState(path);
  const [openWeb, setOpenWeb] = React.useState(false);
  const [openCourse, setOpenCourse] = React.useState(false);
  const [openBooks, setOpenBooks] = React.useState(false);
  const [openPassChange, setOpenPassChange] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [restPassword, setRestPassword] = React.useState({
    token: localStorage.getItem("token"),
    oldPass: "",
    newPass: "",
  });
  const restPassHandleChange = (e) => {
    let { name, value } = e.target;
    setRestPassword({ ...restPassword, [name]: value });
  };
  const handleClickShowPassword = () => {
    setRestPassword({
      ...restPassword,
      showPassword: !restPassword.showPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowConfirmPassword = () => {
    setRestPassword({
      ...restPassword,
      showConfirmPassword: !restPassword.showConfirmPassword,
    });
  };
  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleWebClick = () => {
    setOpenWeb(!openWeb);
    setOpen(true);
  };
  const handleCourseClick = () => {
    setOpenCourse(!openCourse);
    setOpen(true);
  };
  const handleBooksClick = () => {
    setOpenBooks(!openBooks);
    setOpen(true);
  };
  const handleDrawerOpen = () => {
    setOpen(!open);
    setOpenWeb(false);
    setOpenCourse(false);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setOpenWeb(false);
    setOpenCourse(false);
  };

  function handleLogout() {
    localStorage.clear();
    setrefresh(!refresh);
    navigate("/admin");
  }

  const handleResetPassSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL +
          "/api/admin/resetAdminPasswordLoggedIn",
        restPassword
      )
      .then((res) => {
        if (res.data.error !== true) {
          toast.success(res.data.message);
          setRestPassword({
            token: localStorage.getItem("token"),
            oldPass: "",
            newPass: "",
          });
          setOpenPassChange(false);
        } else {
          toast.warn(res.data.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          open={open}
          sx={{
            bgcolor: "#00a0ad",
            color: "black",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={
                open
                  ? { marginRight: 0, ...(open && { display: "none" }) }
                  : { marginLeft: 6.8, marginRight: 0 }
              }
            >
              <MenuIcon sx={{ color: "white" }} />
            </IconButton>
            <Typography variant="h6" noWrap color={"white"} component="div">
              Admin Panel
            </Typography>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <SettingsIcon sx={{ color: "white", fontSize: "30px" }} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  key="Change Password"
                  onClick={() => {
                    setOpenPassChange(true);
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center">Change Password</Typography>
                </MenuItem>
                <MenuItem
                  key="logout"
                  onClick={() => {
                    handleCloseUserMenu();
                    handleLogout();
                  }}
                >
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          PaperProps={{
            sx: {
              backgroundColor: "#41424C",
              color: "white",
            },
          }}
        >
          <DrawerHeader>
            {open ? (
              <>
                <img
                  className="img"
                  alt="logo"
                  src={Logo}
                  width="auto"
                  height="60px"
                />
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "rtl" ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon sx={{ color: "white" }} />
                  )}
                </IconButton>
              </>
            ) : (
              <img
                className="img2"
                alt="logo"
                src={Logo2}
                width="auto"
                height="45px"
              />
            )}
          </DrawerHeader>
          <Divider
            sx={{ width: "86%", bgcolor: "lightslategray", margin: "0 auto" }}
          />
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => navigate("/admin")}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <DashboardIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Dashboard"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider
            sx={{ width: "86%", bgcolor: "lightslategray", margin: "0 auto" }}
          />
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => navigate("/admin/users")}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <PeopleAltIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary="Users" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider
            sx={{ width: "86%", bgcolor: "lightslategray", margin: "0 auto" }}
          />

          <List>
            <ListItemButton onClick={handleCourseClick}>
              <ListItemIcon>
                <LibraryBooksIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Courses" />
              {openCourse ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openCourse} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/admin/AddCourse")}
                >
                  <ListItemIcon>
                    <AddBoxIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Add New Course" />
                </ListItemButton>
              </List>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/admin/AllCourses")}
                >
                  <ListItemIcon>
                    <FormatListBulletedIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="All Courses" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
          <Divider
            sx={{ width: "86%", bgcolor: "lightslategray", margin: "0 auto" }}
          />
          <List>
            <ListItemButton onClick={handleBooksClick}>
              <ListItemIcon>
                <MenuBookIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Books" />
              {openBooks ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openBooks} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/admin/books")}
                >
                  <ListItemIcon>
                    <MenuBookIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="All Books" />
                </ListItemButton>
              </List>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/admin/issuedBooks")}
                >
                  <ListItemIcon>
                    <FormatListBulletedIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Issused Books" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
          <Divider
            sx={{ width: "86%", bgcolor: "lightslategray", margin: "0 auto" }}
          />
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => navigate("/admin/reports")}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <Description sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Reports"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider
            sx={{ width: "86%", bgcolor: "lightslategray", margin: "0 auto" }}
          />
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => navigate("/admin/trainings")}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <SchoolRoundedIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Trainings"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider
            sx={{ width: "86%", bgcolor: "lightslategray", margin: "0 auto" }}
          />
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => navigate("/admin/updates")}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <BrowserUpdatedIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Updates"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider
            sx={{ width: "86%", bgcolor: "lightslategray", margin: "0 auto" }}
          />
          <List>
            <ListItemButton onClick={handleWebClick}>
              <ListItemIcon>
                <LanguageIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Web" />
              {openWeb ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openWeb} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/admin/banner")}
                >
                  <ListItemIcon>
                    <SubtitlesIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Banner" />
                </ListItemButton>
              </List>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/admin/statistics")}
                >
                  <ListItemIcon>
                    <BarChartIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Statistics" />
                </ListItemButton>
              </List>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/admin/video")}
                >
                  <ListItemIcon>
                    <SlowMotionVideoIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Video" />
                </ListItemButton>
              </List>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/admin/testimonials")}
                >
                  <ListItemIcon>
                    <FormatQuoteIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Testimonials" />
                </ListItemButton>
              </List>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/admin/learningPartners")}
                >
                  <ListItemIcon>
                    <SchoolIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Learning Partners" />
                </ListItemButton>
              </List>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/admin/gallery")}
                >
                  <ListItemIcon>
                    <CollectionsIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Gallery" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
          <Divider
            sx={{ width: "86%", bgcolor: "lightslategray", margin: "0 auto" }}
          />
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          {path === "/admin" ? (
            <Dashboard />
          ) : path === "/admin/users" ? (
            <Users />
          ) : path === "/admin/books" ? (
            <Books />
          ) : path === "/admin/issuedBooks" ? (
            <IssuedBooks />
          ) : path === "/admin/updates" ? (
            <Updates />
          ) : path === "/admin/trainings" ? (
            <Training />
          ) : path === "/admin/banner" ? (
            <Banner />
          ) : path === "/admin/statistics" ? (
            <Statistics />
          ) : path === "/admin/video" ? (
            <Video />
          ) : path === "/admin/testimonials" ? (
            <Testimonials />
          ) : path === "/admin/learningPartners" ? (
            <LearningPartners />
          ) : path === "/admin/gallery" ? (
            <Gallery />
          ) : path === "/admin/AddCourse" ? (
            <AddCourse />
          ) : path === "/admin/AllCourses" ? (
            <AllCourses />
          ) : path === "/admin/reports" ? (
            <Reports />
          ) : null}
        </Box>
      </Box>
      <Modal
        open={openPassChange}
        // onClose={() => setOpenPassChange(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="Admin__passChange__modal">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Reset Password
          </Typography>
          <form onSubmit={handleResetPassSubmit}>
            <FormControl
              fullWidth
              variant="outlined"
              sx={{ margin: "15px auto" }}
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Old Password*
              </InputLabel>
              <OutlinedInput
                fullWidth
                id="outlined-adornment-password"
                type={restPassword.showPassword ? "text" : "password"}
                name="oldPass"
                label="New Password"
                value={restPassword.oldPass}
                required
                autoComplete="off"
                inputProps={{ minLength: 6 }}
                onChange={restPassHandleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {restPassword.showPassword ? (
                        <Visibility sx={{ color: "black" }} />
                      ) : (
                        <VisibilityOff sx={{ color: "black" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl
              fullWidth
              variant="outlined"
              sx={{ margin: "15px auto" }}
            >
              <InputLabel htmlFor="outlined-adornment-password">
                New Password*
              </InputLabel>
              <OutlinedInput
                fullWidth
                id="outlined-adornment-password"
                type={restPassword.showConfirmPassword ? "text" : "password"}
                name="newPass"
                label="Old Password"
                value={restPassword.newPass}
                required
                autoComplete="off"
                inputProps={{ minLength: 6 }}
                onChange={restPassHandleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownConfirmPassword}
                    >
                      {restPassword.showConfirmPassword ? (
                        <Visibility sx={{ color: "black" }} />
                      ) : (
                        <VisibilityOff sx={{ color: "black" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <div className="Admin__passChange__modal__btn">
              <LoadingButton
                size="small"
                color="error"
                onClick={() => setOpenPassChange(false)}
                loading={loading}
                loadingPosition="end"
                endIcon={<CancelIcon />}
                variant="contained"
              >
                Cancel
              </LoadingButton>
              <LoadingButton
                size="small"
                loading={loading}
                loadingPosition="end"
                endIcon={<SendIcon />}
                variant="contained"
                type="submit"
              >
                Submit
              </LoadingButton>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default Admin;
