import React from "react";
import "./Step3.css";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "react-toastify/dist/ReactToastify.css";
import AddCourseTable from "../../../../components/Admin/Course/AddCourseTable/AddCourseTable";

const Step3 = ({
  forEmployees,
  setForEmployees,
  forExternals,
  setForExternals,
  employeeList,
  setEmployeeList,
}) => {
    
  return (
    <div>
      <div className="addCourse__forEmployees__external__box">
        <Box sx={{ minWidth: "30%" }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">For Employees</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={forEmployees}
              label="For Employees"
              onChange={(e) => setForEmployees(e.target.value)}
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: "30%" }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">For Externals</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              displayEmpty
              value={forExternals}
              label="For Externals"
              onChange={(e) => setForExternals(e.target.value)}
            >
              <MenuItem value={true}>Yes</MenuItem>
              {forEmployees ? <MenuItem value={false}>No</MenuItem> : null}
            </Select>
          </FormControl>
        </Box>
      </div>
      <AddCourseTable
        employeeList={employeeList}
        setEmployeeList={setEmployeeList}
        forEmployees={forEmployees}
      />
    </div>
  );
};

export default Step3;
