<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { fetchWashingOrders } from '@/washingOrders'
import Checkbox from 'primevue/checkbox'
import { db } from '@/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import dayjs from 'dayjs'

const washingOrders = ref([])

onMounted(async () => {
  washingOrders.value = await fetchWashingOrders()
})

async function updateIsFinished(id, data) {
  try {
    // console.log(data)
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
</script>

<template>
  <DataTable
    :value="washingOrders"
    tableStyle="min-width: 40rem; padding: 0 4%"
    paginator
    :rows="10"
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
      <template #body="slotProps">
        <div>
          <p>{{ formatDate(slotProps.data.date) }}</p>
        </div>
      </template>
    </Column>
    <Column field="service" header="Usługa" sortable></Column>
    <Column field="description" header="Opis"></Column>
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
