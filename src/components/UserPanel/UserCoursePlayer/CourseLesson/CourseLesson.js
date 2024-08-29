import React,{useState} from "react";
import "./CourseLesson.css";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";

const CourseLesson = ({ courseData }) => {
    const [value, setValue] = useState("Abstract");
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
  return (
    <div>
      <Box
        sx={{
          width: "100%",
          typography: "body1",
          margin: "30px 0 0 0",
        }}
      >
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              variant="scrollable"
              TabIndicatorProps={{
                style: { background: "#00a0ad" },
              }}
              sx={{
                "& button.Mui-selected": { color: "#00a0ad" },
              }}
            >
              <Tab label="Abstract" value="Abstract" />
              <Tab label="Instructor" value="Instructor" />
              <Tab label="FAQs" value="Prerequisites" />
            </TabList>
          </Box>

          <TabPanel value="Abstract">
            <div className="">
                        {courseData.courseAbstract}
                      </div>
          </TabPanel>
          <TabPanel value="Instructor">{courseData.courseInstructor}</TabPanel>
          <TabPanel value="Prerequisites">{courseData.courseAbstract}</TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

export default CourseLesson;
