import React, { useState } from "react";
import "./Login.css";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validator from "validator";
import Header from "../../components/Header/Header";
import Modal from "@mui/material/Modal";
import CancelIcon from "@mui/icons-material/Cancel";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Login = ({ refresh, setRefresh }) => {
  let navigate = useNavigate();
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
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [open, setOpen] = useState(false);
  const [forgetEmail, setForgetEmail] = useState("");
  const [loadingResetBtn, setLoadingResetBtn] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => {
    setLoginData({
      ...loginData,
      showPassword: !loginData.showPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  //Handle Login Function
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validator.isEmail(loginData.email)) {
      toast.warn("Incorrect Email. Please enter a valid Email");
    } else {
      setLoading(true);
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL + "/api/users/loginuser",
          loginData
        )
        .then((res) => {
          //console.log(res);
          // alert(res.data.message);
          if (res.data.error !== true) {
            // toast.success(res.data.message);
            setLoginData({
              email: "",
              password: "",
            });
            localStorage.setItem("userType", res.data.userType);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            setRefresh(!refresh)
          } else {
            toast.warn(res.data.message);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          // err.response.data.code===11000
          setLoading(false);
        });
    }
  };

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  //Handle Forget Password Function
  const handleForgetPassSubmit = (e) => {
    e.preventDefault();
    setLoadingResetBtn(true);
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + "/api/users/forgotPasswordRequest",
        { email: forgetEmail }
      )
      .then((res) => {
        setLoadingResetBtn(false);
        if (res.data.error) {
          toast.warn(res.data.message);
        } else {
          toast.success(res.data.message);
          setForgetEmail("");
          setOpen(false);
        }
      })
      .catch((err) => {
        setLoadingResetBtn(false);
        let text =
          err.data && err.data.message
            ? err.data.message
            : "An unexpected error occurred. Please try again.";
        toast.warn(text);
      });
  };
  return (
    <>
      <Header />
      <ThemeProvider theme={orangeTheme}>
        <div className="Login">
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
          <h3>Login</h3>
          <form className="Login__form" onSubmit={handleSubmit}>
            <div className="Login__textfield">
              <FormControl className="Login__formControl">
                <InputLabel htmlFor="standard-adornment-password">
                  Email *
                </InputLabel>
                <Input
                  id="standard-adornment-password"
                  label="Email"
                  variant="standard"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  required
                />
              </FormControl>
            </div>
            <div className="Login__textfield">
              <FormControl className="Login__formControl">
                <InputLabel htmlFor="standard-adornment-password">
                  Password *
                </InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={loginData.showPassword ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  required
                  autoComplete="off"
                  inputProps={{ minLength: 6 }}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {loginData.showPassword ? (
                          <Visibility sx={{ color: "black" }} />
                        ) : (
                          <VisibilityOff sx={{ color: "black" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <div
                onClick={() => setOpen(true)}
                className="Login_Right_Side_Forgot_Container"
              >
                Forgot Password?
              </div>
            </div>
            <div className="register__link">
              Don't have an account yet!
              <Button
                color="success"
                size="small"
                sx={{ marginLeft: "10px" }}
                variant="outlined"
                component={Link}
                to="/signup"
              >
                Register
              </Button>
            </div>
            <div>
              <LoadingButton
                className="Login__btn"
                variant="outlined"
                type="submit"
                loading={loading}
              >
                Login
              </LoadingButton>
            </div>
          </form>
          <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box style={{ maxWidth: "90%" }} sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Enter Email
              </Typography>
              <form onSubmit={handleForgetPassSubmit}>
                <TextField
                  sx={{ margin: "20px 0" }}
                  fullWidth
                  size="small"
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  value={forgetEmail}
                  onChange={(e) => setForgetEmail(e.target.value)}
                  required
                  inputProps={{ minLength: 4 }}
                  autoComplete="off"
                />

                <div className="AdminLogin__forgotPass__modal__btn">
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setOpen(false)}
                    endIcon={<CancelIcon />}
                    variant="contained"
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    size="small"
                    loading={loadingResetBtn}
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
        </div>
      </ThemeProvider>
      <Footer />
    </>
  );
};

export default Login;
