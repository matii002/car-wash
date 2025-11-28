<script setup>
import Panel from 'primevue/panel'
import 'primeicons/primeicons.css'
</script>
<template>
  <div class="about">
    <Panel header="O nas" class="info-panel">
      <div class="photo">
        <img src="@/assets/team.png" alt="Mtp Detailing Katowice Logo" width="300" class="image" />
      </div>
      <p class="m-0">
        Mtp Detailng Katowice powstało z potrzeby serca, nie z planu na biznes. Założycielem firmy
        jest Mateusz Proszowski, student informatyki, który pewnego dnia zrozumiał, że programowanie
        nie daje mu prawdziwej satysfakcji. Zamiast kolejnych godzin przy monitorze, zaczął spędzać
        czas w garażu – najpierw czyszcząc swój samochód, potem auta znajomych. Szybko okazało się,
        że to nie tylko hobby, ale prawdziwa pasja, która daje mu radość, spokój i poczucie sensu.
        Tak właśnie narodził się pomysł na Mtp Detailng – miejsce, w którym liczy się detal, jakość
        i zadowolenie klienta. Dziś Mtp Detailng to coś więcej niż myjnia – to lokalne studio
        autodetailingu w Katowicach, które oferuje dokładność, profesjonalizm i ludzkie podejście.
        Bo dla nas każde auto to coś więcej niż środek transportu – to wizytówka właściciela.
      </p>
    </Panel>
    <Panel header="Kontakt" class="info-panel-1">
      <h4>
        <i class="pi pi-map-marker" style="font-size: 1rem"></i>
        <a
          href="https://www.google.com/maps?q=ul.+Graniczna+123,+40-018+Katowice,+Polska"
          target="_blank"
        >
          ul. Graniczna 123, 40-018 Katowice, Polska</a
        >
      </h4>
      <h4>
        <i class="pi pi-phone" style="font-size: 1rem"></i>
        <a href="tel:+48500123456"> +48 500 123 456</a>
      </h4>
      <h4>
        <i class="pi pi-envelope" style="font-size: 1rem"></i>
        <a href="mailto:kontakt@mtpdetailingkatowice.pl"> kontakt@mtpdetailingkatowice.pl</a>
      </h4>
      <h4>
        <i class="pi pi-instagram" style="font-size: 1rem"></i
        ><a href="https://www.instagram.com/mtpDetailing" target="_blank"> mtpDetailng</a>
      </h4>
    </Panel>
  </div>
</template>

<style>
.about {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.about h4 a {
  text-decoration: none;
  color: inherit;
}
.info-panel {
  width: 45%;
  margin-top: 80px;
}

.info-panel-1 {
  width: 45%;
  margin-top: 20px;
}
.photo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;
}
.image {
  border-radius: 8px;
}
</style>
