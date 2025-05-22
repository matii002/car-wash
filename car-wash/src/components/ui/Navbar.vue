<script setup>
import Menubar from 'primevue/menubar'
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const router = useRouter()

const isLoggedIn = ref(false)

const auth = getAuth()

const toast = useToast()

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
    } else {
      isLoggedIn.value = false
    }
  })
})

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push('/login')
  })
  console.error('Wylogowano pomyślnie')
  toast.add({
    severity: 'success',
    summary: 'Wylogowano pomyślnie!',
    life: 3000,
  })
}

const menuItems = computed(() => {
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
  ]

  if (isLoggedIn.value) {
    items.push(
      {
        label: 'Przyjmowanie zleceń',
        route: '/car-wash-panel',
      },
      {
        label: 'Zlecenia',
        route: '/car-wash-order-panel',
      },
      {
        label: 'Wyloguj się',
        command: handleSignOut,
      },
    )
  } else {
    items.push({
      label: 'Zaloguj się',
      route: '/login',
    })
  }
  return items
})
</script>

<template>
  <Toast />
  <Menubar :model="menuItems" style="justify-content: center">
    <template #item="{ item, props, hasSubmenu }">
      <RouterLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
          <span>{{ item.label }}</span>
        </a>
      </RouterLink>
      <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
        <span>{{ item.label }}</span>
      </a>
    </template>
  </Menubar>
</template>
