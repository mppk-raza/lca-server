import React from "react";
import "./Step1.css";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useTheme } from "@mui/material/styles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
const orangeTheme = createTheme({
  palette: {
    primary: {
      main: "#00a0ad",
    },
    secondary: {
      main: "#41424C",
    },
  },
});
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const Step1 = ({
  step1Data,
  setStep1Data,
  prerequisites,
  setPrerequisites,
  prereqDropdownData,
}) => {
  const theme = useTheme();
  const step1HandleChange = (e) => {
    let { name, value } = e.target;
    setStep1Data({ ...step1Data, [name]: value });
  };
  const prerequisitesHandleChange = (e) => {
    const {
      target: { value },
    } = e;
    // let obj = JSON.parse(value);

    setPrerequisites(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  return (
    <div className="AddCourse__form__box">
      <form>
        <div className="AddCourse__textfield__container">
          <div className="AddCourse__textfield">
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Name"
              fullWidth
              required
              onKeyPress={(event) => {
                if (/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              name="name"
              value={step1Data.name}
              onChange={step1HandleChange}
            />
          </div>
          <div className="AddCourse__textfield">
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Instructor Name"
              fullWidth
              required
              onKeyPress={(event) => {
                if (/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              name="instructorName"
              value={step1Data.instructorName}
              onChange={step1HandleChange}
            />
          </div>
        </div>
        <div className="AddCourse__textfield__container">
          <div className="AddCourse__textfield watch_time">
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Watch Hours"
              fullWidth
              required
              name="hours"
              type="number"
              value={step1Data.hours}
              onChange={step1HandleChange}
            />
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Watch Minutes"
              fullWidth
              required
              type="number"
              name="minutes"
              value={step1Data.minutes}
              onChange={step1HandleChange}
            />
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Watch Seconds"
              fullWidth
              type="number"
              required
              name="seconds"
              value={step1Data.seconds}
              onChange={step1HandleChange}
            />
          </div>
          <div className="AddCourse__textfield">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={step1Data.type}
                name="type"
                label="Type"
                onChange={step1HandleChange}
              >
                <MenuItem value={"All"}>All</MenuItem>
                <MenuItem value={"TNA"}>TNA</MenuItem>
                <MenuItem value={"SOP"}>SOP</MenuItem>
                <MenuItem value={"Public Orientation"}>
                  Public Orientation
                </MenuItem>
                <MenuItem value={"Others"}>Others</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        {/* <div className='AddCourse__textfield__container'>
          <TextField
            sx={{ marginBottom: '20px' }}
            id='outlined-basic'
            variant='outlined'
            label='Thumbnail/img URL'
            fullWidth
            required
            name='imgUrl'
            value={step1Data.imgUrl}
            onChange={step1HandleChange}
          />
        </div> */}

        <div className="AddCourse__textfield__container">
          <div className="AddCourse__textfield">
            <TextField
              sx={{ marginBottom: "20px" }}
              id="outlined-basic"
              variant="outlined"
              label="Thumbnail/img URL"
              fullWidth
              required
              name="imgUrl"
              value={step1Data.imgUrl}
              onChange={step1HandleChange}
            />
          </div>
          <div className="AddCourse__textfield">
            {/* HERE */}
            <ThemeProvider theme={orangeTheme}>
              <Switch
                checked={step1Data.hasCertificate}
                onChange={() => {
                  setStep1Data({
                    ...step1Data,
                    hasCertificate: !step1Data.hasCertificate,
                  });
                }}
              />
              <span>
                {step1Data.hasCertificate
                  ? "With Certificate"
                  : "No Certificate"}
              </span>
            </ThemeProvider>
          </div>
        </div>
        <div className="AddCourse__textfield__container">
          <TextField
            sx={{ marginBottom: "20px" }}
            id="outlined-multiline-static"
            label="Abstract"
            multiline
            rows={4}
            fullWidth
            required
            name="abstract"
            value={step1Data.abstract}
            onChange={step1HandleChange}
          />
        </div>
        <div className="AddCourse__textfield__container">
          <FormControl sx={{ width: "100%" }}>
            <InputLabel id="demo-multiple-chip-label">Prerequisites</InputLabel>
            <Select
              fullWidth
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={prerequisites}
              onChange={prerequisitesHandleChange}
              input={
                <OutlinedInput
                  id="select-multiple-chip"
                  label="Prerequisites"
                />
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value, ind) => {
                    let temp = JSON.parse(value);
                    return <Chip key={ind} label={temp.courseName} />;
                  })}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {prereqDropdownData?.map((name, ind) => (
                <MenuItem
                  key={ind}
                  // value={name.courseName}
                  value={JSON.stringify({
                    _id: name._id,
                    courseName: name.courseName,
                    courseInstructor: name.courseInstructor,
                  })}
                  style={getStyles(name, prerequisites, theme)}
                >
                  {name.courseName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </form>
    </div>
  );
};

export default Step1;
