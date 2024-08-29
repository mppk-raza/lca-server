import { Button } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UnderlingCoursesTable.css";

const UnderlingCoursesTable = ({
  underlingCourses,
  searchUnderlingCourses,
  enrollCourseDialog,
}) => {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  let columns = [
    {
      field: "courseThumbnail",
      headerName: "Thumbnail",
      flex: 1,
      renderCell: (params) => (
        <img src={params.value} alt={params.value} className="courses__img" />
      ),
    },
    {
      field: "courseName",
      headerName: "Course Name",
      flex: 1,
    },
    {
      field: "courseInstructor",
      headerName: "Course Instructor",
      flex: 1,
    },
    {
      field: "courseType",
      headerName: "Course Type",
      flex: 1,
    },
    {
      field: "courseAbstract",
      headerName: "Course Abstract",
      flex: 1,
    },
    {
      field: "Action",
      headerName: "Action",
      minWidth: 300,
      renderCell: (course) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={() => enrollCourseDialog(course.row)}
            variant="contained"
            size="small"
            sx={{ m: 1 }}
          >
            Enroll Now
          </Button>
        </div>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  let rows = underlingCourses
    ?.filter((obj) => {
      if (searchUnderlingCourses === "") {
        return obj;
      } else if (
        obj.courseName
          .toLowerCase()
          ?.includes(searchUnderlingCourses?.toLowerCase())
      ) {
        return obj;
      }
    })
    ?.map((cur, key) => {
      return {
        id: cur._id,
        courseThumbnail: cur.courseThumbnail,
        courseName: cur.courseName,
        courseInstructor: cur.courseInstructor,
        courseType: cur.courseType,
        courseAbstract: cur.courseAbstract,
        Action: cur._id,
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
      <div className="UsersTable underlingTable">
        <h3>Available Courses</h3>
        {underlingCourses ? (
          <div style={{ marginTop: "10px", height: "70vh", width: "100%" }}>
            <DataGrid
              getRowId={(row) => row?.id}
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

export default UnderlingCoursesTable;
