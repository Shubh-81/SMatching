import { Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import {Button} from '@mui/material'

const Share = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const handleShare = () => {

  }

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          About
        </Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        SMatching aims to match you to your potential next love by using an algorithm to match you and the people in your choice list. But make sure to share this site
        as there can be a match only when your choice is also using this site. 
      </Typography>
      <Button
              fullWidth
              type="submit"
              onClick={handleShare}
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              Share
        </Button>
    </WidgetWrapper>
  );
};

export default Share;
