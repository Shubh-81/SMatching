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


const otpSchema = yup.object().shape({
  email: yup.string().required("required"),
  otp: yup.string()
});


const initialValuesOTP = {
  email: "",
  otp: ""
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [otp,setOTP] = useState("");
  const [userId,setUserId] = useState("");
  const [incorrectOTP,setIncorrectOTP] = useState(false);
  const [loading,setLoading] = useState(false);
  const [errorMessage,setErrorMessage] = useState("");

  const verifyUser = async (values) => {
    try {
        const response2 = await fetch(
            "https://smatching.onrender.com/users/useremail",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            }
        );
        const data = await response2.json();
        if(data._id) {
            setUserId(data._id);
            let ud = data._id;
            const response = await fetch(
                `https://smatching.onrender.com/auth/${ud}/verifyUser`,{
                method: "POST",
                }
            );
            const res = await response.json();
            console.log(res);
            if(res) {
                    setPageType("login");
                    setOTP("")
                }
        } else {
            setErrorMessage("Email Not Registered.");
        }
    }
        catch (err) {
            console.log(err);
        }
        
  }

  const sendOTP = async (values, onSubmitProps) => {
    try {
        const response = await fetch(
            "https://smatching.onrender.com/auth/otpverify",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            }
        );
        const res2 = await response.json();
        console.log(res2.otp);
        setOTP(res2.otp);
    } catch(err) {
        console.log(err)
    }
  }

  const handleOTPSubmit = async (values, onSubmitProps) => {
    if(otp) {
        if(Number(otp)==Number(values.otp)) {
            verifyUser(values);
        } else {
            setIncorrectOTP(true);
        }
    }
    else {
        sendOTP(values);
    }
  }

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
                label="Email"
                type="text"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.otp) && Boolean(errors.otp)}
                helperText={touched.otp && errors.otp}
                sx={{ gridColumn: "span 4" }}
              />
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
                  {otp?(incorrectOTP?"INCORRECT OTP":"ENTER OTP"):("Generate OTP")}
                </Button>
            </Box>
          </form>
        )}
      </Formik>
      </>
    );
};

export default Form;