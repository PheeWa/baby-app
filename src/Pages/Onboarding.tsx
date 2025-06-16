import React, { useState } from "react";
import { Box, Button, Container, Paper, TextField, Typography, Checkbox, FormControlLabel, Link } from "@mui/material";
import { useSetBabyProfile } from "../Hooks/useBabyProfile";
import { useSelector } from "react-redux";
import { RootState } from "../Store/store";


export const OnBoarding = () => {
    const userId = useSelector((state: RootState) => state.auth.user?.userId || "");
    const setProfile = useSetBabyProfile(userId);

    const [form, setForm] = useState({
        name: "",
        birthDate: "",
        photoUrl: ""
    });
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await setProfile.mutateAsync({
            name: form.name,
            birthDate: form.birthDate,
            photoUrl: form.photoUrl,
        });
        window.location.href = "/";
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
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }} gutterBottom>
                        Welcome to BumpJourney!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Track your baby's growth, sleep, feeding, and more. All in one place.
                    </Typography>
                </Box>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Baby's Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Birth Date"
                        name="birthDate"
                        type="date"
                        value={form.birthDate}
                        onChange={handleChange}
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />
                    {/* TODO: add real terms and conditions and privacy policy */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={acceptedTerms}
                                onChange={e => setAcceptedTerms(e.target.checked)}
                                name="terms"
                                color="primary"
                            />
                        }
                        label={<span>I agree to the <Link href="#" target="_blank">Terms & Conditions</Link> and <Link href="#" target="_blank">Privacy Policy</Link></span>}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={setProfile.isPending || !acceptedTerms}
                        sx={{ py: 1.5, borderRadius: 2, fontWeight: 600, textTransform: "none", fontSize: "1rem" }}
                    >
                        {setProfile.isPending ? "Saving..." : "Get Started"}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};