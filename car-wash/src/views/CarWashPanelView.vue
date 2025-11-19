<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { db } from '@/firebase'
import {
  doc,
  updateDoc,
  Timestamp,
  deleteDoc,
  onSnapshot,
  collection,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import dayjs from 'dayjs'
import { Button } from 'primevue'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import InputText from 'primevue/inputtext'

const confirm = useConfirm()

const washingRequests = ref([])

onMounted(async () => {
  try {
    const q = query(
      collection(db, 'washingOrders'),
      where('isAccepted', '==', false),
      orderBy('createdAt', 'desc'),
    )

    onSnapshot(
      q,
      (snapshot) => {
        washingRequests.value = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          date: doc.data().date.toDate(),
        }))
      },
      (error) => {
        console.error('Błąd podczas nasłuchiwania danych z firestore.', error)
      },
    )
  } catch (error) {
    console.error('Błąd podczas pobierania danych.', error)
  }
})

async function updateIsAccepted(id, data) {
  try {
    const docRef = doc(db, 'washingOrders', id)
    await updateDoc(docRef, {
      isAccepted: data.isAccepted,
    })
  } catch (error) {
    console.log('Aktualizacja nie powiodła się!', error)
  }
}

async function deleteIsAccepted(id, data) {
  try {
    const docRef = doc(db, 'washingOrders', id)
    await deleteDoc(docRef, {
      isAccepted: data.isAccepted,
    })
  } catch (error) {
    console.warn('Usuwanie nie powiodło się!', error)
  }
}

function confirmAccept(id, data) {
  confirm.require({
    header: 'Potwierdzenie akceptacji zlecenia',
    message: 'Czy przyjmujesz zlecenie?',
    acceptLabel: 'Tak',
    rejectLabel: 'Nie',
    acceptClass: 'p-button-success',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      data.isAccepted = true
      await updateIsAccepted(id, data)
    },
    reject: () => {},
  })
}

function confirmDelete(id, data) {
  confirm.require({
    header: 'Potwierdzenie usuwania zlecenia',
    message: 'Czy chcesz usunąć zlecenie?',
    acceptLabel: 'Tak',
    rejectLabel: 'Nie',
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      data.isAccepted = true
      await deleteIsAccepted(id, data)
    },
    reject: () => {},
  })
}

function formatDate(date) {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

async function onCellEditComplete(event) {
  const { data, newValue, field } = event

  let valueToUpdate = newValue

  if (field === 'date') {
    const parsed = dayjs(newValue)

    if (!parsed.isValid()) {
      console.warn('Niepoprawna wartość daty.')
      return
    }

    valueToUpdate = Timestamp.fromDate(parsed.toDate())
  }

  data[field] = newValue
  try {
    const docRef = doc(db, 'washingOrders', data.id)
    await updateDoc(docRef, {
      [field]: valueToUpdate,
    })
  } catch (error) {
    console.error('Błąd aktualizacji:', error)
  }
}
</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <DataTable
    :value="washingRequests"
    tableStyle="min-width: 40rem; padding: 0 4%"
    paginator
    :rows="10"
    editMode="cell"
    @cell-edit-complete="onCellEditComplete"
  >
    <Column header="Klient">
      <template #body="slotProps">
        <div>
          <p>{{ slotProps.data.name }}</p>
          <p>{{ slotProps.data.email }}</p>
          <p>{{ slotProps.data.phone }}</p>
        </div>
      </template>
    </Column>
    <Column header="Samochód">
      <template #body="slotProps">
        <div>
          <p>{{ slotProps.data.car }}</p>
          <p>{{ slotProps.data.licensePlate }}</p>
        </div>
      </template>
    </Column>

    <Column field="date" header="Termin">
      <template #body="{ data, field }">
        {{ formatDate(data[field]) }}
      </template>
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" type="datetime-local" />
      </template>
    </Column>

    <Column field="service" header="Usługa"></Column>
    <Column field="description" header="Opis">
      <template #editor="{ data, field }"><InputText v-model="data[field]" /> </template
    ></Column>
    <Column header="Weź zlecenie">
      <template #body="slotProps">
        <div>
          <Button
            @click="confirmAccept(slotProps.data.id, slotProps.data)"
            label="Akceptuj"
            outlined
            severity="secondary"
          ></Button>
          <Button
            @click="confirmDelete(slotProps.data.id, slotProps.data)"
            label="Usuń"
            outlined
            severity="danger"
            style="margin-left: 3px"
          ></Button>
        </div>
      </template>
    </Column>
  </DataTable>
</template>
