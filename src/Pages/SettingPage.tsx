import { MobileDatePicker } from "@mui/lab";
import { Box, Card, CardContent, TextField, Button } from "@mui/material";
import { Container } from "@mui/system";
import { useState } from "react";
import { Header } from "../Components/Header";

export const SettingPage = () => {
  const [birthday, setBirthday] = useState("");
  const [babyName, setBabyName] = useState("");

  return (
    <Box>
      <Header title="Setting" />
      <Container style={{ marginTop: "16px" }}>
        <Card>
          <CardContent>
            <Box>
              <TextField
                id="standard-basic"
                variant="standard"
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
              onClick={() => {}}
            >
              Save
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
