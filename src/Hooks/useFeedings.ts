import { useQuery } from '@tanstack/react-query';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  Timestamp,
  DocumentData 
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// Types
export type FeedingType = "left breast" | "right breast" | "bottle" | "meal";

export interface Feeding {
  id: string;
  type: FeedingType;
  details: string;
  start: string;
  finish: string;
  amount?: number;
  contents: string;
  createdAt: string;
  updatedAt: string;
}

// Query Keys
export const FEEDING_KEYS = {
  all: ['feedings'] as const,
  lists: () => [...FEEDING_KEYS.all, 'list'] as const,
  list: (userId: string) => [...FEEDING_KEYS.lists(), userId] as const,
  details: () => [...FEEDING_KEYS.all, 'detail'] as const,
  detail: (userId: string, feedingId: string) => 
    [...FEEDING_KEYS.details(), userId, feedingId] as const,
};

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
    createdAt: data.createdAt.toDate().toISOString(),
    updatedAt: data.updatedAt.toDate().toISOString(),
  };
};

// Main hook
export const useFeedings = (userId: string) => {
  return useQuery({
    queryKey: FEEDING_KEYS.list(userId),
    queryFn: async () => {
      try {
        // Create a reference to the feedings collection
        const feedingsRef = collection(db, 'users', userId, 'feedings');
        
        // Create a query to get all feedings, ordered by finish date descending
        const q = query(
          feedingsRef,
          orderBy('finish', 'desc')
        );

        // Execute the query
        const querySnapshot = await getDocs(q);
        
        // Convert the documents to Feeding objects
        const feedings = querySnapshot.docs.map(convertToFeeding);
        
        return feedings;
      } catch (error) {
        console.error('Error fetching feedings:', error);
        throw new Error('Failed to fetch feedings');
      }
    },
    // Additional options
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!userId, // Only run the query if userId is available
  });
};

// Optional: Add a hook for real-time updates
export const useFeedingsRealtime = (userId: string) => {
  return useQuery({
    queryKey: FEEDING_KEYS.list(userId),
    queryFn: async () => {
      // Similar to useFeedings but with onSnapshot
      // This will be implemented if you want real-time updates
    },
    // Additional options for real-time
    staleTime: 0, // Always consider the data stale
    gcTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!userId,
  });
}; 