import { MobileDatePicker } from "@mui/lab";
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { Container } from "@mui/system";
import React, { useState } from "react";
import { Header } from "../Components/Header";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const SettingPage = () => {
  let navigate = useNavigate();
  const [birthday, setBirthday] = useState("");
  const [babyName, setBabyName] = useState("");
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

  const updateUser = async () => {
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    const d = doc(firestore, `users/${auth.currentUser?.uid}`);
    try {
      await setDoc(
        d,
        {
          babyName,
          birthday,
        },
        { merge: true }
      );

      navigate("/");
    } catch (error) {
      alert("Error");
    }
  };

  return (
    <Box>
      <Header title="Setting" />
      <Container style={{ marginTop: "16px" }}>
        <Card
        //   onClick={props.open}
        >
          <CardContent>
            <Box>
              <TextField
                id="standard-basic"
                variant="standard"
                // fullWidth
                label="Baby name"
                value={babyName}
                onChange={(e) => {
                  setBabyName(e.target.value);
                }}
              />

              <MobileDatePicker
                label="Birthday"
                value={birthday}
                onChange={(newValue) => {
                  setBirthday(newValue as string);
                }}
                renderInput={(params) => (
                  <TextField variant="standard" {...params} error={false} />
                )}
              />
            </Box>
            <Button
              variant="outlined"
              fullWidth
              style={{ marginTop: "16px" }}
              onClick={() => {
                updateUser();
              }}
            >
              Save
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
