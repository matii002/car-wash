<script setup>
import styles from '@/assets/navbar.module.css'
import Menubar from 'primevue/menubar'
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import 'primeicons/primeicons.css'

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
      label: 'Cennik',
      icon: 'pi pi-wallet',
      route: '/',
    },
    {
      label: 'Umów się',
      icon: 'pi pi-calendar-plus',
      route: '/booking',
    },
    {
      label: 'O nas',
      icon: 'pi pi-info-circle',
      route: '/about',
    },
  ]

  if (isLoggedIn.value) {
    items.push(
      {
        label: 'Przyjmowanie zleceń',
        icon: 'pi pi-inbox',
        route: '/car-wash-panel',
      },
      {
        label: 'Zlecenia',
        icon: 'pi pi-list',
        route: '/car-wash-order-panel',
      },
      {
        label: 'Wyloguj się',
        icon: 'pi pi-sign-out',
        command: handleSignOut,
      },
    )
  } else {
    items.push({
      label: 'Zaloguj się',
      icon: 'pi pi-sign-in',
      route: '/login',
    })
  }
  return items
})
</script>

<template>
  <Toast />
  <Menubar :model="menuItems" style="justify-content: center; background-color: #475569">
    <template #item="{ item, props, hasSubmenu }">
      <RouterLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
          <i v-if="item.icon" :class="item.icon" style="color: white"></i>
          <span style="font-weight: 500; color: white">{{ item.label }}</span>
        </a>
      </RouterLink>
      <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
        <i v-if="item.icon" :class="item.icon" style="color: white"></i>
        <span>{{ item.label }}</span>
      </a>
    </template>
  </Menubar>
</template>
