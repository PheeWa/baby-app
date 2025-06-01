import { MobileDatePicker } from "@mui/lab";
import { Box, Card, CardContent, TextField, Button } from "@mui/material";
import { Container } from "@mui/system";
import React, { useState } from "react";
import { Header } from "../Components/Header";

import { useNavigate } from "react-router-dom";

export const SettingPage = () => {
  let navigate = useNavigate();
  const [birthday, setBirthday] = useState("");
  const [babyName, setBabyName] = useState("");

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
                // updateUser();
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
