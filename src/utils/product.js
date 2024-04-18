import { computed } from 'vue'
import { ProductCombineEnum } from '@/helpers/enum'
import { isBeautyPlanner } from '@/utils/role'

export const parseDataVariantProduct = (data) => {
  if (!data) {
    return {
      isCombine: false,
      selectedHash: {},
      optionHash: {}
    }
  }

  const isCombine = data.productOptionType?.code === ProductCombineEnum.COMBINATION
  const { items } = data

  const selectedHash = {}
  const optionHashRaw = {}

  items?.forEach((item) => {
    const keyArr = []
    item.values.forEach((v) => {
      const id = v.productCategoryOptionDetailId
      keyArr.push(id)
      if (!optionHashRaw[v.optionName]) {
        optionHashRaw[v.optionName] = {}
      }
      optionHashRaw[v.optionName][id] = v
    })
    selectedHash[keyArr.join('-')] = item
  })

  const optionHash = {}

  for (const key in optionHashRaw) {
    const value = optionHashRaw[key]
    optionHash[key] = Object.values(value)
  }

  return {
    isCombine,
    selectedHash,
    optionHash
  }
}

export const getPointText = computed(() => (isBeautyPlanner.value ? 'BP' : 'P'))
