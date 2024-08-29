import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbar,
} from "@mui/x-data-grid";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EmployeesTable.css";

const EmployeesTable = ({ users, searchUser }) => {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  let columns = [
    {
      field: "id",
      headerName: "Emp ID",
      flex: 1,
    },
    {
      field: "Name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "Manager",
      headerName: "Manager",
      flex: 1,
    },
    {
      field: "Occupation",
      headerName: "Occupation",
      flex: 1,
    },
    {
      field: "Division",
      headerName: "Division",
      flex: 1,
    },
    {
      field: "Trainings_Attended",
      headerName: "Trainings",
      flex: 1,
    },
    {
      field: "CoursesCount",
      headerName: "Courses",
      flex: 1,
    },
    {
      field: "CoursesCompletedCount",
      headerName: "Completed Courses",
      flex: 1,
    },
    {
      field: "CompletedHours",
      headerName: "Completed Hours",
      flex: 1,
    },
    {
      field: "OverallScore",
      headerName: "Score",
      flex: 1,
    },
  ];

  let rows = users
    ?.filter((obj) => {
      if (searchUser === "") {
        return obj;
      } else if (
        obj.name.toLowerCase()?.includes(searchUser?.toLowerCase()) ||
        obj.empid?.includes(searchUser)
      ) {
        return obj;
      }
    })
    ?.map((cur, key) => {
      return {
        id: cur.empid,
        Name: cur.name,
        Manager: cur.emplinemanagername,
        Occupation: cur.occupation,
        Division: cur.division,
        Trainings_Attended: cur.trainingsAttended,
        CoursesCount: cur.coursesCount,
        CoursesCompletedCount: cur.coursesCompletedCount,
        CompletedHours: cur.completedHours,
        OverallScore: cur.overallScore,
      };
    });

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
      </GridToolbarContainer>
    );
  }

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
      <div className="UsersTable">
        <h3>Employees</h3>
        {users ? (
          <div style={{ marginTop: "10px", height: "70vh", width: "100%" }}>
            <DataGrid
              getRowId={(row) => row?.id + row?.Name}
              rows={rows}
              columns={columns}
              pageSize={rowsPerPage}
              onPageSizeChange={(newSize) => setRowsPerPage(newSize)}
              rowsPerPageOptions={[10, 25, 50]}
              pagination
              disableSelectionOnClick
              components={{ Toolbar: CustomToolbar }}
            />
          </div>
        ) : (
          <div>
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={true}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </div>
        )}
      </div>
    </>
  );
};

export default EmployeesTable;
