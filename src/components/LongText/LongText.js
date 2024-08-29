import React, { useState } from "react";
import Button from "@mui/material/Button";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const LongText = ({ content, limit }) => {
    const orangeTheme = createTheme({
        palette: {
          primary: {
            main: '#00a0ad',
          },
          secondary: {
            main: '#41424C',
          },
        },
      });
  const [showAll, setShowAll] = useState(false);

  const showMore = () => setShowAll(true);
  const showLess = () => setShowAll(false);

  if (content.length <= limit) {
    // there is nothing more to show
    return <div>{content}</div>;
  }
  if (showAll) {
    // We show the extended text and a link to reduce it
    return (
      <div>
        {content}
        <ThemeProvider theme={orangeTheme}>
        <Button
        
          onClick={showLess}
         sx={{padding:"0"}}
          endIcon={<ExpandLessIcon />}
        >
          Read less
        </Button>
        </ThemeProvider>
      </div>
    );
  }
  // In the final case, we show a text with ellipsis and a `Read more` button
  const toShow = content.substring(0, limit) + "...";
  return (
    <div>
      {toShow}
      <ThemeProvider theme={orangeTheme}>
      <Button
        onClick={showMore}
        sx={{padding:"0"}}
        endIcon={<ExpandMoreIcon />}
      >
        Read more
      </Button>
      </ThemeProvider>
    </div>
  );
};

export default LongText;
