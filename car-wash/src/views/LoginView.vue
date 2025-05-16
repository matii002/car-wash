<script setup>
import Password from 'primevue/password'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import * as yup from 'yup'
import Message from 'primevue/message'
import Button from 'primevue/button'
import { Form } from '@primevue/forms'
import InputText from 'primevue/inputtext'
import Image from 'primevue/image'

let resolver = yupResolver(
  yup.object().shape({
    username: yup.string().required('Podaj login.'),
    password: yup.string().required('Podaj hasło.'), //poprawić na password
  }),
)

const initialValues = {
  username: '',
  password: '',
}

function onFormSubmit(data) {
  if (data.valid == true) {
    console.log('Dane zostały przesłane.', data)
  }
}
</script>

<template>
  <div class="outside">
    <Form
      v-slot="$form"
      :resolver="resolver"
      :initialValues="initialValues"
      @submit="onFormSubmit"
      class="loginForm"
    >
      <Image src="../../public/car-wash.png" alt="Image" width="200" />
      <div class="flex flex-col gap-1">
        <InputText name="username" type="text" placeholder="Login" class="field" />
        <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{
          $form.username.error?.message
        }}</Message>
        <Password
          name="password"
          :feedback="false"
          placeholder="Hasło"
          class="field"
          inputClass="field"
        />
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
      <Button type="submit" severity="secondary" label="Zaloguj się" class="field" />
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
  margin-top: 20px;
}
</style>
