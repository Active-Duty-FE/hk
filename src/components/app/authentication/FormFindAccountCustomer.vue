<template>
  <a-form :model="formState" :rules="rules" @finish="onSubmit">
    <r-label title="Name" :required="true" />
    <a-form-item name="firstName">
      <r-input v-model:value="formState.firstName" placeholder="First Name" />
    </a-form-item>
    <a-form-item name="lastName">
      <r-input v-model:value="formState.lastName" placeholder="Last Name" />
    </a-form-item>

    <r-label title="E-mail" :required="true" />
    <div class="flex gap-2">
      <a-form-item name="email" class="w-full">
        <r-input v-model:value="formState.email" placeholder="abcd@abc.abcd" />
      </a-form-item>
      <r-button
        title="Send"
        type="primary"
        class="!bg-navy-1 !border-navy-1 !min-w-[121px]"
        @click="sendEmail"
      />
    </div>
    <div class="flex gap-2">
      <a-form-item name="code" class="w-full">
        <r-input
          v-model:value="formState.code"
          placeholder="Enter Verification Number from Email"
        />
      </a-form-item>
      <r-button
        title="Certification"
        type="primary"
        class="!bg-navy-2 !border-navy-2 !min-w-[121px]"
        @click="verifyCode"
      />
    </div>
    <div class="flex gap-2">
      <r-button title="Cancel" />
      <r-button
        title="Confirm"
        html-type="submit"
        type="primary"
        class="!bg-navy-1 !border-navy-1 w-full"
      />
    </div>
  </a-form>
</template>
<script setup>
import { reactive } from 'vue'
import { validateRequired } from '@/helpers/handle-validate'

const formState = reactive({
  firstName: '',
  lastName: '',
  email: '',
  code: '',
  match: false
})

const rules = reactive({
  firstName: [{ validator: validateRequired, trigger: 'change' }],
  lastName: [{ validator: validateRequired, trigger: 'change' }],
  email: [{ validator: validateRequired, trigger: 'change' }],
  code: [{ validator: validateRequired, trigger: 'change' }]
})

const onSubmit = (values) => {
  console.log(values)
}

const sendEmail = () => {
  console.log('send email')
}

const verifyCode = () => {
  console.log('verify code')
}
</script>
