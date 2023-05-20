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

const otpSchema = yup.object().shape({
  otp: yup.string().required("required")
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

const initialValuesOTP = {
  otp: ""
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
  const [registerButtonMessage,setRegisterButtonMessage] = useState("");
  const [otp,setOTP] = useState("");
  const [userId,setUserId] = useState("");
  const [incorrectOTP,setIncorrectOTP] = useState(false);

  const register = async (values, onSubmitProps) => {
    if(!valid) {
      setIsLoading(false);
      registerButtonMessage("Invalid Password");
      return;
    }
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
      "https://smatching.onrender.com/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const res = await savedUserResponse.json();
    console.log(res);
    if(res._id) {
        setUserId(res._id);
        console.log(userId);
        const checkOtp = await fetch(
          "https://smatching.onrender.com/auth/otpverify",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values)
          }
        );
        const res2 = await checkOtp.json();
        console.log(res2.otp);
        setOTP(res2.otp);
        onSubmitProps.resetForm();
        if (savedUserResponse.status==200) {
          setIsLoading(false);
          setPageType("login");
        } 
        else {
          setIsLoading(false);
          setRegisterButtonMessage(res.message);
        }
    } else {
          setIsLoading(false);
          setRegisterButtonMessage("User with one of unique entries already exsists");
    }
  };

  const login = async (values, onSubmitProps) => {
    setIsLoading(true);
    const loggedInResponse = await fetch("https://smatching.onrender.com/auth/login", {
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

  const verifyUser = async () => {
    try {
      const response = await fetch(
        `https://smatching.onrender.com/auth/${userId}/verifyUser`,{
          method: "POST",
        }
      );
      const res = await response.json();
      console.log(res);
      if(res) {
        setPageType("login");
        setOTP("")
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin)  login(values, onSubmitProps);
    else register(values, onSubmitProps);
  };

  const handleOTPSubmit = async (values, onSubmitProps) => {
    if(Number(values.otp)==Number(otp)) {
      verifyUser();
    } else {
      setIncorrectOTP(true);
    }
  }

  if(otp) {
    return (
      <>
      <Formik
        onSubmit={handleOTPSubmit}
        initialValues={initialValuesOTP}
        validationSchema={otpSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
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
                label="OTP"
                type="text"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.otp}
                name="otp"
                error={Boolean(touched.otp) && Boolean(errors.otp)}
                helperText={touched.otp && errors.otp}
                sx={{ gridColumn: "span 4" }}
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
                  {incorrectOTP?"INCORRECT OTP":"ENTER OTP"}
                </Button>
                <Typography
                onClick={() => {
                  setPageType("register");
                  setOTP("");
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
                Wrong Email? Try Again.
              </Typography>
            </Box>
          </form>
        )}
      </Formik>
      </>
    );
  }

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
              {loading?"Loading....":isLogin ? "LOGIN" : registerButtonMessage?registerButtonMessage:"REGISTER"}
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
            {isLogin&&<Typography
              onClick={() => navigate(`/reset`)}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              Forgot Password.
            </Typography>}
          </Box>
        </form>
      )}
    </Formik>
    </>
  );
};

export default Form;