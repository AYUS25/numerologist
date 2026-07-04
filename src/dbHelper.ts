import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { NumerologyInput } from './types';

export interface SavedReading {
  id: string;
  userId: string;
  fullName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  phoneNumber?: string;
  createdAt: any;
}

// Save a new reading for a user
export async function saveReading(userId: string, input: NumerologyInput): Promise<string> {
  const readingsCol = collection(db, 'readings');
  const docRef = await addDoc(readingsCol, {
    userId,
    fullName: input.fullName,
    dateOfBirth: input.dateOfBirth,
    timeOfBirth: input.timeOfBirth || '',
    placeOfBirth: input.placeOfBirth || '',
    phoneNumber: input.phoneNumber || '',
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

// Fetch all saved readings for a user
export async function getSavedReadings(userId: string): Promise<SavedReading[]> {
  const readingsCol = collection(db, 'readings');
  const q = query(
    readingsCol, 
    where('userId', '==', userId), 
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  const readings: SavedReading[] = [];
  
  snapshot.forEach((doc) => {
    const data = doc.data();
    readings.push({
      id: doc.id,
      userId: data.userId,
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth,
      timeOfBirth: data.timeOfBirth || '',
      placeOfBirth: data.placeOfBirth || '',
      phoneNumber: data.phoneNumber || '',
      createdAt: data.createdAt
    });
  });
  
  return readings;
}

// Delete a saved reading
export async function deleteSavedReading(readingId: string): Promise<void> {
  const docRef = doc(db, 'readings', readingId);
  await deleteDoc(docRef);
}
