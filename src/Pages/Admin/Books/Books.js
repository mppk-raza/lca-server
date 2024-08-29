import { Button } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./Books.css";
import { toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import validator from "validator";
import Switch from "@mui/material/Switch";

const orangeTheme = createTheme({
  palette: { primary: { main: "#00a0ad" }, secondary: { main: "#41424C" } },
});

export default function Books() {
  const [data, setData] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [modalType, setModalType] = React.useState("New");
  const [filter, setFilter] = useState("All");
  const [modalObject, setModalObject] = React.useState({
    available: true,
    title: "",
    author: "",
    imageLink: "",
    bookingDate: null,
    bookedBy: null,
    isDeleted: false,
  });
  const [refresh, setrefresh] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleRadioChange = (event) => {
    setFilter(event.target.value);
  };
  function editModal(item) {
    setOpenModal(true);
    setModalType("Edit");
    setModalObject({
      available: item.available,
      title: item.title,
      author: item.author,
      imageLink: item.imageLink,
      bookingDate: item.bookingDate,
      bookedBy: item.bookedBy,
      isDeleted: item.isDeleted,
      _id: item._id,
    });
  }
  function newModal() {
    setOpenModal(true);
    setModalType("New");
    setModalObject({
      available: true,
      title: "",
      author: "",
      imageLink: "",
      bookingDate: null,
      bookedBy: null,
      isDeleted: false,
      _id: null,
    });
  }
  function closeModal() {
    setOpenModal(false);
    setModalType("New");
    setModalObject({
      available: true,
      title: "",
      author: "",
      imageLink: "",
      bookingDate: null,
      bookedBy: null,
      isDeleted: false,
      _id: null,
    });
  }

  function saveChanges() {
    if (!loading) {
      if (
        modalObject.title === "" ||
        modalObject.author === "" ||
        modalObject.imageLink === ""
      ) {
        toast.warn("Please input all the data required");
      } else if (!validator.isURL(modalObject.imageLink)) {
        toast.warn("Please input valid link");
      } else {
        let API_Link = "";
        if (modalType === "Edit") {
          API_Link = process.env.REACT_APP_BACKEND_URL + "/api/books/editBook";
          // API_Link = "http://localhost:7000" + "/api/books/editBook"
        } else {
          API_Link = process.env.REACT_APP_BACKEND_URL + "/api/books/addBook";
          // API_Link = "http://localhost:7000" + "/api/books/addBook"
        }
        let API_Object = {
          _id: modalObject._id,
          available: modalObject.available,
          title: modalObject.title,
          author: modalObject.author,
          imageLink: modalObject.imageLink,
          bookingDate: modalObject.bookingDate,
          bookedBy: modalObject.bookedBy,
          isDeleted: modalObject.isDeleted,
          token: localStorage.getItem("token"),
        };

        setLoading(true);
        axios
          .post(API_Link, API_Object)
          .then((res) => {
            setLoading(false);
            if (res.data.error) {
              toast.warn(res.data.message);
            } else {
              toast.success(res.data.message);
              closeModal();
              setrefresh(!refresh);
            }
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
            toast.warn("An unexpected error occurred. Please try again.");
          });
      }
    } else {
      toast.info(
        "Please wait while your previous pending process is completed."
      );
    }
  }

  function handleModalObjectChange(name, newValue) {
    setModalObject({ ...modalObject, [name]: newValue });
  }

  function APICall(link, body) {
    if (!loading) {
      setLoading(true);
      // axios.post("http://localhost:7000" + "/api/books" + link, body)
      axios
        .post(process.env.REACT_APP_BACKEND_URL + "/api/books" + link, body)
        .then((res) => {
          setLoading(false);
          if (res.data.error) {
            toast.warn(res.data.message);
          } else {
            toast.success(res.data.message);
            setrefresh(!refresh);
            closeModal();
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          toast.warn("An unexpected error occurred. Please try again.");
        });
    } else {
      toast.info(
        "Please wait while your previous pending process is completed."
      );
    }
  }

  React.useEffect(() => {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "/api/books/getBooks")
      // axios.get("http://localhost:7000" + "/api/books/getBooks")
      .then((res) => {
        setLoading(false);
        if (!res.data.error) {
          setData(res.data.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.warn(
          "An unexpected error while fetching books. Please try again"
        );
        console.log(err);
      });
  }, [refresh]);

  return (
    <>
      {loading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}
      <Modal
        sx={{ display: "flex", alignItems: "center" }}
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="Books__Modal">
          {loading ? (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={true}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : null}
          <div className="Books__Modal__Head">{modalType} Book</div>
          <br />
          <TextField
            fullWidth
            id="outlined-basic"
            variant="outlined"
            label="Title"
            required
            name="title"
            value={modalObject.title}
            onChange={(e) => {
              handleModalObjectChange("title", e.target.value);
            }}
          />
          <br />
          <br />
          <TextField
            fullWidth
            id="outlined-basic"
            variant="outlined"
            label="Author"
            required
            name="author"
            value={modalObject.author}
            onChange={(e) => {
              handleModalObjectChange("author", e.target.value);
            }}
          />
          <br />
          <br />
          <TextField
            fullWidth
            id="outlined-basic"
            variant="outlined"
            label="Image Link"
            required
            name="imageLink"
            value={modalObject.imageLink}
            onChange={(e) => {
              handleModalObjectChange("imageLink", e.target.value);
            }}
          />
          <br />
          <br />
          <ThemeProvider theme={orangeTheme}>
            <Button
              variant="contained"
              sx={{ marginRight: "20px" }}
              onClick={() => {
                saveChanges();
              }}
            >
              Save
            </Button>
            {modalObject.available ? (
              <Button
                variant="contained"
                onClick={() => {
                  APICall("/addBookingByAdmin", {
                    token: localStorage.getItem("token"),
                    ID: modalObject._id,
                  });
                }}
              >
                Create Self Booking
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => {
                  APICall("/endBooking", {
                    token: localStorage.getItem("token"),
                    ID: modalObject._id,
                  });
                }}
              >
                End Current Booking
              </Button>
            )}
          </ThemeProvider>
        </div>
      </Modal>
      <div className="Books">
        <div className="Books__Head">
          <span className="Books__Head__Text">Books</span>
          <div>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={filter}
              onChange={handleRadioChange}
              // onClick={() => setRefresh(!refresh)}
            >
              <FormControlLabel
                label="All"
                value="All"
                control={
                  <Radio
                    sx={{
                      "&, &.Mui-checked": {
                        color: "#00a0ad",
                      },
                    }}
                  />
                }
              />
              <FormControlLabel
                label="Activated"
                value="Activated"
                control={
                  <Radio
                    sx={{
                      "&, &.Mui-checked": {
                        color: "#00a0ad",
                      },
                    }}
                  />
                }
              />
              <FormControlLabel
                label="Hidden"
                value="Hidden"
                control={
                  <Radio
                    sx={{
                      "&, &.Mui-checked": {
                        color: "#00a0ad",
                      },
                    }}
                  />
                }
              />
            </RadioGroup>
          </div>
          <ThemeProvider theme={orangeTheme}>
            <Button
              variant="contained"
              onClick={() => {
                newModal();
              }}
            >
              {" "}
              + New Book
            </Button>
          </ThemeProvider>
        </div>
        {data
          ? data.length > 0
            ? data
                ?.filter((obj) => {
                  if (filter === "All") {
                    return obj;
                  } else if (filter === "Activated") {
                    return obj.isDeleted === false;
                  } else if (filter === "Hidden") {
                    return obj.isDeleted === true;
                  } else return obj;
                })
                .map((item) => {
                  return (
                    <div className="Books__Object">
                      <img
                        src={item.imageLink}
                        style={item.isDeleted ? { opacity: "0.4" } : null}
                        className="Books__Object__Image"
                      />
                      <div
                        className="Books__Object__Head"
                        style={item.isDeleted ? { opacity: "0.4" } : null}
                      >
                        {item.title}
                      </div>
                      <div
                        className="Books__Object__Text"
                        style={item.isDeleted ? { opacity: "0.4" } : null}
                      >
                        {item.author}
                      </div>
                      <div
                        className="Books__Object__Date"
                        style={item.isDeleted ? { opacity: "0.4" } : null}
                      >
                        {item.available
                          ? "Available for booking"
                          : "Issued on " +
                            new Date(item.bookingDate).toLocaleDateString(
                              undefined,
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                time: "short",
                              }
                            ) +
                            " at " +
                            new Date(item.bookingDate)
                              .toTimeString()
                              .slice(0, 8)}
                      </div>
                      <ThemeProvider theme={orangeTheme}>
                        <div className="Books__Object__ButtonBox">
                          {item.isDeleted ? (
                            <Button
                              variant="contained"
                              onClick={() => {
                                APICall("/retrieve", {
                                  ID: item._id,
                                  token: localStorage.getItem("token"),
                                });
                              }}
                            >
                              Retrieve
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              onClick={() => {
                                APICall("/delete", {
                                  ID: item._id,
                                  token: localStorage.getItem("token"),
                                });
                              }}
                            >
                              Delete
                            </Button>
                          )}
                          <Button
                            variant="contained"
                            onClick={() => {
                              editModal(item);
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </ThemeProvider>
                      <br />
                    </div>
                  );
                })
            : "No data found"
          : "Loading"}
      </div>
    </>
  );
}
