<template>
  <div class="mb-10">
    <h3 class="review__heading capitalize">Product reviews</h3>

    <ProductReviewPopup
      v-if="formState.isShowReviewPopup"
      v-model:visible="formState.isShowReviewPopup"
      :item="formState.productReviewSelect"
      :image-selected-index="formState.imageSelectedIndex"
    />

    <div class="flex flex-col">
      <div class="review__total">
        <RRate :value="totalRate" class="review__total-rate" disabled />
        <span class="review__total-description">Ratings and reviews</span>
        <span class="review__total-count">({{ formState.totalSize }})</span>
      </div>

      <ProductReviewForm :is-reviewed="isReviewed" @create-success="createSuccess" />
    </div>

    <div v-if="formState.reviewList.length" class="review__items">
      <ProductReviewItem
        v-for="item in formState.reviewList"
        :key="item.id"
        :item="item"
        @click-file="openProductReviewPopup"
      />
    </div>

    <div v-else class="my-20 flex items-center justify-center">Be the first to add a review.</div>

    <RButton
      v-if="isShowMoreReview"
      title="More"
      class="!border-gray-10 mx-auto mb-[30px] w-full md:mb-[200px] md:w-[390px]"
      class-title="text-gray-10 text-base md:text-lg font-550"
      @click="getMoreReview"
    >
      <template #content>
        <img src="@/assets/svgs/add.svg?url" alt="add" class="mb-1" />
      </template>
    </RButton>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, watch } from 'vue'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useRoute } from 'vue-router'

const storeLoading = useGlobalLoadingStore()
const { showGlobalLoading } = storeLoading
const route = useRoute()
const emits = defineEmits(['create-success'])
defineProps({
  totalRate: {
    type: Number,
    default: 0
  },
  isReviewed: {
    type: Boolean,
    default: false
  }
})

const formState = reactive({
  isShowReviewPopup: false,
  reviewList: [],
  productReviewSelect: {},
  imageSelectedIndex: 0,
  pageNumber: 1,
  pageSize: 10,
  totalSize: 0
})

const openProductReviewPopup = ({ index, data }) => {
  formState.imageSelectedIndex = index
  formState.productReviewSelect = data
  formState.isShowReviewPopup = true
}

onMounted(() => {
  fetchData()
})

const isShowMoreReview = computed(
  () => formState.pageNumber * formState.pageSize < formState.totalSize
)

const fetchData = async () => {
  formState.pageNumber = 1

  showGlobalLoading(true)
  const { data } = await apiService.productService.getReviewListByProduct(route.params.productId, {
    pageNumber: formState.pageNumber,
    pageSize: formState.pageSize
  })
  formState.totalSize = data.totalSize
  formState.reviewList = data.list.filter((item) => item.approvedYn)
  showGlobalLoading(false)
}

const getMoreReview = async () => {
  showGlobalLoading(true)
  formState.pageNumber++
  const { data } = await apiService.productService.getReviewListByProduct(route.params.productId, {
    pageNumber: formState.pageNumber,
    pageSize: formState.pageSize
  })
  formState.reviewList.push(...data.list)
  showGlobalLoading(false)
}

const createSuccess = () => {
  fetchData()
  emits('create-success')
}

watch(
  () => route.params,
  () => {
    if (route.params?.productId) {
      Object.assign(formState, {
        isShowReviewPopup: false,
        reviewList: [],
        productReviewSelect: {},
        imageSelectedIndex: 0,
        pageNumber: 1,
        pageSize: 10,
        totalSize: 0
      })
      fetchData()
    }
  }
)
</script>

<style lang="scss" scoped>
.review {
  &__heading {
    @apply font-550 mb-5 mt-[70px] text-[32px];
    @apply md:mt-[200px] md:text-[40px];
  }

  &__total {
    @apply border-b-1 border-gray-10 border-b-solid py-12.5 flex flex-col items-center justify-center px-5;

    &-rate {
      @apply text-navy-1 mb-4 text-[25px] leading-none md:text-[35px];
    }

    &-description {
      @apply text-gray-10 leading-base mb-2.5 text-xs font-normal md:text-base;
    }

    &-count {
      @apply text-gray-10 text-sm font-normal -tracking-[0.32px] md:text-base;
    }
  }
}

.review__items {
  @apply flex flex-col gap-10;
}
</style>
