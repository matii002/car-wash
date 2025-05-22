<script setup>
import { Form } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import * as yup from 'yup'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { InputMask } from 'primevue'
import Textarea from 'primevue/textarea'
import { db } from '@/firebase'
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore'
import DatePicker from 'primevue/datepicker'
import { onMounted, ref } from 'vue'
import MultiSelect from 'primevue/multiselect'
import { fetchServices } from '../services.js'
import { useRouter } from 'vue-router'

const services = ref([])

const router = useRouter()

onMounted(async () => {
  services.value = await fetchServices()
})

const toast = useToast()

let resolver = yupResolver(
  yup.object().shape({
    name: yup
      .string()
      .required('Nazwa klienta jest wymagana.')
      .min(3, 'Nazwa klienta jest niepoprawna.'),
    car: yup
      .string()
      .required('Marka i model samochodu jest wymagany.')
      .min(2, 'Nazwa samochodu jest niepoprawna.'),
    service: yup
      .array()
      .of(yup.string())
      .required('Wybierz rodzaj usługi.')
      .min(1, 'Rodzaj usługi jest niepoprawny.'),
    phone: yup
      .string()
      .required('Telefon jest wymagany.')
      .min(9, 'Numer telefonu jest niepoprawny.'),
    email: yup.string().required('Email jest wymagany.').min(5, 'Email jest niepoprawny.'),
    date: yup
      .date()
      .typeError('Wybierz poprawną datę i godzinę.')
      .test('is-within-working-hours', 'Wybierz godzinę między 08:00 a 14:59', (value) => {
        if (!value) return false
        const hour = value.getHours()
        return hour >= 8 && hour < 15
      }),
    licensePlate: yup
      .string()
      .required('Numer rejestracyjny jest wymagany.')
      .min(5, 'Numer rejestracyjny jest niepoprawny.'),
    description: yup.string(),
  }),
)

const initialValues = {
  name: '',
  car: '',
  service: '',
  phone: '',
  email: '',
  date: '',
  licensePlate: '',
  description: '',
}

async function onFormSubmit({ valid, values }) {
  if (valid == true) {
    try {
      await addDoc(collection(db, 'washingOrders'), {
        ...values,
        isFinished: false,
        isAccepted: false,
        createdAt: serverTimestamp(),
        date: Timestamp.fromDate(values.date),
        service: values.service.join(', '),
      })
      console.log('Dane zostały przesłane.', valid)
      toast.add({
        severity: 'success',
        summary: 'Umówiono usługę!',
        detail: 'Wybrana usługa została umówiona.',
        life: 5000,
      })

      setTimeout(() => {
        router.push('/')
      }, 6000)
    } catch (error) {
      console.log('Błąd podczas przesyłania formualrza.', error)
      toast.add({
        severity: 'error',
        summary: 'Nie udało się przesłać formularza.',
        detail: 'Spróbuj ponownie.',
        life: 3000,
      })
    }
  }
}
</script>

<template>
  <Toast />
  <h1>Rezerwacja usługi</h1>

  <div class="form-container">
    <Form
      v-slot="$form"
      :initialValues="initialValues"
      :resolver="resolver"
      @submit="onFormSubmit"
      class="form"
    >
      <div class="flex flex-col gap-1">
        <InputText
          name="name"
          type="text"
          placeholder="Nazwa klienta / firmy"
          fluid
          style="margin-top: 1rem"
        />
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{
          $form.name.error?.message
        }}</Message>
        <InputText
          name="car"
          type="text"
          placeholder="Nazwa samochodu"
          fluid
          style="margin-top: 1rem"
        />
        <Message v-if="$form.car?.invalid" severity="error" size="small" variant="simple">{{
          $form.car.error?.message
        }}</Message>
        <MultiSelect
          name="service"
          placeholder="Wybierz usługę"
          :options="services"
          optionLabel="name"
          optionValue="name"
          fluid
          style="margin-top: 1rem"
        />

        <Message v-if="$form.service?.invalid" severity="error" size="small" variant="simple">{{
          $form.service.error?.message
        }}</Message>
        <InputMask
          name="phone"
          mask="(+48) 999-999-999"
          placeholder="Telefon"
          fluid
          style="margin-top: 1rem"
        />
        <Message v-if="$form.phone?.invalid" severity="error" size="small" variant="simple">{{
          $form.phone.error?.message
        }}</Message>
        <InputText name="email" type="email" placeholder="Email" fluid style="margin-top: 1rem" />
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
          $form.email.error?.message
        }}</Message>
        <InputText
          name="licensePlate"
          type="text"
          placeholder="Numer rejestracyjny"
          fluid
          style="margin-top: 1rem"
        />
        <Message
          v-if="$form.licensePlate?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.licensePlate.error?.message }}</Message
        >
        <DatePicker
          id="datepicker-24h"
          name="date"
          placeholder="Data"
          showTime
          hourFormat="24"
          :manualInput="false"
          :disabledDays="[0, 6]"
          fluid
          style="margin-top: 1rem"
        />
        <Message v-if="$form.date?.invalid" severity="error" size="small" variant="simple">{{
          $form.date.error?.message
        }}</Message>
        <Textarea
          name="description"
          rows="3"
          style="width: 100%; margin-top: 1rem"
          placeholder="Uwagi, prośby, odbiór samochodu o godzinie, inne usługi"
        />
        <Message v-if="$form.description?.invalid" severity="error" size="small" variant="simple">{{
          $form.description.error?.message
        }}</Message>
      </div>
      <Button type="submit" severity="success" label="Prześlij" style="width: 100%" />
    </Form>
  </div>
</template>

<style>
h1 {
  text-align: center;
  margin: 1rem 0;
}
.form-container {
  display: flex;
  justify-content: center;
  height: 100vh;
}
form {
  width: 320px;
}
</style>
