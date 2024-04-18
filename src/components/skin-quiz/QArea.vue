<template>
  <div class="flex w-full flex-col px-[30px] md:px-[90px]">
    <div
      class="style-normal flex w-full justify-center pb-[45px] pt-[50px] text-[22px] font-medium leading-[22px] text-white md:pb-[50px] md:pt-[65px]"
    >
      <div class="w-[80%] md:w-[239px]">
        {{ stepInfo?.title }}.
        <br />
        {{ stepInfo?.subTitle }}
      </div>
    </div>
    <QItem
      v-for="(item, index) in stepInfo?.steps"
      :key="item.title"
      :item-info="item"
      :is-selected="index === answerIndex"
      @click="selectAnswer(index)"
    />
  </div>
</template>
<script setup>
defineProps({
  stepInfo: {
    type: Object,
    default: undefined
  },
  answerIndex: {
    type: Number,
    default: -1
  }
})

const emits = defineEmits(['onAnswer'])

const selectAnswer = (index) => {
  emits('onAnswer', index)
}
</script>
