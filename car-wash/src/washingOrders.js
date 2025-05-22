import { db } from './firebase'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'

export async function fetchWashingOrders() {
  try {
    const q = query(
      collection(db, 'washingOrders'),
      where('isAccepted', '==', true),
      orderBy('isFinished', 'asc'),
      orderBy('date', 'desc'),
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      date: doc.data().date.toDate(),
    }))
  } catch (error) {
    console.error('Błąd podczas pobierania danych.', error)
    return []
  }
}
