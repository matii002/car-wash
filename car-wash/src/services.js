import { db } from './firebase'
import { collection, getDocs } from 'firebase/firestore'

export async function fetchServices() {
  try {
    const querySnapshot = await getDocs(collection(db, 'services'))
    return querySnapshot.docs.map((doc) => ({
      name: doc.name,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Błąd podczas pobierania danych.', error)
    return []
  }
}
