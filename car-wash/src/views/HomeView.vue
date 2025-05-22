<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Image from 'primevue/image'
import { fetchServices } from '@/services'
import { ref } from 'vue'
import { onMounted } from 'vue'

const services = ref([])

onMounted(async () => {
  services.value = await fetchServices()
})
</script>

<template>
  <div class="content">
    <Image src="../../public/car-wash.png" alt="Image" width="200" />

    <h2>Mtp Detailing</h2>

    <DataTable :value="services" tableStyle="min-width: 40rem; padding-top: 10px;">
      <Column field="name" header="Usługa"></Column>
      <Column field="description" header="Opis"></Column>
      <Column field="price" header="Cena od (PLN)"></Column>
    </DataTable>
  </div>
</template>

<style>
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
}
.content h2 {
  padding-top: 30px;
}
</style>
