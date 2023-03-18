import {
    ManageAccountsOutlined,
    EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined,
    CallOutlined,
  } from "@mui/icons-material";
  import InstagramIcon from '@mui/icons-material/Instagram';
  import MailOutlineIcon from '@mui/icons-material/MailOutline';
  import { Box, Typography, Divider, useTheme } from "@mui/material";
  import UserImage from "../../components/UserImage";
  import FlexBetween from "../../components/FlexBetween";
  import WidgetWrapper from "../../components/WidgetWrapper";
  import { useSelector } from "react-redux";
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import {Button} from '@mui/material'
  
  const UserWidget = ({ userId, picturePath }) => {
    const [user, setUser] = useState(null);
    const { palette } = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;
    const dummyData = [
      {
        name: "Allison Brie"
      },
      {
        name: "Alexandra Daddario"
      }
    ];
  
    const getUser = async () => {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      const data = await response.json();
      console.log(data);
      setUser(data);
    };
  
    useEffect(() => {
      getUser();
    }, []); 

    const handleChoiceRemoval = (choiceId) => {

    }

    const handleAddChoice = () => {

    }
  
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
            <Box>
              <Typography
                variant="h2"
                color={dark}
                fontWeight="1000"
                textAlign="center"
              >
                Your Choices
              </Typography>
            </Box>
          </FlexBetween>
        </FlexBetween>
  
        <Divider />
  
        {/* SECOND ROW */}
        {
            dummyData.map((choice)=>{
                return (
                    <>
                    <Box p="0.4rem 0">
                        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                            <Typography width="30rem" color={dark} variant="h4">{choice.name}</Typography>
                            <Button
                                type="submit"
                                size="small"
                                onClick={handleChoiceRemoval(choice.id)}
                                sx={{
                                    m: "0.1rem 0",
                                    p: "1.2rem",
                                    size: "small",
                                    backgroundColor: palette.background.alt,
                                    color: palette.primary.dark,
                                    borderRadius: "50%",
                                    "&:hover": { color: palette.primary.main },
                                }}
                                >---
                            </Button>
                        </Box>
                        
                    </Box>
                    <Divider />
                </>
                )
            })
        }
        <Button
              fullWidth
              type="submit"
              onClick={handleAddChoice}
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              Add Choice
        </Button>

  

      </WidgetWrapper>
    );
  };
  
  export default UserWidget;
  