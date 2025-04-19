<template>
  <div class="container shop-main">
    <RouterView v-slot="{ Component }">
      <component
        :is="Component"
        class="shop-main__page"
      />
    </RouterView>
  </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
.shop-main {
  @apply w-full h-full;
  &__page {
    @apply w-full h-full;
    @apply bg-blue-100;
  }
}
</style>