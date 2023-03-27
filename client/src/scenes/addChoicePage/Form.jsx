import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email"),
  mobileNo: yup.string(),
  insta_id: yup.string(),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNo: "",
  insta_id: "",
};


const Form = () => {
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [loading,setIsLoading] = useState(false);
  const {_id} = useSelector((state)=>state.user);
  const userId = _id;
  const navigate = useNavigate();

  const handleFormSubmit = async (values, onSubmitProps) => {
    setIsLoading(true);
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    if(!values.mobileNo) formData.append("mobileNo", "");
    if(!values.insta_id) formData.append("insta_id", "");
    if(!values.email) formData.append("email", "");
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}/addchoices`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const res = await response.json()
      if(!res.message) {
        navigate('/home')
      } else {
        setIsLoading(false)
        alert("Something Went Wrong Please Try Again")
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
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
              {loading?"Loading....":"ADD CHOICE"}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
    </>
  );
};

export default Form;