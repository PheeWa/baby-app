import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  Alert,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearError, loginThunk } from "../Store/authSlice";
import { AppDispatch, RootState } from "../Store/store";
import { useDispatch, useSelector } from "react-redux";
import * as React from "react";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { loading, error: authError } = useSelector(
    (state: RootState) => state.auth
  );
  const [validationError, setValidationError] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const login = async () => {
    setValidationError("");
    if (!email || !password) {
      setValidationError("Please fill in all fields");
      return;
    }
    try {
      const result = await dispatch(loginThunk({ email, password }));
      console.log("result", result);
      if (loginThunk.fulfilled.match(result)) {
        navigate("/");
      }
    } catch (error) {
      console.error(`Login error: ${error}`);
    }
  };

  React.useEffect(() => {
    if (authError) {
      alert(`Login error: ${authError}`);
      dispatch(clearError());
    }
  }, [authError, dispatch]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: 4,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          backgroundColor: "transparent",
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            LOGIN
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Please sign in to your account
          </Typography>
        </Box>

        {/* Form Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="email-input">Email</InputLabel>
            <OutlinedInput
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationError) setValidationError("");
              }}
              disabled={loading}
              label="Email"
              sx={{
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              }}
            />
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="password-input">Password</InputLabel>
            <OutlinedInput
              id="password-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationError) setValidationError("");
              }}
              disabled={loading}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{
                      color: showPassword ? "primary.main" : "text.secondary",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              sx={{
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              }}
            />
          </FormControl>

          {validationError && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 2,
                animation: "fadeIn 0.3s ease-in",
                "@keyframes fadeIn": {
                  from: { opacity: 0, transform: "translateY(-10px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              {validationError}
            </Alert>
          )}
        </Box>

        {/* Button Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={login}
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: 3,
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Button
            fullWidth
            onClick={() => navigate("/register")}
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 500,
              textTransform: "none",
              fontSize: "1rem",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "action.hover",
                transform: "translateY(-1px)",
              },
            }}
          >
            Don't have an account? Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
