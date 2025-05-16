<script setup>
import Menubar from 'primevue/menubar'
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
localStorage.setItem('userToken', 'token')
const isAuthenticated = computed(() => localStorage.getItem('userToken' !== null))

const items = [
  {
    label: 'Strona główna',
    route: '/',
  },
  {
    label: 'Umów się',
    route: '/booking',
  },
  {
    label: 'O nas',
    route: '/about',
  },
  {
    label: 'Przyjmowanie zleceń',
    route: '/car-wash-panel',
  },
  {
    label: 'Zlecenia',
    route: '/car-wash-order-panel',
  },
]

function logout() {
  console.log('Wylogowano użytkownika.')
  localStorage.clear()
  router.push({ name: 'login' })
}

if (!isAuthenticated.value) {
  items.push({
    label: 'Zaloguj się',
    route: '/login',
  })
} else {
  items.push({
    label: 'Wyloguj się',
    command: () => {
      logout()
    },
  })
}
</script>

<template>
  <Menubar :model="items" style="justify-content: center">
    <template #item="{ item, props, hasSubmenu }">
      <RouterLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
          <!-- <span :class="item.icon" /> -->
          <span>{{ item.label }}</span>
        </a>
      </RouterLink>
      <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
        <!-- <span :class="item.icon" /> -->
        <span>{{ item.label }}</span>
        <!-- <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" /> -->
      </a>
    </template>
  </Menubar>
</template>
