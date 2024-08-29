import React, { useState } from "react";
import "./UserHeader.css";
import logo from "../../../assets/lca-logo.png";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Menu from "@mui/material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Divider from "@mui/material/Divider";
import { useNavigate, useLocation } from "react-router-dom";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import HomeIcon from "@mui/icons-material/Home";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { AnimatePresence, motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Logo2 from "../../../assets/lca-logo-modified.png";
import InputAdornment from "@mui/material/InputAdornment";
import CancelIcon from "@mui/icons-material/Cancel";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { ToastContainer, toast } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

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
const UserHeader = ({ refresh, setRefresh }) => {
  const orangeTheme = createTheme({
    palette: {
      primary: {
        main: "#00a0ad",
      },
      secondary: {
        main: "#41424C",
      },
    },
  });
  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
        type: "spring",
        damping: 8,
      },
    },
    show: {
      width: "max-content",
      opacity: 1,
      transition: {
        duration: 0.2,
        type: "spring",
        damping: 8,
      },
    },
  };
  let retrievedObject = localStorage.getItem("user");
  const user = JSON.parse(retrievedObject);

  const navigate = useNavigate();
  const path = useLocation().pathname;

  const [navDrawer, setNavDrawer] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [openPassChange, setOpenPassChange] = React.useState(false);
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
  const handleResetPassSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL +
          "/api/users/resetUserPasswordLoggedIn",
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
  const hasWindow = typeof window !== "undefined";
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    return {
      width,
    };
  }
  const HandleNavigate = (link) => {
    navigate(link);
    if (windowDimensions.width <= 850) {
      setNavDrawer(false);
    }
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function handleLogout() {
    localStorage.clear();
    setRefresh(!refresh);
    navigate("/UserPanel");
  }
  React.useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);
  return (
    <div className="UserHeader">
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
      <ThemeProvider theme={orangeTheme}>
        <Box sx={{ display: "flex" }}>
          <AppBar
            sx={{
              padding: "0 8.3%",
              bgcolor: "#00a0ad",
              color: "#41424C",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Toolbar sx={{ padding: "0", justifyContent: "space-between" }}>
              <div
                onClick={() => navigate("/")}
                className="UserHeader__logo"
              >
                <img src={logo} alt="logo" width="100%" height="100%" />
              </div>

              <div>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      sx={{ bgcolor: "#41424C" }}
                      alt={user?.name}
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Open settings">
                  <Button
                    onClick={handleOpenUserMenu}
                    variant="text"
                    sx={{ color: "#41424C" }}
                    endIcon={<ArrowDropDownIcon />}
                  >
                    {user?.name}
                  </Button>
                </Tooltip>

                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    onClick={() => {
                      setOpenPassChange(true);
                      handleCloseUserMenu();
                    }}
                  >
                    <Typography textAlign="center">Change Password</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </div>
            </Toolbar>
          </AppBar>
        </Box>
        <div
          onMouseEnter={() => setNavDrawer(true)}
          onMouseLeave={() => setNavDrawer(false)}
          className={
            navDrawer
              ? "UserHeader__nav__icon__box"
              : "UserHeader__nav__icon__box__active"
          }
        >
          <div className="UserHeader__nav__icon__container">
            {windowDimensions.width <= 850 ? (
              <div
                className="UserHeader__nav__menu__icon"
                onClick={() => setNavDrawer(true)}
              >
                {!navDrawer ? <MenuIcon /> : <img src={Logo2} />}
              </div>
            ) : null}
            <div
              className={
                path === "/UserPanel" || path === "/login"
                  ? "UserHeader__nav__icon__active"
                  : "UserHeader__nav__icon"
              }
              onClick={() => HandleNavigate("/UserPanel")}
            >
              <HomeIcon />
            </div>
            <div
              className={
                path === "/UserPanel/UserCourses"
                  ? "UserHeader__nav__icon__active"
                  : "UserHeader__nav__icon"
              }
              onClick={() => HandleNavigate("/UserPanel/UserCourses")}
            >
              <LibraryBooksIcon />
            </div>
            <div
              className={
                path === "/UserPanel/UserBook"
                  ? "UserHeader__nav__icon__active"
                  : "UserHeader__nav__icon"
              }
              onClick={() => HandleNavigate("/UserPanel/UserBook")}
            >
              <AutoStoriesIcon />
            </div>
            <div
              className={
                path === "/UserPanel/Trainings"
                  ? "UserHeader__nav__icon__active"
                  : "UserHeader__nav__icon"
              }
              onClick={() => HandleNavigate("/UserPanel/Trainings")}
            >
              <SchoolRoundedIcon />
            </div>
          </div>
        </div>
        <AnimatePresence>
          {navDrawer ? (
            <motion.div
              variants={showAnimation}
              initial="hidden"
              animate="show"
              exit="hidden"
              onMouseEnter={() => setNavDrawer(true)}
              onMouseLeave={() => setNavDrawer(false)}
              className="UserHeader__nav__box"
            >
              <div className="UserHeader__nav__item__container">
                {windowDimensions.width <= 850 ? (
                  <div
                    className="UserHeader__nav__item__closeIcon"
                    onClick={() => setNavDrawer(false)}
                  >
                    <ArrowBackIosIcon fontSize="small" />
                  </div>
                ) : null}
                <div
                  className={
                    path === "/UserPanel" || path === "/login"
                      ? "UserHeader__nav__item__active"
                      : "UserHeader__nav__item"
                  }
                  onClick={() => HandleNavigate("/UserPanel")}
                >
                  Home
                </div>
                <div
                  className={
                    path === "/UserPanel/UserCourses"
                      ? "UserHeader__nav__item__active"
                      : "UserHeader__nav__item"
                  }
                  onClick={() => HandleNavigate("/UserPanel/UserCourses")}
                >
                  Courses
                </div>
                <div
                  className={
                    path === "/UserPanel/UserBook"
                      ? "UserHeader__nav__item__active"
                      : "UserHeader__nav__item"
                  }
                  onClick={() => HandleNavigate("/UserPanel/UserBook")}
                >
                  Books
                </div>
                <div
                  className={
                    path === "/UserPanel/Trainings"
                      ? "UserHeader__nav__item__active"
                      : "UserHeader__nav__item"
                  }
                  onClick={() => HandleNavigate("/UserPanel/Trainings")}
                >
                  Trainings
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <Modal
          open={openPassChange}
          // onClose={() => setOpenPassChange(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="UserHeader__passChange__modal">
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

              <div className="UserHeader__passChange__modal__btn">
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
      </ThemeProvider>
    </div>
  );
};

export default UserHeader;
