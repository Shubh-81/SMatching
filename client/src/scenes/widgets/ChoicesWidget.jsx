  import { Box, Typography, Divider, useTheme } from "@mui/material";
  import FlexBetween from "../../components/FlexBetween";
  import WidgetWrapper from "../../components/WidgetWrapper";
  import { useSelector } from "react-redux";
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import {Button} from '@mui/material'
  import { Oval } from 'react-loader-spinner';
  import EditIcon from '@mui/icons-material/Edit';
  import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
  
  const UserWidget = ({ userId, picturePath }) => {
    const [user, setUser] = useState(null);
    const [choices,setChoices] = useState([])
    const { palette } = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const dark = palette.neutral.dark;
    const [edit,setEdit] = useState(false);
    const [loading,setLoading] = useState(false);
  
    const getUser = async () => {
      const response = await fetch(`https://smatching.onrender.com/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    };

    const getChoices = async () => {
      const response = await fetch(`https://smatching.onrender.com/users/${userId}/choices`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setChoices(data);
    };
  
    useEffect(() => {
      getChoices();
      getUser();
    }, []); 

    const handleChoiceRemoval = async (choiceId) => {
      try {
        const response = await fetch(`https://smatching.onrender.com/users/${userId}/${choiceId}`,{
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        });
        const res = await response.json()
        if(res.userChoices) {
          setChoices(res.userChoices);
        }
      } catch (err) {
        console.log(err);
      }
    }

    const handleAddChoice = () => {
      navigate(`/addchoice/${userId}`)
    }

    const handleDragStart = (event,currentIndex) => {
      event.dataTransfer.setData('currentIndex', currentIndex);
    }

    const handleDragEnter = (event,targetIndex) => {
      event.preventDefault();
      const currentIndex = Number(event.dataTransfer.getData('currentIndex'));
      if (currentIndex !== targetIndex) {
        const newList = [...choices];
        const temp = newList[targetIndex];
        newList[targetIndex] = newList[currentIndex];
        newList[currentIndex] = temp;

        setChoices(newList);
        event.dataTransfer.setData('currentIndex', targetIndex);
      }
    }

    const handleEditChoice = async () => {
      try {
        setLoading(true);
        const formattedChoices = choices.map(({_id})=>{
          return {_id};
      });
        const formatedBody = {updatedChoices: formattedChoices}
        const response = await fetch(`https://smatching.onrender.com/users/${userId}/editchoices`,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formatedBody)
        })
        const r = await response.json();
        setLoading(false);
        setEdit(false);
      } catch (err) {
        console.log(err);
      }
    }

    if (!user) {
      return (
    <WidgetWrapper>
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
          <Oval
            height={80}
            width={80}
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
      </WidgetWrapper>)
    }

    if(edit) {
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
          {
              choices.map((choice,index)=>{
                  return (
                      <li 
                      draggable
                      onDragStart={(event) => handleDragStart(event, index)}
                      onDragEnter={(event) => handleDragEnter(event, index)}
                      style={{listStyleType: "none"}}>
                      <Box p="0.4rem 0">
                          <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                              <DragIndicatorIcon/>
                              <Typography width="30rem" color={dark} variant="h4">{choice.firstName} {choice.lastName}</Typography>
                              <Button
                                  type="submit"
                                  size="small"
                                  onClick={()=>{handleChoiceRemoval(choice._id)}}
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
                  </li>
                  )
              })
          }
          <Button
                fullWidth
                type="submit"
                onClick={handleEditChoice}
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                {loading?"Loading...":"Finish Edit"}
          </Button>
        </WidgetWrapper>
      )
    }

    return (
      <WidgetWrapper>
        {/* FIRST ROW */}
        <FlexBetween
          gap="0.5rem"
          pb="1.1rem"
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
          <EditIcon onClick={()=>{setEdit(true)}}/>
        </FlexBetween>
  
        <Divider />
        {
            choices.map((choice)=>{
                return (
                    <>
                    <Box p="1.5rem 0">
                        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                            <Typography width="30rem" color={dark} variant="h4">{choice.firstName} {choice.lastName}</Typography>
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
  