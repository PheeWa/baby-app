import React from "react";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { BrowserRouter, Link, Route, Routes } from "react-router-dom"; // <-- this is the error
import { HomePage } from "./Pages/HomePage";
import { FeedPage } from "./Pages/FeedPage";
import { CssBaseline, ThemeOptions } from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/lab";
import { DiapersPage } from "./Pages/DiapersPage";
import { LeisurePage } from "./Pages/LeisurePage";
import { Provider } from "react-redux";
import { store } from "./Store/store";
import { GrowthPage } from "./Pages/GrowthPage";
import { HealthPage } from "./Pages/HealthPage";
import { PhotoPage } from "./Pages/PhotoPage";
import { TakePhotoPage } from "./Pages/TakePhotoPage";
import { ViewPhotoPage } from "./Pages/ViewPhotoPage";
import { SleepPage } from "./Pages/SleepPage";
import { AllLogsPage } from "./Pages/AllLogsPage";
import { StatsTab } from "./Pages/StatsTab";
import { StatsFeeding } from "./Pages/StatsFeeding";
import { StatsSleep } from "./Pages/StatsSleep";

import { initializeApp } from "firebase/app";
import { RegisterPage } from "./Pages/RegisterPage";
import { LoginPage } from "./Pages/LoginPage";
import { SettingPage } from "./Pages/SettingPage";

function App() {
  const themeOptions: ThemeOptions = {
    palette: {
      mode: "light",
      primary: {
        main: "#000000",
      },
      secondary: {
        main: "#ffdfcc",
      },
      background: {
        default: "#f9f5ec",
        paper: "#f3e9e4",
      },
    },
  };

  const theme = createTheme(themeOptions);
  // Import the functions you need from the SDKs you need
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAsIiVmXknLIpaQeDZANZzbOe8GK2wlCkk",
    authDomain: "baby-app-react.firebaseapp.com",
    projectId: "baby-app-react",
    storageBucket: "baby-app-react.appspot.com",
    messagingSenderId: "370335286755",
    appId: "1:370335286755:web:cd42bb31d35bf3f28b0cd6",
    measurementId: "G-5SQV41RYMV",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <CssBaseline />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="feed" element={<FeedPage />} />
              <Route path="diapers" element={<DiapersPage />} />
              <Route path="leisure" element={<LeisurePage />} />
              <Route path="growth" element={<GrowthPage />} />
              <Route path="health" element={<HealthPage />} />
              <Route path="photo" element={<PhotoPage />} />
              <Route path="photo/take-photo/:id" element={<TakePhotoPage />} />
              <Route path="photo/view-photo/:id" element={<ViewPhotoPage />} />
              <Route path="sleep" element={<SleepPage />} />
              <Route path="all-log" element={<AllLogsPage />} />
              <Route path="stats" element={<StatsTab />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="setting" element={<SettingPage />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </LocalizationProvider>
    </Provider>
  );
}

export default App;
