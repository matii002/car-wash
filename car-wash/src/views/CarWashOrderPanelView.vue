<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { fetchWashingOrders } from '@/washingOrders'
import Checkbox from 'primevue/checkbox'
import { db } from '@/firebase'
import { doc, updateDoc, Timestamp } from 'firebase/firestore'
import dayjs from 'dayjs'
import InputText from 'primevue/inputtext'

const washingOrders = ref([])

onMounted(async () => {
  washingOrders.value = await fetchWashingOrders()
})

async function updateIsFinished(id, data) {
  try {
    const docRef = doc(db, 'washingOrders', id)
    await updateDoc(docRef, {
      isFinished: data.isFinished,
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
</script>

<template>
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
        <div>
          <Checkbox
            v-model="slotProps.data.isFinished"
            binary
            size="large"
            @change="updateIsFinished(slotProps.data.id, slotProps.data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>
