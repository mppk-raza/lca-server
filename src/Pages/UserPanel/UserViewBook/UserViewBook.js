import React, { useState } from "react";
import "./UserViewBook.css";
import { useLocation } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

const UserViewBook = () => {
  const { state } = useLocation();
  console.log(state);
  const [loading, setLoading] = useState(false);

  let retrievedObject = localStorage.getItem("user");
  const user = JSON.parse(retrievedObject);

  const addBooking = () => {
    setLoading(true);
    axios
      .post(process.env.REACT_APP_BACKEND_URL + "/api/books/addBooking", {
        ID: state.data._id,
        bookedBy: user._id,
      })
      .then((res) => {
        console.log(res);
        if (res.data.error === false) {
          toast.success(res.data.message);
        } else {
          toast.warn(res.data.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="UserViewBook">
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
      <div className="UserViewBook__back__Btn">
        {" "}
        <Button
          sx={{
            color: "#00a0ad",
            borderColor: "#00a0ad",
            "&:hover": {
              backgroundColor: "#00a0ad",
              color: "#41424C",
              borderColor: "#00a0ad",
            },
            "&:active": { backgroundColor: "#00a0ad" },
          }}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/UserPanel/UserBook"
        >
          Back
        </Button>
      </div>
      <div className="UserViewBook__details__box">
        <div className="UserViewBook__left__img">
          {" "}
          <img src={state.data.imageLink} />
        </div>
        <div className="UserViewBook__right">
          <div className="UserViewBook__right__heading">{state.data.title}</div>
          <div className="UserViewBook__right__status__box">
            Status:
            {state.data.available ? (
              <div className="UserViewBook__right__status__avail">
                Available
              </div>
            ) : (
              <div className="UserViewBook__right__status__notAvail">
                Not Available
              </div>
            )}
          </div>
          <div className="UserViewBook__right__divider"></div>
          <div className="UserViewBook__right__author">
            <div className="UserViewBook__right__author__dot"></div>
            <div className="UserViewBook__right__author__title">
              Author:
            </div>{" "}
            <div className="UserViewBook__right__author__text">
              {state?.data?.author}
            </div>
          </div>
          <div className="UserViewBook__right__author">
            <div className="UserViewBook__right__author__dot"></div>
            <div className="UserViewBook__right__author__title">Language: </div>
            <div className="UserViewBook__right__author__text">English</div>
          </div>
          <div className="UserViewBook__right__author">
            <div className="UserViewBook__right__author__dot"></div>
            <div className="UserViewBook__right__author__title">
              Category:
            </div>{" "}
            <div className="UserViewBook__right__author__text">Test Guide</div>
          </div>
          <div className="UserViewBook__right__author">
            <div className="UserViewBook__right__author__dot"></div>
            <div className="UserViewBook__right__author__title">
              Book Code:
            </div>{" "}
            <div className="UserViewBook__right__author__text">
              {state?.data?._id}
            </div>
          </div>
          <div className="UserViewBook__right__divider"></div>
          {state.data.available ? (
            <div className="UserViewBook__right__btn" onClick={addBooking}>
              Add Book
            </div>
          ) : null}
        </div>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default UserViewBook;
