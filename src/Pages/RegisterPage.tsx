import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Store/store";
import { registerThunk } from "../Store/authSlice";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const register = async () => {
    if (email == null || password == null || confirmPassword == null) {
      alert("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      alert("Password should be at least 6 characters");
      return;
    }

    try {
      const result = await dispatch(registerThunk({ email, password }));

      if (registerThunk.fulfilled.match(result)) {
        navigate("/login");
      }
    } catch (error) {
      alert(`Registration error: ${error}`);
    }
  };

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh",
        paddingTop: 40,
        paddingBottom: 20,
      }}
    >
      <Typography variant="h5" style={{ fontWeight: 700 }}>
        REGISTER
      </Typography>
      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <FormControl sx={{ mt: 1 }} fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            label="Email"
            disabled={loading}
          />
        </FormControl>

        <FormControl sx={{ mt: 1 }} fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            disabled={loading}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

        <FormControl sx={{ mt: 1 }} fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Confirm password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            disabled={loading}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm password"
          />
        </FormControl>
      </Box>
      <Box>
        <Button variant="contained" fullWidth onClick={register}>
          Sign up
        </Button>
        <Button
          fullWidth
          onClick={() => {
            navigate("/login");
          }}
        >
          Already have an account?
        </Button>
      </Box>
    </Container>
  );
};
