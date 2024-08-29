import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ExternalUserTable.css";

const ExternalUserTable = ({ users, searchUser }) => {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  let columns = [
    {
      field: "Name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "Occupation",
      headerName: "Occupation",
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
      } else if (obj.name.toLowerCase()?.includes(searchUser?.toLowerCase())) {
        return obj;
      }
    })
    ?.map((cur, key) => {
      return {
        id: cur.userId,
        Name: cur.name,
        Occupation: cur.occupation,
        Trainings_Attended: cur.trainingsAttended,
        CoursesCount: cur.coursesCount,
        CoursesCompletedCount: cur.coursesCompletedCount,
        CompletedHours: cur.completedHours,
        OverallScore: cur.overallScore,
      };
    });

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

export default ExternalUserTable;
