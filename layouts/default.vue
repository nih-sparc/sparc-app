<template>
  <div>
    <sparc-header />
    <nuxt />
    <sparc-footer />
  </div>
</template>

<script>

  import sparcHeader from "@/components/header/Header.vue"
  import sparcFooter from "@/components/footer/Footer.vue";

export default {
  components: {
    sparcHeader,
    sparcFooter
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

</style>
