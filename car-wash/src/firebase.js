// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDOZeotrtPtk93hnbyV9GOp62k8YF_a8is',
  authDomain: 'car-wash-dc246.firebaseapp.com',
  projectId: 'car-wash-dc246',
  storageBucket: 'car-wash-dc246.firebasestorage.app',
  messagingSenderId: '333763193086',
  appId: '1:333763193086:web:43c6faa585df255ebf5daf',
  measurementId: 'G-NKMCQ7PWMM',
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const analytics = getAnalytics(firebaseApp)
const db = getFirestore(firebaseApp)

export { firebaseApp, analytics, db }
