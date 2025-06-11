import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, Timestamp, DocumentData } from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Leisure, LeisureType } from "../Pages/LeisurePage";
import { db } from "../Firebase/firebaseConfig";

// Query Keys
export const LEISURE_KEYS = {
    all: ['leisures'] as const,
    lists: () => [...LEISURE_KEYS.all, 'list'] as const,
    list: (userId: string) => [...LEISURE_KEYS.lists(), userId] as const,
    details: () => [...LEISURE_KEYS.all, 'detail'] as const,
    detail: (userId: string, leisureId: string) => [...LEISURE_KEYS.details(), userId, leisureId] as const,
};

const FIVE_MINUTES = 1000 * 60 * 5;
const THIRTY_MINUTES = 1000 * 60 * 30;


const convertToLeisure = (doc: DocumentData): Leisure => {
    const data = doc.data();
    return {
        id: doc.id,
        type: data.type as LeisureType,
        details: data.details || '',
        start: data.start.toDate().toISOString(),
        finish: data.finish.toDate().toISOString(),
    };
};


export const useLeisures = (userId: string) => {
    return useQuery({
        queryKey: LEISURE_KEYS.list(userId),
        queryFn: async () => {
            try {
                const leisuresRef = collection(db, 'users', userId, 'leisures');
                const q = query(leisuresRef, orderBy('start', 'desc'));
                const querySnapshot = await getDocs(q);
                const leisures = querySnapshot.docs.map(convertToLeisure);
                return leisures;
            } catch (error) {
                console.error("Error fetching leisure activities:", error);
                throw new Error("Failed to fetch leisure activities");
            }
        },
        staleTime: FIVE_MINUTES,
        gcTime: THIRTY_MINUTES,
        enabled: !!userId,
    });
};


export const useAddLeisure = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newLeisure: Omit<Leisure, 'id'>) => {
            const leisuresRef = collection(db, 'users', userId, 'leisures');
            const leisureData = {
                ...newLeisure,
                start: Timestamp.fromDate(new Date(newLeisure.start)),
                finish: Timestamp.fromDate(new Date(newLeisure.finish)),
            };
            const docRef = await addDoc(leisuresRef, leisureData);
            return { id: docRef.id, ...newLeisure };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LEISURE_KEYS.list(userId) });
        },
    });
};


export const useUpdateLeisure = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...leisure }: Leisure) => {
            const leisureRef = doc(db, 'users', userId, 'leisures', id);
            await updateDoc(leisureRef, {
                ...leisure,
                start: Timestamp.fromDate(new Date(leisure.start)),
                finish: Timestamp.fromDate(new Date(leisure.finish)),
            });
            return { id, ...leisure };
        },
        onSuccess: (updatedLeisure) => {
            queryClient.invalidateQueries({ queryKey: LEISURE_KEYS.list(userId) });
            queryClient.invalidateQueries({ queryKey: LEISURE_KEYS.detail(userId, updatedLeisure.id) });
        },
    });
};


export const useDeleteLeisure = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (leisureId: string) => {
            const leisureRef = doc(db, 'users', userId, 'leisures', leisureId);
            await deleteDoc(leisureRef);
            return leisureId;
        },
        onSuccess: (deletedId) => {
            queryClient.invalidateQueries({ queryKey: LEISURE_KEYS.list(userId) });
            queryClient.removeQueries({ queryKey: LEISURE_KEYS.detail(userId, deletedId) });
        },
    });
}; 