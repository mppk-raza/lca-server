import React, { useState, useEffect } from "react";
import "./AddCourseTable.css";
import axios from "axios";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Box from "@mui/material/Box";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import FormControlLabel from "@mui/material/FormControlLabel";

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
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "50px",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "27ch",
      "&:focus": {
        width: "35ch",
      },
    },
  },
}));
const AddCourseTable = ({ employeeList, setEmployeeList, forEmployees }) => {
  const [loading, setLoading] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState("All");
  const [refresh, setRefresh] = React.useState(null);
  const [users, setUsers] = useState();
  const [searchUser, setSearchUser] = useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [viewData, setViewData] = React.useState({
    id: "",
    Action: "",
    Email: "",
    Name: "",
    Occupation: "",
    Organization: "",
    Status: "",
    dateCreated: "",
    users: null,
  });

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
  };

  const handleClose = () => setOpen(false);
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
  const getAllUsers = () => {
    setLoading(true);
    axios
      .post(process.env.REACT_APP_BACKEND_URL + "/api/users/getAllUsers", {
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        //console.log(res);

        let temp = res.data.data;
        if (radioValue === "All") {
          setUsers(temp);
        } else if (radioValue === "Internal") {
          const found = temp.filter((obj) => {
            return obj.isEmployee.isTrue === true;
          });
          setUsers(found);
        } else if (radioValue === "External") {
          const found = temp.filter((obj) => {
            return obj.isEmployee.isTrue === false;
          });
          setUsers(found);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  useEffect(() => {
    getAllUsers();
  }, [refresh]);

  const viewUser = (userData) => {
    setOpen(true);
    //console.log(userData);
    setViewData({
      id: userData.row.id,
      Status: userData.row.Status,
      Email: userData.row.Email,
      Name: userData.row.Name,
      Occupation: userData.row.Occupation,
      Organization: userData.row.Organization,
      Status: userData.row.Status,
      dateCreated: userData.row.dateCreated,
      users: null,
    });
  };

  let columns = [];
  {
    windowDimensions.width >= 750
      ? (columns = [
          {
            field: "Name",
            headerName: "Name",
            minWidth: 140,
          },
          {
            field: "Email",
            headerName: "Email",
            flex: 1,
          },
          {
            field: "Organization",
            headerName: "Organization",
            flex: 1,
          },
          {
            field: "Occupation",
            headerName: "Occupation",
            flex: 1,
          },
          {
            field: "users",
            headerName: "Employee?",
            minWidth: 5,
            renderCell: (users) =>
              users.row.users === true ? (
                <div className="users__icon__green">
                  <DoneIcon sx={{ color: "white" }} />
                </div>
              ) : (
                <div className="users__icon__red">
                  <CloseIcon sx={{ color: "white" }} />
                </div>
              ),
          },

          {
            field: "Status",
            headerName: "Status",
            flex: 1,
          },
          {
            field: "Action",
            headerName: "Action",
            minWidth: 100,
            renderCell: (user) => (
              <>
                <Button
                  onClick={() => viewUser(user)}
                  variant="contained"
                  size="small"
                  sx={{ m: 1 }}
                >
                  View
                </Button>
              </>
            ),
            sortable: false,
            filterable: false,
          },
        ])
      : (columns = [
          {
            field: "Name",
            headerName: "Name",
            flex: 1,
            minWidth: 150,
          },
          {
            field: "Email",
            headerName: "Email",
            flex: 1,
            minWidth: 150,
          },
          {
            field: "Type",
            headerName: "Type",
            flex: 1,
            minWidth: 100,
          },
          {
            field: "Organization",
            headerName: "Organization",
            flex: 1,
            minWidth: 140,
          },

          {
            field: "Occupation",
            headerName: "Occupation",
            flex: 1,
            minWidth: 100,
          },
          {
            field: "users",
            headerName: "Employee?",
            flex: 1,
            minWidth: 90,
            renderCell: (users) =>
              users.row.users === true ? (
                <div className="users__icon__green">
                  <DoneIcon sx={{ color: "white" }} />
                </div>
              ) : (
                <div className="users__icon__red">
                  <CloseIcon sx={{ color: "white" }} />
                </div>
              ),
          },

          {
            field: "Status",
            headerName: "Status",
            flex: 1,
            minWidth: 90,
          },
          {
            field: "Action",
            headerName: "Action",
            minWidth: 180,
            renderCell: (user) => (
              <>
                <Button
                  onClick={() => viewUser(user)}
                  variant="contained"
                  size="small"
                  sx={{ m: 1 }}
                >
                  View
                </Button>
              </>
            ),
            sortable: false,
            filterable: false,
          },
        ]);
  }
  //console.log(employeeList);
  let rows = [];
  {
    rows = users
      ?.filter((obj) => {
        if (searchUser === "") {
          return obj;
        } else if (obj.name.toLowerCase().includes(searchUser?.toLowerCase())) {
          return obj;
        }
      })
      .map((cur, key) => {
        // console.log(cur.name + " : " + cur.isEmployee.employeeID)
        return {
          id: cur._id,
          Location: cur.jobCity,
          Name: cur.name,
          Email: cur.email,
          Organization: cur.organization,
          Occupation: cur.occupation,
          users: cur.isEmployee.isTrue,
          Status: cur.status,
          employeeID: cur.isEmployee.employeeID,
          dateCreated: cur.dateCreated,
        };
      });
  }
  // console.log(employeeList);
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
      {forEmployees ? (
        <div className="UsersTable">
          <h3 style={{ textAlign: "center" }}>Users</h3>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar
              position="static"
              sx={{
                bgcolor: "#41424C",
                borderRadius: "60px",
                margin: "10px auto",
                width: "85%",
                color: "white",
                padding: 0,
              }}
            >
              <Toolbar
                disableGutters
                sx={{ justifyContent: "space-between", padding: "0 4px" }}
              >
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                  />
                </Search>
                <Box
                  sx={{
                    minWidth: 120,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                ></Box>

                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={radioValue}
                  onChange={handleRadioChange}
                  onClick={() => setRefresh(!refresh)}
                >
                  <FormControlLabel
                    label="All"
                    value="All"
                    control={
                      <Radio
                        sx={{
                          "&, &.Mui-checked": {
                            color: "white",
                          },
                        }}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Employees"
                    value="Internal"
                    control={
                      <Radio
                        sx={{
                          "&, &.Mui-checked": {
                            color: "white",
                          },
                        }}
                      />
                    }
                  />
                  <FormControlLabel
                    label="External"
                    value="External"
                    control={
                      <Radio
                        sx={{
                          "&, &.Mui-checked": {
                            color: "white",
                          },
                        }}
                      />
                    }
                  />
                </RadioGroup>
              </Toolbar>
            </AppBar>
          </Box>
          {users ? (
            <>
              <div
                style={{ margin: "10px auto", height: "70vh", width: "85%" }}
              >
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={rowsPerPage}
                  onPageSizeChange={(newSize) => setRowsPerPage(newSize)}
                  rowsPerPageOptions={[10, 25, 50]}
                  pagination
                  disableSelectionOnClick
                  keepNonExistentRowsSelected={true}
                  checkboxSelection
                  selectionModel={employeeList?.map((cur) => {
                    return cur._id;
                  })}
                  onSelectionModelChange={(ids) => {
                    const selectedIDs = new Set(ids);
                    const selectedRowData = users.filter((row) =>
                      selectedIDs.has(row._id)
                    );
                    let temp = selectedRowData?.map((cur) => {
                      return { _id: cur._id, employeeID: cur.isEmployee.employeeID };
                    });
                    setEmployeeList(temp);
                  }}
                />
              </div>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style} className="viewUser__modal">
                  <div className="viewUser__modal__heading">User Details</div>
                  <div className="user__details__box">
                    <div className="user__detail">
                      <div className="user__detail__title">Name: </div>
                      <div className="user__detail__text">{viewData.Name}</div>
                    </div>
                    <div className="user__detail">
                      <div className="user__detail__title">Email:</div>
                      <div className="user__detail__text">{viewData.Email}</div>
                    </div>
                    <div className="user__detail">
                      <div className="user__detail__title">Occupation:</div>
                      <div className="user__detail__text">
                        {viewData.Occupation}
                      </div>
                    </div>

                    <div className="user__detail">
                      <div className="user__detail__title">Organization: </div>
                      <div className="user__detail__text">
                        {viewData.Organization}
                      </div>
                    </div>
                    <div className="user__detail">
                      <div className="user__detail__title">Status: </div>
                      <div className="user__detail__text">
                        {viewData.Status}
                      </div>
                    </div>
                    <div className="user__detail">
                      <div className="user__detail__title">dateCreated: </div>
                      <div className="user__detail__text">
                        {viewData.dateCreated}
                      </div>
                    </div>
                  </div>
                </Box>
              </Modal>
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            </>
          ) : (
            <div>
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={true}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default AddCourseTable;
