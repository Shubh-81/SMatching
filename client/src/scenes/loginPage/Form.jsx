import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import PasswordChecklist from "react-password-checklist"

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  picture: yup.string(),
  mobileNo: yup.string(),
  insta_id: yup.string(),
  commited: yup.bool(),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  picture: "",
  mobileNo: "",
  insta_id: "",
  commited: true
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const [invalidCrendentials,setInvalidCredentials] = useState(false);
  const [loading,setIsLoading] = useState(false);
  const [valid,setValid] = useState(false);

  const register = async (values, onSubmitProps) => {
    if(!valid) {
      setIsLoading(false);
      alert("Invalid Password");
      return;
    }

    // this allows us to send form info with image
    setIsLoading(true);
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value].trim());
    }
    if(values.picture) {
        formData.append("picturePath", values.picture);
    }
    if(!values.picture) formData.append("picturePath", "");
    if(!values.mobileNo) formData.append("mobileNo", "");
    if(!values.insta_id) formData.append("insta_id", "");
    
    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    onSubmitProps.resetForm();
    const res = await savedUserResponse.json();
    if (savedUserResponse.status==200) {
      setIsLoading(false);
      setPageType("login");
    } 
    else {
      setIsLoading(false);
      alert(res.message);
    }
  };

  const login = async (values, onSubmitProps) => {
    setIsLoading(true);
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn.user) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      setIsLoading(false);
      navigate("/home");
    } else {
        setIsLoading(false);
        setInvalidCredentials(true);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin)  login(values, onSubmitProps);
    else register(values, onSubmitProps);
  };

  return (
    <>
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
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
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Instagram Id"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.insta_id}
                  name="insta_id"
                  error={Boolean(touched.insta_id) && Boolean(errors.insta_id)}
                  helperText={touched.insta_id && errors.insta_id}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Mobile Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.mobileNo}
                  name="mobileNo"
                  error={
                    Boolean(touched.mobileNo) && Boolean(errors.mobileNo)
                  }
                  helperText={touched.mobileNo && errors.mobileNo}
                  sx={{ gridColumn: "span 4" }}
                />
                {/* <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box> */}
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
            {!isLogin&&<PasswordChecklist
				    rules={["minLength","number","capital"]}
				    minLength={5}
            style={{width: "30rem"}}
            iconSize={10}
				    value={values.password}
				    onChange={(isValid) => {setValid(isValid)}}
			      />}
            
          </Box>

          {/* BUTTONS */}
          <Box>
          {(invalidCrendentials&&isLogin)?<Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: "red",
                color: "black",
                "&:hover": { color: palette.primary.main },
              }}
            >
              {loading?"Loading....":isLogin ? "INVALID CRENDENTIALS" : "REGISTER"}
            </Button>:<Button
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
              {loading?"Loading....":isLogin ? "LOGIN" : "REGISTER"}
            </Button>}
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                setInvalidCredentials(false);
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
            
            
          </Box>
        </form>
      )}
    </Formik>
    </>
  );
};

export default Form;