<script setup>
import Password from 'primevue/password'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import * as yup from 'yup'
import Message from 'primevue/message'
import Button from 'primevue/button'
import { Form } from '@primevue/forms'
import InputText from 'primevue/inputtext'
import Image from 'primevue/image'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const router = useRouter()

const toast = useToast()

const register = (data) => {
  if (data.valid) {
    const { email, password } = data.values
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('Zalogowano pomyślnie!')
        console.group(auth.currentUser)
        router.push('/car-wash-panel')
      })
      .catch((error) => {
        console.error('Błąd logowania: ', error.message)
        toast.add({
          severity: 'error',
          summary: 'Niepoprawne dane logowania!',
          detail: 'Podany email lub hasło jest niepoprawne.',
          life: 5000,
        })
      })
  }
}

let resolver = yupResolver(
  yup.object().shape({
    email: yup.string().required('Podaj email.'),
    password: yup.string().required('Podaj hasło.'),
  }),
)

const initialValues = {
  email: '',
  password: '',
}

function onFormSubmit(data) {
  if (data.valid == true) {
    register(data)
    console.log('Dane zostały przesłane.')
  }
}
</script>

<template>
  <Toast />
  <h3 id="info">Logowanie tylko i wyłącznie dla pracowników Mtp Detailing!</h3>
  <div class="outside">
    <Form
      v-slot="$form"
      :resolver="resolver"
      :initialValues="initialValues"
      @submit="onFormSubmit"
      class="loginForm"
    >
      <Image src="/car-wash.png" alt="Image" width="200" />
      <div class="flex flex-col gap-1">
        <InputText name="email" type="text" placeholder="Email" class="field" />
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
          $form.email.error?.message
        }}</Message>
        <Password name="password" :feedback="false" placeholder="Hasło" fluid toggleMask />
        <template v-if="$form.password?.invalid">
          <Message
            v-for="(error, index) of $form.password.errors"
            :key="index"
            severity="error"
            size="small"
            variant="simple"
            >{{ error.message }}</Message
          >
        </template>
      </div>
      <Button type="submit" severity="secondary" label="Zaloguj się" class="loginButton" />
    </Form>
  </div>
</template>

<style>
.outside {
  display: flex;
  justify-content: center;
  min-height: 100vh;
}
.loginForm {
  border: 1px solid #dfe6ec;
  border-radius: 8px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 350px;
  text-align: center;
  margin-top: 4%;
  max-height: 450px;
}
#ha2 {
  margin: 2rem;
  font-weight: 700;
  color: black;
}
.field {
  width: 100%;
  max-width: 100%;
  margin-bottom: 2.5rem;
}
.loginButton {
  width: 100%;
  max-width: 100%;
  margin-top: 2.5rem;
}
#info {
  color: red;
  text-align: center;
  margin-top: 1rem;
  font-size: large;
}
</style>
