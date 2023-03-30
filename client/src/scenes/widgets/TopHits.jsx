import { Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { Box, Divider } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Oval } from 'react-loader-spinner';

const TopHits = () => {
  const { palette } = useTheme();
  const [topTen,setTopTen] = useState(null);
  const dark = palette.neutral.dark;

  const getTopHits = async () => {
    const response = await fetch(`http://localhost:3001/topHits`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    setTopTen(data.topHits);
  };

  useEffect(()=>{
    getTopHits();
  },[])

  if(!topTen) {
    return (
      <WidgetWrapper>
       <Box p="0.1rem 0"></Box>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Users with Top Hits This Week
        </Typography>
        <Oval
          height={25}
          width={25}
          color="#E6FBFF"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel='oval-loading'
          secondaryColor="#001519"
          strokeWidth={2}
          strokeWidthSecondary={2}
        
        />
      </FlexBetween>
    </WidgetWrapper>
    )
  }

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
                            <Typography width="15rem" color={dark} variant="h6">{choice.firstName} {choice.lastName}</Typography>
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
