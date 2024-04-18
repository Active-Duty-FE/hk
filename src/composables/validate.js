import { Form } from 'ant-design-vue'
import { nextTick, ref, watch } from 'vue'

const useForm = Form.useForm

export default function useValidate(modelRef, ruleRef, options) {
  const isValid = ref(false)

  watch(
    () => modelRef,
    async () => {
      await nextTick()
      try {
        await useForm(modelRef, ruleRef, options).validate()
        isValid.value = true
      } catch {
        isValid.value = false
      }
    },
    {
      deep: true,
      immediate: true
    }
  )

  return isValid
}
