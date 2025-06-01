import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import {
  VisibilityOff,
  Visibility,
  CheckCircleRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Store/store";
import { clearError, registerThunk } from "../Store/authSlice";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const [open, setOpen] = React.useState(false);
  const { loading, error: authError } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();

  const register = async () => {
    setValidationError("");
    if (!email || !password || !confirmPassword) {
      setValidationError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password should be at least 6 characters");
      return;
    }

    try {
      const result = await dispatch(registerThunk({ email, password }));

      if (registerThunk.fulfilled.match(result)) {
        setOpen(true);
      }
    } catch (error) {
      console.error(`Registration error: ${error}`);
    }
  };

  React.useEffect(() => {
    if (authError) {
      alert(`Registration error: ${authError}`);
      dispatch(clearError());
    }
  }, [authError, dispatch]);

  const handleClose = () => {
    setOpen(false);
    navigate("/login");
  };

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
            REGISTER
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your account to get started
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
              label="Email"
              disabled={loading}
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

          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="confirm-password-input">
              Confirm password
            </InputLabel>
            <OutlinedInput
              id="confirm-password-input"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (validationError) setValidationError("");
              }}
              disabled={loading}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    sx={{
                      color: showConfirmPassword
                        ? "primary.main"
                        : "text.secondary",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm password"
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
            onClick={register}
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
            {loading ? "Creating account..." : "Sign up"}
          </Button>

          <Button
            fullWidth
            onClick={() => navigate("/login")}
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
            Already have an account? Sign in
          </Button>
        </Box>
      </Paper>

      {/* Success Dialog */}
      <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
        <DialogTitle style={{ display: "flex", alignItems: "center" }}>
          <CheckCircleRounded color="secondary" style={{ marginRight: 12 }} />
          {"Congratulations"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {"You have registered successfully!"}
          </DialogContentText>
          <br />
          <DialogContentText>
            {`Please use ${email} to login`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            {"Go to Login"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
