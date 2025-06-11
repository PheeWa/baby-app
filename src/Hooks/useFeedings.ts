import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp,
    DocumentData
} from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Feeding, CreateFeedingInput } from "../Types/feeding";
import { db } from "../Firebase/firebaseConfig";


// Query Keys
export const FEEDING_KEYS = {
    all: ['feedings'] as const,
    lists: () => [...FEEDING_KEYS.all, 'list'] as const,
    list: (userId: string) => [...FEEDING_KEYS.lists(), userId] as const,
    details: () => [...FEEDING_KEYS.all, 'detail'] as const,
    detail: (userId: string, feedingId: string) =>
        [...FEEDING_KEYS.details(), userId, feedingId] as const,
};

const FIVE_MINUTES = 1000 * 60 * 5;
const THIRTY_MINUTES = 1000 * 60 * 30;

// Helper function to convert Firestore data to Feeding type
const convertToFeeding = (doc: DocumentData): Feeding => {
    const data = doc.data();

    return {
        id: doc.id,
        type: data.type,
        details: data.details || '',
        start: data.start.toDate().toISOString(),
        finish: data.finish.toDate().toISOString(),
        amount: data.amount,
        contents: data.contents || '',

    };
};

// Main hook for fetching all feedings
export const useFeedings = (userId: string) => {

    return useQuery({
        queryKey: FEEDING_KEYS.list(userId),
        queryFn: async () => {
            try {
                const feedingsRef = collection(db, 'users', userId, 'feedings');
                const q = query(
                    feedingsRef,
                    orderBy('finish', 'desc')
                );
                const querySnapshot = await getDocs(q);
                console.log("querySnapshot", querySnapshot.docs);
                const feedings = querySnapshot.docs.map(convertToFeeding);
                console.log("feedingsInUseFeedings", feedings);
                return feedings;
            } catch (error) {
                console.log("error", error);
                throw new Error('Failed to fetch feedings');
            }
        },
        staleTime: FIVE_MINUTES,
        gcTime: THIRTY_MINUTES,
        enabled: !!userId,
    });
};

// Hook for adding a new feeding
export const useAddFeeding = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newFeeding: CreateFeedingInput) => {
            const feedingsRef = collection(db, 'users', userId, 'feedings');
            const now = Timestamp.now();

            const feedingData = {
                ...newFeeding,
                start: Timestamp.fromDate(new Date(newFeeding.start)),
                finish: Timestamp.fromDate(new Date(newFeeding.finish)),

            };

            const docRef = await addDoc(feedingsRef, feedingData);
            return {
                id: docRef.id,
                ...newFeeding,
            };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FEEDING_KEYS.list(userId) });
        },
    });
};

// Hook for updating a feeding
export const useUpdateFeeding = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...feeding }: Feeding) => {
            const feedingRef = doc(db, 'users', userId, 'feedings', id);


            await updateDoc(feedingRef, {
                ...feeding,
                start: Timestamp.fromDate(new Date(feeding.start)),
                finish: Timestamp.fromDate(new Date(feeding.finish)),
            });

            return {
                id,
                ...feeding,
            };
        },
        onSuccess: (updatedFeeding) => {
            queryClient.invalidateQueries({ queryKey: FEEDING_KEYS.list(userId) });
            queryClient.invalidateQueries({
                queryKey: FEEDING_KEYS.detail(userId, updatedFeeding.id)
            });
        },
    });
};

// Hook for deleting a feeding
export const useDeleteFeeding = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (feedingId: string) => {
            const feedingRef = doc(db, 'users', userId, 'feedings', feedingId);
            await deleteDoc(feedingRef);
            return feedingId;
        },
        onSuccess: (deletedId) => {
            // Remove from both the list and individual feeding caches
            queryClient.invalidateQueries({ queryKey: FEEDING_KEYS.list(userId) });
            queryClient.removeQueries({
                queryKey: FEEDING_KEYS.detail(userId, deletedId)
            });
        },
    });
};


