<template>
  <a-back-top class="custom-back-top">
    <div class="ant-back-top-inner">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="84"
        height="84"
        viewBox="0 0 84 84"
        fill="none"
      >
        <g filter="url(#filter0_d_1803_26204)">
          <circle cx="42" cy="42" r="30" fill="white" />
        </g>
        <path
          d="M41.25 49.5C41.25 49.9142 41.5858 50.25 42 50.25C42.4142 50.25 42.75 49.9142 42.75 49.5H41.25ZM42.5303 33.9697C42.2374 33.6768 41.7626 33.6768 41.4697 33.9697L36.6967 38.7426C36.4038 39.0355 36.4038 39.5104 36.6967 39.8033C36.9896 40.0962 37.4645 40.0962 37.7574 39.8033L42 35.5607L46.2426 39.8033C46.5355 40.0962 47.0104 40.0962 47.3033 39.8033C47.5962 39.5104 47.5962 39.0355 47.3033 38.7426L42.5303 33.9697ZM42.75 49.5V34.5H41.25V49.5H42.75Z"
          fill="#123250"
        />
        <defs>
          <filter
            id="filter0_d_1803_26204"
            x="0"
            y="0"
            width="84"
            height="84"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="6" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1803_26204"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1803_26204"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  </a-back-top>
</template>
<script setup></script>
<style lang="scss" scoped>
.ant-back-top {
  right: 72px;
  bottom: 140px;
}

@media (max-width: 991px) {
  .ant-back-top {
    right: 60px;
    z-index: 19;
    bottom: 80px;
  }
}
</style>
