import { Button, MenuItem, Select } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./Trainings.css";
import { toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import validator from "validator";
import Switch from "@mui/material/Switch";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

const orangeTheme = createTheme({
  palette: { primary: { main: "#00a0ad" }, secondary: { main: "#41424C" } },
});

export default function Trainings() {
  const [data, setData] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [modalType, setModalType] = React.useState("New");
  const [filter, setFilter] = useState("All");
  const [modalObject, setModalObject] = React.useState({
    startDate: Date.now(),
    endDate: Date.now(),
    name: "",
    description: "",
    location: "",
    openTo: "public",
    capacity: 100,
    slotsLeft: 100,
    trainingThumbnail: "",
    participants: [],
    eventType: "Physical",
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
      startDate: item.startDate.slice(0, 10),
      endDate: item.endDate.slice(0, 10),
      name: item.name,
      description: item.description,
      location: item.location,
      openTo: item.openTo,
      capacity: item.capacity,
      slotsLeft: item.slotsLeft,
      trainingThumbnail: item?.trainingThumbnail,
      participants: item.participants,
      eventType: item.eventType,
      _id: item._id,
    });
  }
  function newModal() {
    setOpenModal(true);
    setModalType("New");
    setModalObject({
      startDate: Date.now(),
      endDate: Date.now(),
      name: "",
      description: "",
      location: "",
      openTo: "public",
      capacity: 100,
      slotsLeft: 100,
      participants: [],
      eventType: "physical",
    });
  }
  function closeModal() {
    setOpenModal(false);
    setModalType("New");
    setModalObject({
      startDate: Date.now(),
      endDate: Date.now(),
      name: "",
      description: "",
      location: "",
      openTo: "public",
      capacity: 100,
      slotsLeft: 100,
      participants: [],
      eventType: "physical",
    });
  }

  function saveChanges() {
    if (!loading) {
      if (
        modalObject.name === "" ||
        modalObject.description === "" ||
        modalObject.location === ""
      ) {
        toast.warn("Please input all the data required");
      } else if (
        !validator.isDate(modalObject.startDate) ||
        !validator.isDate(modalObject.endDate)
      ) {
        toast.warn(
          "The date format is not recognizable. Please re-select date from calendar"
        );
      } else {
        let API_Link = "";
        if (modalType === "Edit") {
          API_Link =
            process.env.REACT_APP_BACKEND_URL + "/api/trainings/editTraining";
          // API_Link = "http://localhost:7000" + "/api/trainings/editTraining"
        } else {
          API_Link =
            process.env.REACT_APP_BACKEND_URL + "/api/trainings/addTraining";
          // API_Link = "http://localhost:7000" + "/api/trainings/addTraining"
        }
        let API_Object = {
          startDate: modalObject.startDate,
          endDate: modalObject.endDate,
          name: modalObject.name,
          description: modalObject.description,
          location: modalObject.location,
          openTo: modalObject.openTo,
          capacity: modalObject.capacity,
          slotsLeft: modalObject.slotsLeft,
          trainingThumbnail: modalObject.trainingThumbnail,
          participants: modalObject.participants,
          eventType: modalObject.eventType,
          _id: modalObject._id,
          token: localStorage.getItem("token"),
        };
        console.log(API_Object);
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
      console.log(body);
      setLoading(true);
      // axios.post("http://localhost:7000" + "/api/trainings" + link, body)
      axios
        .post(process.env.REACT_APP_BACKEND_URL + "/api/trainings" + link, body)
        .then((res) => {
          setLoading(false);
          if (res.data.error) {
            toast.warn(res.data.message);
          } else {
            toast.success(res.data.message);
            setrefresh(!refresh);
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
    // axios.get("http://localhost:7000" + "/api/trainings/getAllTrainings")
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "/api/trainings/getAllTrainings")
      .then((res) => {
        console.log(res);
        setLoading(false);
        if (!res.data.error) {
          setData(res.data.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.warn(
          "An unexpected error while fetching trainings. Please try again"
        );
        console.log(err);
      });
  }, [refresh]);

  React.useEffect(() => {
    if (modalType === "New" && openModal) {
      handleModalObjectChange("slotsLeft", modalObject.capacity);
    }
  }, [modalObject.capacity]);

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
        <div className="Trainings__Modal">
          {loading ? (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={true}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : null}
          <div className="Trainings__Modal__Head">{modalType} Training</div>
          <div className="Trainings__Modal__Body">
            <TextField
              sx={{ width: "48%", marginRight: "4%" }}
              id="outlined-basic"
              variant="outlined"
              label="Name"
              required
              name="name"
              value={modalObject.name}
              onChange={(e) => {
                handleModalObjectChange("name", e.target.value);
              }}
            />
            <TextField
              sx={{ width: "48%" }}
              id="outlined-basic"
              variant="outlined"
              label="Location"
              required
              name="location"
              value={modalObject.location}
              onChange={(e) => {
                handleModalObjectChange("location", e.target.value);
              }}
            />
            <br />
            <br />
            <TextField
              fullWidth
              id="outlined-basic"
              variant="outlined"
              label="Description"
              required
              name="description"
              value={modalObject.description}
              onChange={(e) => {
                handleModalObjectChange("description", e.target.value);
              }}
            />
            <br />
            <br />
            <TextField
              sx={{ width: "48%", marginRight: "4%" }}
              id="outlined-basic"
              variant="outlined"
              type="number"
              label="Capacity"
              required
              name="capacity"
              value={modalObject.capacity}
              onChange={(e) => {
                handleModalObjectChange("capacity", e.target.value);
              }}
            />
            <TextField
              sx={{ width: "48%" }}
              id="outlined-basic"
              variant="outlined"
              type="number"
              label="Slots Left"
              required
              name="slotsLeft"
              value={modalObject.slotsLeft}
              onChange={(e) => {
                if (e.target.value <= modalObject.capacity) {
                  handleModalObjectChange("slotsLeft", e.target.value);
                }
              }}
            />
            <br />
            <br />
            <TextField
              fullWidth
              id="outlined-basic"
              variant="outlined"
              label="Thumbnail URL"
              required
              name="trainingThumbnail"
              value={modalObject.trainingThumbnail}
              onChange={(e) => {
                handleModalObjectChange("trainingThumbnail", e.target.value);
              }}
            />
            <br />
            <br />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <div className="Trainings__Modal__Bottom">
                <div className="Trainings__Modal__Bottom__Left">
                  <div className="Trainings__Modal__Bottom__Left__One">
                    <div className="Trainings__Modal__Date__Head">
                      Start Date
                    </div>
                    <DesktopDatePicker
                      className="Trainings__Modal__Date__Picker"
                      inputFormat="dd/MM/yyyy"
                      value={modalObject.startDate}
                      onChange={(e) => {
                        handleModalObjectChange("startDate", e);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      disableHighlightToday={true}
                      showDaysOutsideCurrentMonth={true}
                      disablePast={true}
                    />
                    <br />
                    <br />
                    <div className="Trainings__Modal__Date__Head">
                      Start Time
                    </div>
                    <TimePicker
                      value={modalObject.startDate}
                      onChange={(e) => {
                        handleModalObjectChange("startDate", e);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                  <div className="Trainings__Modal__Bottom__Left__One">
                    <div className="Trainings__Modal__Date__Head">End Date</div>
                    <DesktopDatePicker
                      className="Trainings__Modal__Date__Picker"
                      inputFormat="dd/MM/yyyy"
                      value={modalObject.endDate}
                      onChange={(e) => {
                        handleModalObjectChange("endDate", e);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      disableHighlightToday={true}
                      showDaysOutsideCurrentMonth={true}
                      disablePast={true}
                    />
                    <br />
                    <br />
                    <div className="Trainings__Modal__Date__Head">End Time</div>
                    <TimePicker
                      value={modalObject.endDate}
                      onChange={(e) => {
                        handleModalObjectChange("endDate", e);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                  <div className="Trainings__Modal__Bottom__Left__One">
                    <div className="Trainings__Modal__Date__Head">
                      Training Type
                    </div>
                    <div className="Trainings__Modal__Bottom__Left__Type__Content">
                      <ThemeProvider theme={orangeTheme}>
                        <Switch
                          checked={
                            modalObject.eventType === "physical" ? false : true
                          }
                          onChange={() => {
                            if (modalObject.eventType === "physical") {
                              handleModalObjectChange("eventType", "online");
                            } else {
                              handleModalObjectChange("eventType", "physical");
                            }
                          }}
                        />
                        <span>{modalObject.eventType.toUpperCase()}</span>
                      </ThemeProvider>
                    </div>
                    <br />
                    <div className="Trainings__Modal__Date__Head">
                      Training Audience
                    </div>
                    <div>
                      <ThemeProvider theme={orangeTheme}>
                        <Select
                          id="demo-simple-select"
                          defaultValue="public"
                          value={modalObject.openTo}
                          label="Training Audience"
                          sx={{ width: "200px" }}
                          onChange={(e) => {
                            handleModalObjectChange("openTo", e.target.value);
                          }}
                        >
                          <MenuItem value={"internal"}>Internal</MenuItem>
                          <MenuItem value={"external"}>External</MenuItem>
                          <MenuItem value={"public"}>Both</MenuItem>
                        </Select>
                      </ThemeProvider>
                    </div>
                  </div>
                </div>
              </div>
              <div className="Trainings__Modal__Bottom__Button">
                <ThemeProvider theme={orangeTheme}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ margin: "15px 0 5px 0" }}
                    onClick={() => {
                      saveChanges();
                    }}
                  >
                    Save
                  </Button>
                </ThemeProvider>
              </div>
            </LocalizationProvider>
          </div>
        </div>
      </Modal>
      <div className="Trainings">
        <div className="Trainings__Head">
          <span className="Trainings__Head__Text">Trainings</span>
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
              + New Training
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
                    <div className="Trainings__Object">
                      <div
                        className="Trainings__Object__Head"
                        style={item.isDeleted ? { opacity: "0.4" } : null}
                      >
                        {item.name.slice(0, 25)}
                      </div>
                      <div
                        className="Trainings__Object__Text2"
                        style={
                          item.isDeleted
                            ? { minHeight: "120px", opacity: "0.4" }
                            : { minHeight: "120px" }
                        }
                      >
                        {item.description.slice(0, 150)}
                        {item.description.length > 150 ? "..." : ""}
                      </div>
                      <br />
                      <div
                        className="Trainings__Object__Text"
                        style={item.isDeleted ? { opacity: "0.4" } : null}
                      >
                        Location : {item.location.slice(0, 20)}
                      </div>
                      <br />
                      <div
                        className="Trainings__Object__Text"
                        style={item.isDeleted ? { opacity: "0.4" } : null}
                      >
                        Start :{" "}
                        {new Date(item.startDate).toLocaleDateString(
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
                          new Date(item.startDate).toTimeString().slice(0, 8)}
                      </div>
                      <br />
                      <div
                        className="Trainings__Object__Text"
                        style={item.isDeleted ? { opacity: "0.4" } : null}
                      >
                        End :{" "}
                        {new Date(item.endDate).toLocaleDateString(undefined, {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          time: "short",
                        }) +
                          " at " +
                          new Date(item.endDate).toTimeString().slice(0, 8)}
                      </div>
                      <br />
                      <div
                        className="Trainings__Object__Text"
                        style={item.isDeleted ? { opacity: "0.4" } : null}
                      >
                        Mode : {item.eventType.toUpperCase()}
                      </div>
                      <div
                        className="Trainings__Object__Date"
                        style={item.isDeleted ? { opacity: "0.4" } : null}
                      >
                        <div>Capacity : {item.capacity}</div>
                        <div>Slots left : {item.slotsLeft}</div>
                      </div>

                      <ThemeProvider theme={orangeTheme}>
                        <div className="Trainings__Object__ButtonBox">
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
