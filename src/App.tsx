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
import { FeedStats } from "./Pages/FeedStats";

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
              <Route path="feed-stats" element={<FeedStats />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </LocalizationProvider>
    </Provider>
  );
}

export default App;
