import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, Timestamp, DocumentData } from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Growth, GrowthType } from "../Pages/GrowthPage";
import { db } from "../Firebase/firebaseConfig";

// Query Keys
export const GROWTH_KEYS = {
    all: ['growths'] as const,
    lists: () => [...GROWTH_KEYS.all, 'list'] as const,
    list: (userId: string) => [...GROWTH_KEYS.lists(), userId] as const,
    details: () => [...GROWTH_KEYS.all, 'detail'] as const,
    detail: (userId: string, growthId: string) => [...GROWTH_KEYS.details(), userId, growthId] as const,
};

const FIVE_MINUTES = 1000 * 60 * 5;
const THIRTY_MINUTES = 1000 * 60 * 30;


const convertToGrowth = (doc: DocumentData): Growth => {
    const data = doc.data();
    return {
        id: doc.id,
        type: data.type as GrowthType,
        value: data.value,
        start: data.start.toDate().toISOString(),
    };
};


export const useGrowths = (userId: string) => {
    return useQuery({
        queryKey: GROWTH_KEYS.list(userId),
        queryFn: async () => {
            try {
                const growthsRef = collection(db, 'users', userId, 'growths');
                const q = query(growthsRef, orderBy('start', 'desc'));
                const querySnapshot = await getDocs(q);
                const growths = querySnapshot.docs.map(convertToGrowth);
                return growths;
            } catch (error) {
                console.error("Error fetching growth records:", error);
                throw new Error("Failed to fetch growth records");
            }
        },
        staleTime: FIVE_MINUTES,
        gcTime: THIRTY_MINUTES,
        enabled: !!userId,
    });
};


export const useAddGrowth = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newGrowth: Omit<Growth, 'id'>) => {
            const growthsRef = collection(db, 'users', userId, 'growths');
            const growthData = {
                ...newGrowth,
                start: Timestamp.fromDate(new Date(newGrowth.start)),
            };
            const docRef = await addDoc(growthsRef, growthData);
            return { id: docRef.id, ...newGrowth };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: GROWTH_KEYS.list(userId) });
        },
    });
};


export const useUpdateGrowth = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...growth }: Growth) => {
            const growthRef = doc(db, 'users', userId, 'growths', String(id));
            await updateDoc(growthRef, {
                ...growth,
                start: Timestamp.fromDate(new Date(growth.start)),
            });
            return { id: String(id), ...growth };
        },
        onSuccess: (updatedGrowth) => {
            queryClient.invalidateQueries({ queryKey: GROWTH_KEYS.list(userId) });
            queryClient.invalidateQueries({ queryKey: GROWTH_KEYS.detail(userId, updatedGrowth.id) });
        },
    });
};


export const useDeleteGrowth = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (growthId: string) => {
            const growthRef = doc(db, 'users', userId, 'growths', String(growthId));
            await deleteDoc(growthRef);
            return String(growthId);
        },
        onSuccess: (deletedId) => {
            queryClient.invalidateQueries({ queryKey: GROWTH_KEYS.list(userId) });
            queryClient.removeQueries({ queryKey: GROWTH_KEYS.detail(userId, deletedId) });
        },
    });
}; 