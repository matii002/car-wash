<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { ref } from 'vue'
import { onMounted } from 'vue'
import Button from 'primevue/button'
import { db } from '@/firebase'
import {
  doc,
  updateDoc,
  Timestamp,
  onSnapshot,
  collection,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import dayjs from 'dayjs'
import InputText from 'primevue/inputtext'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'

const washingOrders = ref([])

const confirm = useConfirm()

onMounted(async () => {
  try {
    const q = query(
      collection(db, 'washingOrders'),
      where('isAccepted', '==', true),
      orderBy('isFinished', 'asc'),
      orderBy('date', 'desc'),
    )

    onSnapshot(
      q,
      (snapshot) => {
        washingOrders.value = snapshot.docs.map((doc) => ({
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

async function updateIsFinished(id, newValue) {
  try {
    const docRef = doc(db, 'washingOrders', id)
    await updateDoc(docRef, {
      isFinished: newValue,
    })
  } catch (error) {
    console.log('Aktualizacja nie powiodła się!', error)
  }
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

const handleUpdate = (id, newValue) => {
  updateIsFinished(id, newValue)
}

function confirmAccept(id, newValue) {
  if (newValue) {
    confirm.require({
      header: 'Potwierdzenie wykonania zlecenia',
      message: 'Czy potwierdzasz wykonanie zlecenia?',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      acceptClass: 'p-button-success',
      rejectClass: 'p-button-secondary',
      accept: () => {
        handleUpdate(id, newValue)
      },
      reject: () => {},
    })
  } else {
    confirm.require({
      header: 'Zmiana statusu zlecenia',
      message: 'Czy potwierdzasz zmianę statusu na nieukończony?',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      acceptClass: 'p-button-warn',
      rejectClass: 'p-button-secondary',
      accept: () => {
        handleUpdate(id, newValue)
      },
      reject: () => {},
    })
  }
}
</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <DataTable
    :value="washingOrders"
    editMode="cell"
    :paginator="true"
    :rows="10"
    @cell-edit-complete="onCellEditComplete"
    tableStyle="min-width: 40rem; padding: 0 4%"
  >
    <Column field="email" header="Klient" sortable>
      <template #body="slotProps">
        <div>
          <p>{{ slotProps.data.name }}</p>
          <p>{{ slotProps.data.email }}</p>
          <p>{{ slotProps.data.phone }}</p>
        </div>
      </template>
    </Column>
    <Column field="car" header="Samochód" sortable>
      <template #body="slotProps">
        <div>
          <p>{{ slotProps.data.car }}</p>
          <p>{{ slotProps.data.licensePlate }}</p>
        </div>
      </template>
    </Column>
    <Column field="date" header="Umówiony" sortable>
      <template #body="{ data, field }">
        {{ formatDate(data[field]) }}
      </template>
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" type="datetime-local" />
      </template>
    </Column>
    <Column field="service" header="Usługa" sortable></Column>
    <Column field="description" header="Opis"
      ><template #editor="{ data, field }"><InputText v-model="data[field]" /> </template
    ></Column>
    <Column field="isFinished" header="Ukończony" sortable>
      <template #body="slotProps">
        <!-- <div>
          <Checkbox
            v-model="slotProps.data.isFinished"
            binary
            size="large"
            @change="updateIsFinished(slotProps.data.id, slotProps.data)"
          />
        </div> -->
        <Button
          :label="slotProps.data.isFinished ? 'Ukończone' : 'Nieukończone'"
          :severity="slotProps.data.isFinished ? 'success' : 'warn'"
          variant="text"
          size="medium"
          @click="confirmAccept(slotProps.data.id, !slotProps.data.isFinished)"
        />
      </template>
    </Column>
  </DataTable>
</template>
