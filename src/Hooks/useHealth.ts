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
import { Health, HealthType } from "../Pages/HealthPage";
import { db } from "../Firebase/firebaseConfig";

// Query Keys
export const HEALTH_KEYS = {
    all: ['healths'] as const,
    lists: () => [...HEALTH_KEYS.all, 'list'] as const,
    list: (userId: string) => [...HEALTH_KEYS.lists(), userId] as const,
    details: () => [...HEALTH_KEYS.all, 'detail'] as const,
    detail: (userId: string, healthId: string) =>
        [...HEALTH_KEYS.details(), userId, healthId] as const,
};

const FIVE_MINUTES = 1000 * 60 * 5;
const THIRTY_MINUTES = 1000 * 60 * 30;


const convertToHealth = (doc: DocumentData): Health => {
    const data = doc.data();
    return {
        id: doc.id,
        type: data.type,
        details: data.details || '',
        start: data.start.toDate().toISOString(),
        value: data.value || '',
    };
};


export const useHealths = (userId: string) => {
    return useQuery({
        queryKey: HEALTH_KEYS.list(userId),
        queryFn: async () => {
            try {
                const healthsRef = collection(db, 'users', userId, 'healths');
                const q = query(healthsRef, orderBy('start', 'desc'));
                const querySnapshot = await getDocs(q);
                const healths = querySnapshot.docs.map(convertToHealth);
                return healths;
            } catch (error) {
                console.error("Error fetching health records:", error);
                throw new Error("Failed to fetch health records");
            }
        },
        staleTime: FIVE_MINUTES,
        gcTime: THIRTY_MINUTES,
        enabled: !!userId,
    });
};


export const useAddHealth = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newHealth: Omit<Health, 'id'>) => {
            const healthsRef = collection(db, 'users', userId, 'healths');
            const healthData = {
                ...newHealth,
                start: Timestamp.fromDate(new Date(newHealth.start)),
            };

            const docRef = await addDoc(healthsRef, healthData);
            return {
                id: docRef.id,
                ...newHealth,
            };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: HEALTH_KEYS.list(userId) });
        },
    });
};


export const useUpdateHealth = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...health }: Health) => {
            const healthRef = doc(db, 'users', userId, 'healths', id);
            await updateDoc(healthRef, {
                ...health,
                start: Timestamp.fromDate(new Date(health.start)),
            });

            return {
                id,
                ...health,
            };
        },
        onSuccess: (updatedHealth) => {
            queryClient.invalidateQueries({ queryKey: HEALTH_KEYS.list(userId) });
            queryClient.invalidateQueries({
                queryKey: HEALTH_KEYS.detail(userId, updatedHealth.id)
            });
        },
    });
};


export const useDeleteHealth = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (healthId: string) => {
            const healthRef = doc(db, 'users', userId, 'healths', healthId);
            await deleteDoc(healthRef);
            return healthId;
        },
        onSuccess: (deletedId) => {
            queryClient.invalidateQueries({ queryKey: HEALTH_KEYS.list(userId) });
            queryClient.removeQueries({
                queryKey: HEALTH_KEYS.detail(userId, deletedId)
            });
        },
    });
}; 