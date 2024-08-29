import React from "react";
import "./Sections.css";
import Collapse from "@mui/material/Collapse";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Sections = ({ sections }) => {
  const [OpenArr, setOpenArr] = React.useState([false]);

  //console.log(sections);
  return (
    <>
      {sections.map((cur, ind) => {
        return (
          <div key={ind} className="section__box">
            <div className="section__box__heading__btn__cont">
              <div className="section__box__heading">{ind+1}.{" "}{cur.sectionTitle}</div>
              <div className="section__box__expand__btn">
                <ExpandMore
                  expand={OpenArr[ind]}
                  onClick={() => {
                    const temp = [...OpenArr];
                    temp[ind] = !OpenArr[ind];
                    setOpenArr(temp);
                  }}
                  aria-expanded={OpenArr[ind]}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </div>
            </div>
            <Collapse in={OpenArr[ind]} timeout="auto" unmountOnExit>
              <div>
                <div className="section__box__abstract__heading">
                  Section Abstract:
                </div>
                <div className="section__box__abstract">
                  {cur.sectionAbstract}
                </div>
                {cur.sectionLessons.map((subCur, subInd) => {
                  return (
                    <div key={subInd} className="section__lesson__box">
                      <div className="section__lesson__box__heading">
                      {ind+1}.{subInd+1}{" "}  Lesson
                      </div>
                      <div className="section__lesson__box__name">
                        Name: {subCur.lessonName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Collapse>
          </div>
        );
      })}
    </>
  );
};

export default Sections;
