import { Button } from "@mui/material";
import axios from "axios";
import React,{useState} from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "./Updates.css"
import { toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import validator from "validator";
import Switch from '@mui/material/Switch';

const orangeTheme = createTheme({
    palette: { primary: { main: '#00a0ad', }, secondary: { main: '#41424C', }, },
});

export default function Updates() {
    const [data, setData] = React.useState(null);
    const [openModal, setOpenModal] = React.useState(false);
    const [modalType, setModalType] = React.useState("New");
    const [filter, setFilter] = useState("All");
    const [modalObject, setModalObject] = React.useState({
        date: Date.now(),
        heading: "",
        text: "",
        imageLink: "",
        type: "work",
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
            date: item.date.slice(0, 10),
            heading: item.heading,
            text: item.text,
            imageLink: item.imageLink,
            type: item.type,
            _id: item._id,
        });
    }
    function newModal() {
        setOpenModal(true);
        setModalType("New");
        setModalObject({
            date: Date.now(),
            heading: "",
            text: "",
            imageLink: "",
            type: "work",
            _id: null,
        });
    }
    function closeModal() {
        setOpenModal(false);
        setModalType("New");
        setModalObject({
            date: Date.now(),
            heading: "",
            text: "",
            imageLink: "",
            type: "work",
            _id: null,
        });
    }

    function saveChanges() {
        if (!loading) {
            if (modalObject.heading === "" || modalObject.text === "" || modalObject.imageLink === "") {
                toast.warn("Please input all the data required");
            } else if (!validator.isURL(modalObject.imageLink)) {
                toast.warn("Please enter a valid url link of an image");
            } else if (!validator.isDate(modalObject.date)) {
                 
                toast.warn("The date format is not recognizable. Please re-select date from calendar");
            } else {
                let API_Link = ""
                if (modalType === "Edit") {
                    API_Link = process.env.REACT_APP_BACKEND_URL + "/api/updates/editUpdate"
                } else {
                    API_Link = process.env.REACT_APP_BACKEND_URL + "/api/updates/addUpdate"
                }
                let API_Object = {
                    _id: modalObject._id,
                    date: modalObject.date,
                    heading: modalObject.heading,
                    text: modalObject.text,
                    imageLink: modalObject.imageLink,
                    type: modalObject.type,
                    token: localStorage.getItem("token")
                }

                setLoading(true)
                axios.post(API_Link, API_Object).then((res) => {
                    setLoading(false)
                    if (res.data.error) {
                        toast.warn(res.data.message);
                    } else {
                        toast.success(res.data.message);
                        closeModal();
                        setrefresh(!refresh)
                    }
                })
                    .catch((err) => {
                        setLoading(false)
                        console.log(err)
                        toast.warn("An unexpected error occurred. Please try again.");
                    });
            }
        } else {
            toast.info("Please wait while your previous pending process is completed.")
        }
    }

    function handleModalObjectChange(name, newValue) {
        setModalObject({ ...modalObject, [name]: newValue })
    }

    function APICall(link, body) {
        if (!loading) {
            console.log(body);
            setLoading(true)
            // axios.post("http://localhost:7000" + "/api/updates" + link, body)
            axios.post(process.env.REACT_APP_BACKEND_URL + "/api/updates" + link, body)
                .then((res) => {
                    setLoading(false)
                    if (res.data.error) {
                        toast.warn(res.data.message);
                    } else {
                        toast.success(res.data.message);
                        setrefresh(!refresh)
                    }
                })
                .catch((err) => {
                    setLoading(false)
                    console.log(err)
                    toast.warn("An unexpected error occurred. Please try again.");
                });
        } else {
            toast.info("Please wait while your previous pending process is completed.")
        }
    }

    React.useEffect(() => {
        setLoading(true);
        axios.get(process.env.REACT_APP_BACKEND_URL + "/api/updates/getUpdates")
            .then((res) => {
                setLoading(false);
                if (!res.data.error) {
                    setData(res.data.data)
                }
            })
            .catch((err) => {
                setLoading(false);
                toast.warn("An unexpected error while fetching updates. Please try again")
                console.log(err);
            });
    }, [refresh]);

    return (
        <>
            {loading
                ? <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                : null
            }
            <Modal
                sx={{ display: "flex", alignItems: "center" }}
                open={openModal}
                onClose={() => { setOpenModal(false) }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="Updates__Modal">
                    {loading
                        ? <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                            <CircularProgress color="inherit" />
                        </Backdrop>
                        : null
                    }
                    <div className="Updates__Modal__Head">
                        {modalType} Event
                    </div>
                    <br />
                    <TextField fullWidth id="outlined-basic" variant="outlined" label="Heading" required name="heading" value={modalObject.heading} onChange={(e) => { handleModalObjectChange("heading", e.target.value) }} />
                    <br /><br />
                    <TextField fullWidth id="outlined-basic" variant="outlined" label="Text" required name="text" value={modalObject.text} onChange={(e) => { handleModalObjectChange("text", e.target.value) }} />
                    <br /><br />
                    <TextField fullWidth id="outlined-basic" variant="outlined" label="Image Link" required name="imageLink" value={modalObject.imageLink} onChange={(e) => { handleModalObjectChange("imageLink", e.target.value) }} />
                    <br /><br />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <div className="Updates__Modal__Bottom">
                            <div className="Updates__Modal__Bottom__Left">
                                <div>
                                    <div className="Updates__Modal__Date__Head">Date of Event</div>
                                    <DesktopDatePicker
                                        className="Updates__Modal__Date__Picker"
                                        inputFormat="dd/MM/yyyy"
                                        value={modalObject.date}
                                        onChange={(e) => { handleModalObjectChange("date", e) }}
                                        renderInput={(params) => <TextField {...params} />}
                                        disableHighlightToday={true}
                                        showDaysOutsideCurrentMonth={true}
                                    />
                                </div>
                                <div className="Updates__Modal__Bottom__Left__Type">
                                    <div className="Updates__Modal__Date__Head">Type of Event</div>
                                    <div className="Updates__Modal__Bottom__Left__Type__Content">
                                        <ThemeProvider theme={orangeTheme}>
                                            <Switch
                                                checked={(modalObject.type.toLowerCase() === "work") ? true : false}
                                                onChange={() => {
                                                    if (modalObject.type.toLowerCase() === "work") {
                                                        handleModalObjectChange("type", "education")
                                                    } else {
                                                        handleModalObjectChange("type", "work")
                                                    }
                                                }}
                                            />
                                            <span>{modalObject.type.toUpperCase()}</span>
                                        </ThemeProvider>
                                    </div>
                                </div>
                            </div>
                            <ThemeProvider theme={orangeTheme}>
                                <Button variant="contained" onClick={() => { saveChanges() }}>Save</Button>
                            </ThemeProvider>
                        </div>
                    </LocalizationProvider>
                </div>
            </Modal>
            <div className="Updates">
                <div className="Updates__Head">
                    <span className="Updates__Head__Text">Updates</span>
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
                        <Button variant="contained" onClick={() => { newModal() }}> + New Event</Button>
                    </ThemeProvider>
                </div>
                {(data)
                    ? (data.length > 0)
                        ? data?.filter((obj=>{
                            if(filter==="All"){
                                return obj
                            }else if (filter==="Activated"){
                                return obj.isDeleted ===false
                            }else if (filter==="Hidden"){
                                return obj.isDeleted ===true
                            }else return obj
                        
                        })).map((item) => {
                            return (
                                <div className="Updates__Object">
                                    <img src={item.imageLink} style={(item.isDeleted) ? { opacity: "0.4" } : null} className="Updates__Object__Image" />
                                    <div className="Updates__Object__Head" style={(item.isDeleted) ? { opacity: "0.4" } : null}>{item.heading.slice(0, 60)}</div>
                                    <div className="Updates__Object__Text" style={(item.isDeleted) ? { opacity: "0.4" } : null}>{item.text.slice(0, 140)}{(item.text.length > 150) ? "..." : ""}</div>
                                    <div className="Updates__Object__Date" style={(item.isDeleted) ? { opacity: "0.4" } : null}>
                                        <div>{item.type.toUpperCase()}</div>
                                        <div>{item.date.slice(0, 10)}</div>
                                    </div>
                                    <ThemeProvider theme={orangeTheme}>
                                        <div className="Updates__Object__ButtonBox">
                                            {(item.isDeleted)
                                                ? <Button variant="contained" onClick={() => { APICall("/retrieve", { ID: item._id, token: localStorage.getItem("token") }) }}>Retrieve</Button>
                                                : <Button variant="contained" onClick={() => { APICall("/delete", { ID: item._id, token: localStorage.getItem("token") }) }}>Delete</Button>
                                            }
                                            <Button variant="contained" onClick={() => { editModal(item) }}>Edit</Button>
                                        </div>
                                    </ThemeProvider>
                                    <br />
                                </div>
                            )
                        })
                        : "No data found"
                    : "Loading"}
            </div>
        </>)
} 