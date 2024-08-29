import axios from "axios";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';

export default function AdminPasswordVerify({ type }) {
  const search = useLocation().search;
  const navigate = useNavigate();
  const confirmationCode = new URLSearchParams(search).get("code");
  const [loading, setLoading] = React.useState(false);
  const [MyText, setMyText] = React.useState(null);
  const [forgetData, setForgetData] = React.useState({
    email: "",
    newPass: "",
    rePass: "",
  });

  React.useEffect(() => {
    if (!confirmationCode) {
      setMyText("The Password Reset link is invalid. \n Redirecting to Home...")
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
  }, [])

  const handleChange = (e) => {
    let { name, value } = e.target;
    setForgetData({ ...forgetData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (forgetData.rePass === "" || forgetData.newPass === "" || forgetData.email === "") {
      toast.warn("Please fill all the required fields");
    } else {
      if (forgetData.rePass === forgetData.newPass) {
        setLoading(true);
        axios.post(process.env.REACT_APP_BACKEND_URL + "/api/" + type + "/forgotPasswordReset",
          {
            email: forgetData.email,
            newPass: forgetData.newPass,
            confirmationCode: confirmationCode,
          }
        ).then((res) => {
          if (res.data.error) {
            toast.warn(res.data.message);
            setLoading(false);
          } else {
            setMyText(res.data.message + "\n" + "Redirecting to Login...")
            setLoading(false);
            setTimeout(() => {
              if (type === "admin") navigate("/admin");
              else navigate("/login");
            }, 5000);
          }
        }).catch((err) => {
          console.log(err);
          toast.warn("Unexpected Error Occurred \n Please try again");
          setLoading(false);
        });
      } else {
        toast.warn("The two passwords do not match");
      }
    }
  };
  //console.log(MyText);
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
      <Button
        onClick={() => { navigate("/") }}
        variant="contained"
        sx={{ backgroundColor: "#00a0ad", marginLeft: "20px", marginTop: "20px", ":hover": { backgroundColor: "#41424C" } }}
        startIcon={<ArrowBackIosRoundedIcon />}>
        HOME
      </Button>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          backgroundColor: "white",
          color: "#00a0ad",
          fontSize: "xx-large",
          textAlign: "center",
          whiteSpace: "pre-line",
        }}
      >
        {(MyText === null) ? (
          <form onSubmit={handleSubmit}>
            <div>Password Reset</div>
            <TextField
              sx={{ margin: "20px 0" }}
              fullWidth
              id="outlined-basic"
              label="Email"
              variant="outlined"
              name="email"
              value={forgetData.email}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <TextField
              sx={{ marginBottom: "20px" }}
              fullWidth
              id="outlined-password-input"
              label="New Password"
              type="password"
              variant="outlined"
              name="newPass"
              value={forgetData.newPass}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <TextField
              sx={{ marginBottom: "20px" }}
              fullWidth
              id="outlined-password-input"
              label="Re-Enter Password"
              type="password"
              variant="outlined"
              name="rePass"
              value={forgetData.rePass}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <div>
              <LoadingButton
                onClick={handleSubmit}
                loading={loading}
                loadingPosition="end"
                variant="contained"
                type="submit"
                sx={{ backgroundColor: "#00a0ad", ":hover": { backgroundColor: "#41424C" } }}
              >
                Submit
              </LoadingButton>
            </div>
          </form>
        ) : (
          MyText
        )}
      </div>
    </>
  );
}
