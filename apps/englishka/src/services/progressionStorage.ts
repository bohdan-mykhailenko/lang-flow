import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface TopicProgression {
  topicId: string;
  topicTitle: string;
  startDate: string | null; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
  isCompleted: boolean;
  topicRating: number; // 1 to 5
  confidenceRating: number; // 1 to 5
  teacherRating: number; // 1 to 5
  teacherGrade?: number; // 1 to 12
  teacherNotes?: string; // notes from teacher (red section)
  notes?: string;
  updatedAt: string;
}

const COLLECTION_NAME = 'topic_progressions';

export const progressionStorage = {
  // Fetch progression directly from Firebase Firestore
  get: async (topicId: string): Promise<TopicProgression | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, topicId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as TopicProgression;
      }
      return null;
    } catch (error) {
      console.warn(`[Firebase Firestore] Reading topic ${topicId}:`, error);
      return null;
    }
  },

  // Save progression directly to Firebase Firestore
  save: async (data: TopicProgression): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, data.topicId);
      await setDoc(docRef, data, { merge: true });
      return true;
    } catch (error) {
      console.error(
        `[Firebase Firestore] Writing topic ${data.topicId}:`,
        error,
      );
      throw error;
    }
  },
};
