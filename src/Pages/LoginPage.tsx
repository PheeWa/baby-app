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
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginThunk } from "../Store/authSlice";
import { AppDispatch, RootState } from "../Store/store";
import { useDispatch, useSelector } from "react-redux";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();

  const login = async () => {
    if (email == null || password == null) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const result = await dispatch(loginThunk({ email, password }));
      if (loginThunk.fulfilled.match(result)) {
        navigate("/");
      }
    } catch (error) {
      alert(`Login error: ${error}`);
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
        LOGIN
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
            disabled={loading}
            label="Email"
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
      </Box>
      <Box>
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            login();
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        <Button
          fullWidth
          onClick={() => {
            navigate("/register");
          }}
          disabled={loading}
        >
          REGISTER{" "}
        </Button>
      </Box>
    </Container>
  );
};
