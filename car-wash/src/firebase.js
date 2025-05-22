import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDOZeotrtPtk93hnbyV9GOp62k8YF_a8is',
  authDomain: 'car-wash-dc246.firebaseapp.com',
  projectId: 'car-wash-dc246',
  storageBucket: 'car-wash-dc246.firebasestorage.app',
  messagingSenderId: '333763193086',
  appId: '1:333763193086:web:43c6faa585df255ebf5daf',
  measurementId: 'G-NKMCQ7PWMM',
}

const firebaseApp = initializeApp(firebaseConfig)
const analytics = getAnalytics(firebaseApp)
const db = getFirestore(firebaseApp)

export { firebaseApp, analytics, db }
