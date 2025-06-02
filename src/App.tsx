import React from "react";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./Pages/HomePage";
import { FeedPage } from "./Pages/FeedPage";
import { CssBaseline, ThemeOptions } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/lab";
import { DiapersPage } from "./Pages/DiapersPage";
import { LeisurePage } from "./Pages/LeisurePage";
import { Provider } from "react-redux";
import { persistor, store } from "./Store/store";
import { GrowthPage } from "./Pages/GrowthPage";
import { HealthPage } from "./Pages/HealthPage";
import { PhotoPage } from "./Pages/PhotoPage";
import { TakePhotoPage } from "./Pages/TakePhotoPage";
import { ViewPhotoPage } from "./Pages/ViewPhotoPage";
import { SleepPage } from "./Pages/SleepPage";
import { AllLogsPage } from "./Pages/AllLogsPage";
import { StatsTab } from "./Pages/StatsTab";
import { RegisterPage } from "./Pages/RegisterPage";
import { LoginPage } from "./Pages/LoginPage";
import { SettingPage } from "./Pages/SettingPage";
import AuthGuard from "./Components/AuthGuard";
import Layout from "./Components/Layout";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  const themeOptions: ThemeOptions = {
    palette: {
      mode: "dark",
      primary: {
        main: "#6c8ce0",
      },
      secondary: {
        main: "#ed5990",
      },
      success: {
        main: "#59EDA6",
      },
      info: {
        main: "#404f6c",
      },
      error: {
        main: "#ED6B59",
      },
      background: {
        default: "#081228",
        paper: "#081228",
      },
    },
    shape: {
      borderRadius: 10,
    },
  };

  const theme = createTheme(themeOptions);

  return (
    <div
      style={{
        backgroundColor: "black",
        minHeight: "100vh",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ThemeProvider theme={theme}>
              <BrowserRouter>
                <CssBaseline />

                <Routes>
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route
                    element={
                      <AuthGuard>
                        <Layout />
                      </AuthGuard>
                    }
                  >
                    <Route path="/" element={<HomePage />} />
                    <Route path="/feed" element={<FeedPage />} />
                    <Route path="/diapers" element={<DiapersPage />} />
                    <Route path="/leisure" element={<LeisurePage />} />
                    <Route path="/growth" element={<GrowthPage />} />
                    <Route path="/health" element={<HealthPage />} />
                    <Route path="/photo" element={<PhotoPage />} />
                    <Route
                      path="/photo/take-photo/:id"
                      element={<TakePhotoPage />}
                    />
                    <Route
                      path="/photo/view-photo/:id"
                      element={<ViewPhotoPage />}
                    />
                    <Route path="/sleep" element={<SleepPage />} />
                    <Route path="/all-log" element={<AllLogsPage />} />
                    <Route path="/stats" element={<StatsTab />} />
                    <Route path="/setting" element={<SettingPage />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </ThemeProvider>
          </LocalizationProvider>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
