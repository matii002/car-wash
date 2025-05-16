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

// const services = [
//   {
//     service: 'Mycie zewnętrzne',
//     description: 'Mycie karoserii, szyb i felg',
//     price: '40 zł',
//   },
//   {
//     service: 'Mycie wewnętrzne',
//     description: 'Odkurzanie, czyszczenie plastików i szyb',
//     price: '50 zł',
//   },
//   {
//     service: 'Zestaw: mycie zew. + wew.',
//     description: 'Kompletne czyszczenie auta z zewnątrz i wewnątrz',
//     price: '80 zł',
//   },
//   {
//     service: 'Pranie tapicerki',
//     description: 'Kompleksowe pranie foteli i podsufitki',
//     price: '150 zł',
//   },
//   {
//     service: 'Polerowanie lakieru',
//     description: 'Jednoetapowa korekta i nabłyszczanie lakieru',
//     price: '300 zł',
//   },
// ]
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
