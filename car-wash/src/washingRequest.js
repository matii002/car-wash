import { db } from './firebase'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
export async function fetchWashingRequests() {
  try {
    const q = query(
      collection(db, 'washingOrders'),
      where('isAccepted', '==', false),
      orderBy('createdAt', 'desc'),
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      //zwraca tablice docs
      //mapuj (doc) na ...
      ...doc.data(), // rozpakuj (...) klucz wartość wszystkie pola i utwórz nowy obiekt za pomoca data()
      id: doc.id,
      date: doc.data().date.toDate(),
    }))
  } catch (error) {
    console.error('Błąd podczas pobierania danych.', error)
    return []
  }
}
