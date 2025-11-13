// Firebase + Firestore helpers
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

// Read config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let app = null
let db = null

try {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  db = getFirestore(app)
} catch (e) {
  // Silent fail if config missing; UI will handle
  console.warn('Firebase not initialized. Set VITE_FIREBASE_* env vars to enable breaches.', e)
}

export async function fetchBreaches() {
  if (!db) return []
  try {
    const querySnapshot = await getDocs(collection(db, 'filtered_messages'))
    return querySnapshot.docs.map((doc) => {
      const data = doc.data() || {}
      return {
        id: data.id ?? doc.id,
        target: data.target ?? 'Unknown',
        description: data.description ?? '',
        usefulness: String(data.usefulness ?? ''),
        date: data.date ?? '',
      }
    })
  } catch (error) {
    console.error('Error fetching breaches:', error)
    return []
  }
}
