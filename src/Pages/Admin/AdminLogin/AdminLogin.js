//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//Imports
import React from "react";
import "./AdminLogin.css";
import logo from "../../../assets/lca-logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import axios from "axios";
import Modal from "@mui/material/Modal";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button } from "@mui/material";
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

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//Exported Function
export default function AdminLogin({ setrefresh, refresh }) {
  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  //Variables
  const navigate = useNavigate();
  const [Email, setEmail] = React.useState("");
  const [Password, setPassword] = React.useState("");
  const [forgetEmail, setForgetEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [loadingResetBtn, setLoadingResetBtn] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  //Main Login API Call
  function LoginAPI() {
    setLoading(true);
    const body = {
      email: Email,
      password: Password,
    };
    axios
      .post(
        "" + process.env.REACT_APP_BACKEND_URL + "/api/admin/loginAdmin",
        body
      )
      .then((res) => {
        setLoading(false);
        if (res.data.error) {
          toast.warn(res.data.message);
        } else {
          localStorage.setItem("userType", res.data.userType);
          localStorage.setItem("token", res.data.token);
          // setTimeout(() => navigate("/admin"), 5000);
          setrefresh(!refresh);
        }
      })
      .catch((err) => {
        setLoading(false);
        let text =
          err.data && err.data.message
            ? err.data.message
            : "An unexpected error occurred. Please try again.";
        toast.warn(text);
      });
  }
  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  //Login Button Handler
  function handleLogin() {
    if (Email === "" || Password === "") {
      // alert({ message: "Please enter all required details", type: "warning" })
      toast.warn("Please enter all required details");
    } else {
      LoginAPI();
    }
  }

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  //Handle Forget Password Function
  const handleForgetPassSubmit = (e) => {
    e.preventDefault();
    setLoadingResetBtn(true);
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + "/api/admin/forgotPasswordRequest",
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
  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  //Main Return Call
  return (
    <div className="AdminLogin">
      {/* Alert Absolute Box */}
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
      {/* Login Container */}
      <div className="AdminLogin_Center">
        <div className="AdminLogin_Right_Side">
          <div className="AdminLogin_Right_Side_Head_Container">
            <div className="AdminLogin_Right_Side_Head">
              <img className={"header__logo"} src={logo} alt="logo" onClick={() => { navigate("/") }} />
            </div>
          </div>
          <div className="AdminLogin_Right_Side_Green_Text">Welcome Back!</div>
          <div className="AdminLogin_Right_Side_White_Text">
            Please login with Admin credentials to continue
          </div>

          <div className="AdminLogin_Right_Side_Input_Box">
            <div className="AdminLogin_Right_Side_Input_OneBox_Text">Email</div>
            <input
              className="AdminLogin_Right_Side_Input_OneBox_Input"
              type="email"
              value={Email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <div className="AdminLogin_Right_Side_Input_OneBox_Text">
              Password
            </div>
            <input
              className="AdminLogin_Right_Side_Input_OneBox_Input"
              type="password"
              value={Password}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div
            onClick={() => setOpen(true)}
            className="AdminLogin_Right_Side_Forgot_Container"
          >
            Forgot Password?
          </div>
          <div className="AdminLogin_Right_Side_Button_Container">
            {loading ? (
              <LoadingButton
                className="AdminLogin_Right_Side_Login_Button"
                loading
                loadingPosition="end"
                endIcon={<VpnKeyIcon />}
                variant="contained"
              >
                Login
              </LoadingButton>
            ) : (
              <LoadingButton
                onClick={() => {
                  handleLogin();
                }}
                className="AdminLogin_Right_Side_Login_Button"
                variant="contained"
              >
                Login
              </LoadingButton>
            )}
          </div>
        </div>
      </div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
  );
}
