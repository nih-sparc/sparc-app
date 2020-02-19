<template>
  <div class="page-hero">
    <div class="container">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHero',
  props: {
    justify: {
      type: String,
      default: 'center'
    }
  }
}
</script>

<style lang="scss">
.page-hero {
  background: #24245b;
  color: #f0f2f5;
  font-size: 1em;
  line-height: 1.5rem;
  padding: 2rem 1rem;
  @media (min-width: 768px) {
    font-size: 1.25em;
    line-height: 2rem;
    padding: 2.5rem 0;
  }
  h1 {
    font-size: 1.75em;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }
  p:last-child {
    margin: 0;
  }
}
</style>
