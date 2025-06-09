import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";



type AuthUser = {
  userId: string;
  email: string | null;
};

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
};

type AuthCredentials = {
  email: string;
  password: string;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const registerThunk = createAsyncThunk<
  AuthUser,
  AuthCredentials,
  { rejectValue: string }
>("auth/register", async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return {
      userId: userCredential.user.uid,
      email: userCredential.user.email,
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const loginThunk = createAsyncThunk<
  AuthUser,
  AuthCredentials,
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return {
      userId: userCredential.user.uid,
      email: userCredential.user.email,
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await signOut(auth);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers(builder) {
    // register
    builder.addCase(registerThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });

    builder.addCase(registerThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Register failed";
    });
    // login
    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Login failed";
    });
    // logout
    builder.addCase(logoutThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
    });
    builder.addCase(logoutThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Logout failed";
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
