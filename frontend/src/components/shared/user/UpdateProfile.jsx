import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FilledInput from "@mui/material/FilledInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  profileAction,
  updateProfileAction,
} from "../../../redux/slice/userSlice";
import Swal from "sweetalert2";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import Loading from "../../LoadingComp/LoadingComponent";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const handleShowPassword = () => setShowPassword((show) => !show);
  const handleConfirmShowPassword = () =>
    setConfirmShowPassword((show) => !show);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(updateProfileAction(formData));

    if (updateProfileAction.pending.match(response)) {
    }

    if (updateProfileAction.fulfilled.match(response)) {
      await Swal.fire("Good job!", "Profile updated successfully!", "success");

      setFormData({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      dispatch(profileAction());
    }

    if (updateProfileAction.rejected.match(response)) {
      setError(response.payload);
    }
  };

  // console.log(error)

  const { loading } = useSelector((state) => state?.users);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      // minHeight="100vh"
      padding={2}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        maxWidth={350}
        width="100%"
        p={3}
        boxShadow={3}
        borderRadius={2}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Update
        </Typography>

        {/* {error && <Alert severity="error">{error}</Alert>} */}
        {error && <ErrorMsg message={error} />}

        <TextField
          fullWidth
          margin="normal"
          id="fullname"
          name="fullname"
          label="Name"
          variant="filled"
          value={formData.fullname}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email Address"
          type="email"
          variant="filled"
          value={formData.email}
          onChange={handleChange}
        />

        <FormControl variant="filled" fullWidth sx={{ marginTop: "8px" }}>
          <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
          <FilledInput
            name="password"
            onChange={handleChange}
            id="filled-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
                  }
                  onClick={handleShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl variant="filled" fullWidth sx={{ marginTop: "8px" }}>
          <InputLabel htmlFor="filled-adornment-confirm-password">
            Confirm Password
          </InputLabel>
          <FilledInput
            name="confirmPassword"
            onChange={handleChange}
            id="filled-adornment-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showConfirmPassword
                      ? "hide the password"
                      : "display the password"
                  }
                  onClick={handleConfirmShowPassword}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        {loading ? (
          <Button
            fullWidth
            variant="contained"
            className="bg-dark"
            sx={{ mt: 2 }}
          >
            Submiting <Loading />
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default UpdateProfile;
