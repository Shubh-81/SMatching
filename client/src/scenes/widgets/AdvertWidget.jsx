import { Typography, useTheme, Box } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector } from "react-redux";


const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const user = useSelector((state)=>state.user);
  
  return (
    <WidgetWrapper>
      <FlexBetween>
        
        <Box flexBasis={"50%"}>
        <Typography color={dark} variant="h4" fontWeight="500"> Number of Hits</Typography>
        </Box>
        <Box flexBasis={  "16%"}>
            <Typography  color={dark} variant="h4">{user.numberOfHits}</Typography>
        </Box> 
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        The number of people who have included you in their list. (Number of people who like you)
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
