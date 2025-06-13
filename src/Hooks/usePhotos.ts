import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    DocumentData,
} from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Photo } from "../Pages/PhotoPage";
import { db } from "../Firebase/firebaseConfig";

// Query Keys
export const PHOTO_KEYS = {
    all: ['photos'] as const,
    lists: () => [...PHOTO_KEYS.all, 'list'] as const,
    list: (userId: string) => [...PHOTO_KEYS.lists(), userId] as const,
    details: () => [...PHOTO_KEYS.all, 'detail'] as const,
    detail: (userId: string, id: string) =>
        [...PHOTO_KEYS.details(), userId, id] as const,
};

const FIVE_MINUTES = 1000 * 60 * 5;
const THIRTY_MINUTES = 1000 * 60 * 30;

const convertToPhoto = (doc: DocumentData): Photo => {
    const data = doc.data();
    return {
        id: doc.id,
        month: data.month,
        image: data.image,
    };
};

export const usePhotos = (userId: string) => {
    return useQuery({
        queryKey: PHOTO_KEYS.list(userId),
        queryFn: async () => {
            try {
                const photosRef = collection(db, 'users', userId, 'photos');
                const q = query(photosRef, orderBy('month', 'desc'));
                const querySnapshot = await getDocs(q);
                const photos = querySnapshot.docs.map(convertToPhoto);
                return photos;
            } catch (error) {
                console.error("Error fetching photos:", error);
                throw new Error("Failed to fetch photos");
            }
        },
        staleTime: FIVE_MINUTES,
        gcTime: THIRTY_MINUTES,
        enabled: !!userId,
    });
};

export const useUpdatePhoto = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...photo }: Photo) => {
            const photoRef = doc(db, 'users', userId, 'photos', id);
            await updateDoc(photoRef, {
                month: photo.month,
                image: photo.image,
            });
            return { id, ...photo };
        },
        onSuccess: (updatedPhoto) => {
            queryClient.invalidateQueries({ queryKey: PHOTO_KEYS.list(userId) });
            queryClient.invalidateQueries({
                queryKey: PHOTO_KEYS.detail(userId, updatedPhoto.id)
            });
        },
    });
};

export const useDeletePhoto = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const photoRef = doc(db, 'users', userId, 'photos', id);
            await deleteDoc(photoRef);
            return id;
        },
        onSuccess: (deletedId) => {
            queryClient.invalidateQueries({ queryKey: PHOTO_KEYS.list(userId) });
            queryClient.invalidateQueries({
                queryKey: PHOTO_KEYS.detail(userId, deletedId)
            });
        },
    });
};

export const useAddPhoto = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (photo: Omit<Photo, 'id'>) => {
            const photosRef = collection(db, "users", userId, "photos");
            const docRef = await addDoc(photosRef, photo);
            return { id: docRef.id, ...photo };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PHOTO_KEYS.list(userId) });
        },
    });
}; 