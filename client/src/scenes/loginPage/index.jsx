import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import {
  IconButton,
} from "@mui/material";
import {
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setMode } from "../../state";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const dispatch = useDispatch();
  const dark = theme.palette.neutral.dark;
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          SMatching
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
        </Typography>
        
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Find your Match!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;