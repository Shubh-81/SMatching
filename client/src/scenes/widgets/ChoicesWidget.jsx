  import { Box, Typography, Divider,TextField,  useMediaQuery, useTheme } from "@mui/material";
  import FlexBetween from "../../components/FlexBetween";
  import WidgetWrapper from "../../components/WidgetWrapper";
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import {Button} from '@mui/material'
  import EditIcon from '@mui/icons-material/Edit';
  import { Formik } from "formik";
  import * as yup from "yup";

const registerSchema = yup.object().shape({
  title: yup.string().required("required"),
  description: yup.string().required("required"),
});

const initialValuesRegister = {
  title: "",
  description: ""
};
  
  const UserWidget = ({ userId, picturePath }) => {
    const [choices,setChoices] = useState([])
    const { palette } = useTheme();
    const navigate = useNavigate();
    const dark = palette.neutral.dark;
    const light = palette.neutral.main;
    const [edit,setEdit] = useState(false);
    const isNonMobile = true;
    const [loading,setLoading] = useState(false);
    const handleFormSubmit = async (values, onSubmitProps) => {
      
    };
    
    const getTask = async () => {
      try {
        const response = await fetch("http://localhost:3001/users/gettasks",
        {
          method: "GET"
        });
        console.log(response)
        const res = await response.json();
        console.log(res);
        setChoices(res);
      } catch(err) {
        console.log(err);
      }
    }
  
    useEffect(() => {
      getTask();
    }, []); 

    const handleChoiceRemoval = async (choiceId) => {
      try {
        const val = {
          taskId: choiceId
        }
        const response = await fetch("http://localhost:3001/users/deletetask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(val)
        });
        const res = await response.json();
        console.log(res);
        getTask();
        
      } catch(err) {
        console.log(err);
      }
    }

    const handleAddChoice = () => {
      navigate('/addtask');
    }

    const handleEditChoice =  () => {
      setEdit(false);
    }



    if(edit) {
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
                  Your Tasks
                </Typography>
              </Box>
              
            </FlexBetween>
          </FlexBetween>
    
          <Divider />
          <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesRegister}
      validationSchema={registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
                <TextField
                  label="Title"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.title}
                  name="title"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  name="description"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
          </Box>
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {loading?"Loading....":"ADD TASK"}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
          {/* {
              choices.map((choice,index)=>{
                  return (
                      <li 
                      style={{listStyleType: "none"}}>
                      <Box p="0.4rem 0">
                          <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                          <FlexBetween>
                          <Typography width="5rem" color={dark} variant="h4">{choice.title}</Typography>
                              <Divider />
                              <Typography width="30rem" color={light} variant="h6">{choice.description}</Typography>
                          </FlexBetween>
                              
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
          } */}
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
                Your Tasks
              </Typography>
                        <Typography width="10rem" color={dark} variant="h4">Title</Typography>
                         <Typography width="30rem" color={light} variant="h4">Description</Typography>
                            

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
                        <Typography width="10rem" color={dark} variant="h4">{choice.title}</Typography>
                         <Typography width="30rem" color={light} variant="h4">{choice.description}</Typography>
                            
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
              Add Task
        </Button>
      </WidgetWrapper>
    );
  };
  
  export default UserWidget;
  