import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, Timestamp, DocumentData } from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sleep, CreateSleepInput } from "../Types/sleep";
import { db } from "../Firebase/firebaseConfig";

// Query Keys
export const SLEEP_KEYS = {
    all: ['sleeps'] as const,
    lists: () => [...SLEEP_KEYS.all, 'list'] as const,
    list: (userId: string) => [...SLEEP_KEYS.lists(), userId] as const,
    details: () => [...SLEEP_KEYS.all, 'detail'] as const,
    detail: (userId: string, sleepId: string) => [...SLEEP_KEYS.details(), userId, sleepId] as const,
};

const FIVE_MINUTES = 1000 * 60 * 5;
const THIRTY_MINUTES = 1000 * 60 * 30;


const convertToSleep = (doc: DocumentData): Sleep => {
    const data = doc.data();
    return {
        id: doc.id,
        type: "Sleep",
        details: data.details || '',
        start: data.start.toDate().toISOString(),
        finish: data.finish.toDate().toISOString(),
    };
};

// Hook for fetching all sleeps for a user
export const useSleeps = (userId: string) => {
    return useQuery({
        queryKey: SLEEP_KEYS.list(userId),
        queryFn: async () => {
            try {
                const sleepsRef = collection(db, 'users', userId, 'sleeps');
                const q = query(sleepsRef, orderBy('finish', 'desc'));
                const querySnapshot = await getDocs(q);
                const sleeps = querySnapshot.docs.map(convertToSleep);
                return sleeps;
            } catch (error) {
                console.error("Error fetching sleeps:", error);
                throw new Error("Failed to fetch sleeps");
            }
        },
        staleTime: FIVE_MINUTES,
        gcTime: THIRTY_MINUTES,
        enabled: !!userId,
    });
};

// Hook for adding a new sleep
export const useAddSleep = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newSleep: CreateSleepInput) => {
            const sleepsRef = collection(db, 'users', userId, 'sleeps');

            const sleepData = {
                ...newSleep,
                start: Timestamp.fromDate(new Date(newSleep.start)),
                finish: Timestamp.fromDate(new Date(newSleep.finish)),
            };
            const docRef = await addDoc(sleepsRef, sleepData);
            return { id: docRef.id, ...newSleep };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SLEEP_KEYS.list(userId) });
        },
    });
};

// Hook for updating a sleep
export const useUpdateSleep = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...sleep }: Sleep) => {
            const sleepRef = doc(db, 'users', userId, 'sleeps', id);

            await updateDoc(sleepRef, {
                ...sleep,
                start: Timestamp.fromDate(new Date(sleep.start)),
                finish: Timestamp.fromDate(new Date(sleep.finish)),
            });
            return { id, ...sleep };
        },
        onSuccess: (updatedSleep) => {
            queryClient.invalidateQueries({ queryKey: SLEEP_KEYS.list(userId) });
            queryClient.invalidateQueries({ queryKey: SLEEP_KEYS.detail(userId, updatedSleep.id) });
        },
    });
};

// Hook for deleting a sleep
export const useDeleteSleep = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (sleepId: string) => {
            const sleepRef = doc(db, 'users', userId, 'sleeps', sleepId);
            await deleteDoc(sleepRef);
            return sleepId;
        },
        onSuccess: (deletedId) => {
            queryClient.invalidateQueries({ queryKey: SLEEP_KEYS.list(userId) });
            queryClient.removeQueries({ queryKey: SLEEP_KEYS.detail(userId, deletedId) });
        },
    });
}; 