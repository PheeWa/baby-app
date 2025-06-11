import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, Timestamp, DocumentData } from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Diaper } from "../Pages/DiapersPage";
import { db } from "../Firebase/firebaseConfig";

// Query Keys
export const DIAPER_KEYS = {
    all: ['diapers'] as const,
    lists: () => [...DIAPER_KEYS.all, 'list'] as const,
    list: (userId: string) => [...DIAPER_KEYS.lists(), userId] as const,
    details: () => [...DIAPER_KEYS.all, 'detail'] as const,
    detail: (userId: string, diaperId: string) => [...DIAPER_KEYS.details(), userId, diaperId] as const,
};

const FIVE_MINUTES = 1000 * 60 * 5;
const THIRTY_MINUTES = 1000 * 60 * 30;

// Helper function to convert Firestore data to Diaper type
const convertToDiaper = (doc: DocumentData): Diaper => {
    const data = doc.data();
    return {
        id: doc.id,
        type: data.type,
        details: data.details || '',
        start: data.start.toDate().toISOString(),
    };
};

// Hook for fetching all diapers for a user
export const useDiapers = (userId: string) => {
    return useQuery({
        queryKey: DIAPER_KEYS.list(userId),
        queryFn: async () => {
            try {
                const diapersRef = collection(db, 'users', userId, 'diapers');
                const q = query(diapersRef, orderBy('start', 'desc'));
                const querySnapshot = await getDocs(q);
                const diapers = querySnapshot.docs.map(convertToDiaper);
                return diapers;
            } catch (error) {
                console.error("Error fetching diapers:", error);
                throw new Error("Failed to fetch diapers");
            }
        },
        staleTime: FIVE_MINUTES,
        gcTime: THIRTY_MINUTES,
        enabled: !!userId,
    });
};

// Hook for adding a new diaper
export const useAddDiaper = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newDiaper: Omit<Diaper, 'id'>) => {
            const diapersRef = collection(db, 'users', userId, 'diapers');
            const diaperData = {
                ...newDiaper,
                start: Timestamp.fromDate(new Date(newDiaper.start)),
            };
            const docRef = await addDoc(diapersRef, diaperData);
            return { id: docRef.id, ...newDiaper };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DIAPER_KEYS.list(userId) });
        },
    });
};

// Hook for updating a diaper
export const useUpdateDiaper = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...diaper }: Diaper) => {
            const diaperRef = doc(db, 'users', userId, 'diapers', String(id));
            await updateDoc(diaperRef, {
                ...diaper,
                start: Timestamp.fromDate(new Date(diaper.start)),
            });
            return { id: String(id), ...diaper };
        },
        onSuccess: (updatedDiaper) => {
            queryClient.invalidateQueries({ queryKey: DIAPER_KEYS.list(userId) });
            queryClient.invalidateQueries({ queryKey: DIAPER_KEYS.detail(userId, updatedDiaper.id) });
        },
    });
};

// Hook for deleting a diaper
export const useDeleteDiaper = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (diaperId: string | number) => {
            const diaperRef = doc(db, 'users', userId, 'diapers', String(diaperId));
            await deleteDoc(diaperRef);
            return String(diaperId);
        },
        onSuccess: (deletedId) => {
            queryClient.invalidateQueries({ queryKey: DIAPER_KEYS.list(userId) });
            queryClient.removeQueries({ queryKey: DIAPER_KEYS.detail(userId, deletedId) });
        },
    });
}; 