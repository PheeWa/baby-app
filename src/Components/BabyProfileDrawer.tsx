import React from "react";
import {
    Drawer,
    Box,
    Avatar,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import babyIcon from "../Assets/babyIcon.jpeg";
import { BabyProfile } from "../Hooks/useBabyProfile";
import PhotoCameraRounded from "@mui/icons-material/PhotoCameraRounded";
import { useSelector } from "react-redux";
import { RootState } from "../Store/store";

const relationOptions = [
    { value: "mom", label: "Mom" },
    { value: "dad", label: "Dad" },
    { value: "other", label: "Other" },
];

const genderOptions = [
    { value: "male", label: "Boy" },
    { value: "female", label: "Girl" },
    { value: "other", label: "Other" },
];

type BabyProfileForm = Omit<BabyProfile, 'gender'> & { gender?: BabyProfile['gender']; relation?: string };

type BabyProfileDrawerProps = {
    open: boolean;
    onClose: () => void;
    profile: BabyProfile | null | undefined;
    onSave: (data: BabyProfile) => Promise<void>;
};

const BabyProfileDrawer: React.FC<BabyProfileDrawerProps> = ({ open, onClose, profile, onSave }) => {
    const [form, setForm] = React.useState<BabyProfileForm>({
        name: profile?.name || "",
        birthDate: profile?.birthDate || "",
        gender: profile?.gender,
        photoUrl: profile?.photoUrl || "",
        relation: "mom",
    });
    const [photoPreview, setPhotoPreview] = React.useState(profile?.photoUrl || "");
    const [photoFile, setPhotoFile] = React.useState<File | null>(null);
    const [saving, setSaving] = React.useState(false);

    const userId = useSelector((state: RootState) => state.auth.user?.userId || "");

    React.useEffect(() => {
        setForm({
            name: profile?.name || "",
            birthDate: profile?.birthDate || "",
            gender: profile?.gender,
            photoUrl: profile?.photoUrl || "",
            relation: "mom",
        });
        setPhotoPreview(profile?.photoUrl || "");
        setPhotoFile(null);
    }, [profile, open]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenderChange = (e: SelectChangeEvent<BabyProfile["gender"] | "">) => {
        setForm((prev) => ({ ...prev, gender: e.target.value === "" ? undefined : (e.target.value as BabyProfile["gender"]) }));
    };

    const handleRelationChange = (e: SelectChangeEvent<string>) => {
        setForm((prev) => ({ ...prev, relation: e.target.value as string }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        // Save base64 string if a new photo is selected, otherwise use existing photoUrl
        let photoUrl = form.photoUrl;
        if (photoFile) {
            photoUrl = photoPreview;
        }
        await onSave({
            name: form.name,
            birthDate: form.birthDate,
            gender: form.gender,
            photoUrl,
        });
        setSaving(false);
        onClose();
    };

    return (
        <Drawer anchor="left" open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '24px 24px 0 0', p: 3 } }}>
            <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ position: 'relative', mb: 2 }}>
                        <Avatar src={photoPreview || babyIcon} sx={{ width: 96, height: 96, mb: 1 }} />
                        <label htmlFor="baby-photo-upload">
                            <input
                                id="baby-photo-upload"
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handlePhotoChange}
                            />
                            <Button
                                variant="contained"
                                component="span"
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    minWidth: 0,
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <PhotoCameraRounded sx={{ fontSize: 20 }} />
                            </Button>
                        </label>
                    </Box>
                </Box>
                <TextField
                    label="Baby name"
                    name="name"
                    value={form.name}
                    onChange={handleTextChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Birthday"
                    name="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={handleTextChange}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Baby's gender</InputLabel>
                    <Select
                        name="gender"
                        value={form.gender ?? ""}
                        label="Baby's gender"
                        onChange={handleGenderChange}
                    >
                        <MenuItem value="">-</MenuItem>
                        {genderOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>I am</InputLabel>
                    <Select
                        name="relation"
                        value={form.relation}
                        label="I am"
                        onChange={handleRelationChange}
                    >
                        {relationOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    fullWidth
                    disabled={saving}
                    sx={{ py: 1.5, borderRadius: 2, fontWeight: 600, textTransform: "none", fontSize: "1rem" }}
                >
                    {saving ? "Saving..." : "Done"}
                </Button>
            </form>
        </Drawer>
    );
};

export default BabyProfileDrawer;
