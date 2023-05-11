import {
  ManageAccountsOutlined,
  EditOutlined,
  CallOutlined,
} from "@mui/icons-material";
import InstagramIcon from '@mui/icons-material/Instagram';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Box, Typography, Divider, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  if(picturePath=="") {
    picturePath="profile.jpg"
  }
  const getUser = async () => {
    const response = await fetch(`https://smatching.onrender.com/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }


  const {
    firstName,
    lastName,
    mobileNo,
    email,
    choices,
    insta_id,
    snap_id,
    numberOfHits
  } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          {/* <UserImage image={picturePath} /> */}
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
      {mobileNo!=""&&<Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <CallOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{mobileNo}</Typography>
        </Box>}
        {email!=""&&<Box display="flex" alignItems="center" gap="1rem">
          <MailOutlineIcon fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{email}</Typography>
        </Box>}
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={main}>Number of Hits You Have</Typography>
          <Typography color={main} fontWeight="500">
            {numberOfHits}
          </Typography>
        </FlexBetween>
        <Typography color={medium}>The number of people on whose choice list you are present.</Typography>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>
        {insta_id!=""&&<FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <InstagramIcon fontSize="large" sx={{ color: main }} />
            <Box>
              <Typography color={main} fontWeight="500">
                Instagram
              </Typography>
              <Typography color={medium}>{insta_id}</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>}
        
        {snap_id!=""&&<FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <Box>
              <Typography color={main} fontWeight="500">
                Snap Chat
              </Typography>
              <Typography color={medium}>{snap_id}</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>}
        
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
