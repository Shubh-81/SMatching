import { Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { Box, Divider } from "@mui/material";


const TopHits = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const [topTen,setTopTen] = useState([
    {
        name: "Shubh Agarwal",
        numberOfHits: 500
    },
    {
        name: "Manav Parmar",
        numberOfHits: 50
    },
    {
        name: "Dhawal Kabra",
        numberOfHits: 5
    },
    {
        name: "Divyanshu Pandey",
        numberOfHits: 1
    }
    ]);

  return (
    <WidgetWrapper>
       <Box p="0.1rem 0"></Box>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Users with Top Hits This Week
        </Typography>
      </FlexBetween>
      <Box p="0.7rem 0"></Box>
      <Divider/>
      {
            topTen.map((choice)=>{
                return (
                    <>
                    <Box p="1rem 0">
                        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                        <Box flexBasis={  "40%"}>
                            <Typography width="15rem" color={dark} variant="h6">{choice.name}</Typography>
                        </Box>
                        <Box flexBasis={  "16%"}>
                            <Typography  color={dark} variant="h6">{choice.numberOfHits}</Typography>
                        </Box>      
                        </Box>
                    </Box>
                    <Divider />
                </>
                )
            })
        }
    </WidgetWrapper>
  );
};

export default TopHits;
