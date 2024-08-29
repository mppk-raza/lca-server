import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validator from "validator";
import "./SignUp.css";
import { TextField } from "@mui/material";

const UserSignup = () => {
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

  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    occupation: "",
    organization: "",
    showPassword: false,
    showConfirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const handleClickShowPassword = () => {
    setSignUpData({
      ...signUpData,
      showPassword: !signUpData.showPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowConfirmPassword = () => {
    setSignUpData({
      ...signUpData,
      showConfirmPassword: !signUpData.showConfirmPassword,
    });
  };
  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setSignUpData({ ...signUpData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validator.isEmail(signUpData.email)) {
      toast.warn("Incorrect Email. Please enter a valid Email");
    } else if (signUpData.password !== signUpData.confirmPassword) {
      toast.warn("Password not match");
    } else {
      setLoading(true);
      const { confirmPassword, showPassword, showConfirmPassword, ...rest } =
        signUpData;
      console.log(rest);
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL + "/api/users/registeruser",
          rest
        )
        .then((res) => {
          if (res.data.error !== true) {
            toast.success(res.data.message);
            setSignUpData({
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              occupation: "",
              organization: "",
              showPassword: false,
              showConfirmPassword: false,
            });
            setTimeout(() => navigate("/login"), 4000);
          } else {
            toast.warn(res.data.message);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          err.response.data.code === 11000 &&
            toast.warn("User already register with this email");
          setLoading(false);
        });
    }
  };
  return (
    <form className="signUp__form" onSubmit={handleSubmit}>
      <div className="form_input">
        <div className="signUp_textfield">
          <TextField
            fullWidth
            id="standard"
            label="Full Name"
            variant="standard"
            name="name"
            value={signUpData.name}
            onChange={handleChange}
            required
            onKeyPress={(event) => {
              if (/[^A-z\s]/.test(event.key)) {
                event.preventDefault();
              }
            }}
          />
        </div>
        <div className="signUp_textfield">
          <TextField
            fullWidth
            id="standard"
            required
            label="Email Address"
            variant="standard"
            name="email"
            InputProps={{ inputProps: { min: 6 } }}
            value={signUpData.email}
            onChange={handleChange}
          />
        </div>
        <div className="signUp_textfield">
          <TextField
            fullWidth
            id="standard"
            label="Occupation"
            variant="standard"
            name="occupation"
            value={signUpData.occupation}
            onChange={handleChange}
            required
            inputProps={{ minLength: 4 }}
          />
        </div>
        <div className="signUp_textfield">
          <TextField
            fullWidth
            label="Organization"
            variant="standard"
            name="organization"
            value={signUpData.organization}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signUp_textfield">
          <TextField
            fullWidth
            id="standard"
            label="Password"
            variant="standard"
            name="password"
            type={signUpData.showPassword ? "text" : "password"}
            value={signUpData.password}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {signUpData.showPassword ? (
                      <Visibility sx={{ color: "black" }} />
                    ) : (
                      <VisibilityOff sx={{ color: "black" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="signUp_textfield">
          <TextField
            fullWidth
            id="standard"
            label="Confirm Password"
            variant="standard"
            name="confirmPassword"
            type={signUpData.showConfirmPassword ? "text" : "password"}
            value={signUpData.confirmPassword}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownConfirmPassword}
                  >
                    {signUpData.showConfirmPassword ? (
                      <Visibility sx={{ color: "black" }} />
                    ) : (
                      <VisibilityOff sx={{ color: "black" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
      <div>
        <ThemeProvider theme={orangeTheme}>
          <LoadingButton
            className="signUp__btn"
            type="submit"
            loading={loading}
            variant="outlined"
          >
            Register
          </LoadingButton>
        </ThemeProvider>
      </div>
    </form>
  );
};

export default UserSignup;
