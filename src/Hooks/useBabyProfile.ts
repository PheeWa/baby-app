import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../Firebase/firebaseConfig";

export type BabyProfile = {
    name: string;
    birthDate: string;
    gender?: "male" | "female" | "other";
    photoUrl?: string;
}

export function useBabyProfile(userId: string) {
    return useQuery({
        queryKey: ["babyProfile", userId],
        queryFn: async () => {
            if (!userId) return null;
            const ref = doc(db, "users", userId, "profile", "baby");
            const snap = await getDoc(ref);
            return snap.exists() ? (snap.data() as BabyProfile) : null;
        },
        enabled: !!userId
    });
}

export function useSetBabyProfile(userId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (profile: BabyProfile) => {
            const ref = doc(db, "users", userId, "profile", "baby");
            await setDoc(ref, profile);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["babyProfile", userId] });
        }
    });
}