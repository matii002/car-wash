<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { fetchWashingRequests } from '@/washingRequest'
import { db } from '@/firebase'
import { doc, updateDoc, Timestamp } from 'firebase/firestore'
import dayjs from 'dayjs'
import { Button } from 'primevue'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'

const confirm = useConfirm()

const washingRequest = ref([])

onMounted(async () => {
  washingRequest.value = await fetchWashingRequests()
})

async function updateIsAccepted(id, data) {
  try {
    // console.log(data)
    const docRef = doc(db, 'washingOrders', id)
    await updateDoc(docRef, {
      isAccepted: data.isAccepted,
    })
  } catch (error) {
    console.log('Aktualizacja nie powiodła się!', error)
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

function formatDate(date) {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

async function onCellEditComplete(event) {
  console.log('Edytowano:', event)
  const { data, newValue, field } = event
  //data[field] = newValue //zmiana lokalnie a pózniej zapisuje w bd
  //data to cały obiekt

  const valueToUpdate = field === 'date' ? Timestamp.fromDate(newValue) : newValue
  data[field] = valueToUpdate
  try {
    const docRef = doc(db, 'washingOrders', data.id)
    await updateDoc(docRef, {
      [field]: valueToUpdate, //dynamiczna właściwość obiektu
    })
  } catch (error) {
    console.error('Błąd aktualizacji:', error)
  }
}
</script>
<!-- zrobić lazy loading-->
<template>
  <ConfirmDialog></ConfirmDialog>
  <DataTable
    :value="washingRequest"
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
      <!-- <template #body="slotProps">
        <div>
          <p>{{ formatDate(slotProps.data.date) }}</p>
        </div>
      </template> -->

      <template #editor="{ data, field }">
        <!-- <DatePicker
          id="datepicker-24h"
          v-model="data[field]"
          placeholder="Data"
          showTime
          hourFormat="24"
          :manualInput="false"
          :disabledDays="[0, 6]"
          fluid
          style="margin-top: 1rem"
        /> --><InputText v-model="data[field]" type="date" />
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
            @click="confirmAccept(slotProps.data.id, slotProps.data)"
            label="Usuń"
            outlined
            severity="danger"
            style="margin-left: 3px"
          ></Button>
          <!-- <Checkbox
            v-model="slotProps.data.isAccepted"
            binary
            size="large"
            @change="updateIsAccepted(slotProps.data.id, slotProps.data)"
          /> -->
        </div>
      </template>
    </Column>
  </DataTable>
</template>
