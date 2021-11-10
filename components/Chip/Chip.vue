<template>
  <span>
    <slot />
  </span>
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
span {
  background: $median;
  border-radius: 15px;
  color: #fff;
  font-size: 0.875rem;
  padding: 0 0.65rem;
}
</style>
