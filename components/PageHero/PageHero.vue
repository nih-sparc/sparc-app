<template>
<div class="page-hero">
  <div class="bx--grid">
    <div class="container">
      <div class="bx--row">
        <div class="bx--col-sm-4 bx--col-md-8 bx--col-lg-11 bx--col-xlg-11 py-16 text-container">
          <slot />
        </div>
        <div class="bx--col-sm-0 bx--col-md-0 bx--col-lg-5 bx--col-xlg-5">
          <div v-if="$slots['image']" class="graphic-container">
            <slot name="image" />
          </div>
        </div>
      </div>
    </div>
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

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

.page-hero {
  background: $darkBlue;
  color: #f0f2f5;
  font-size: 1em;
  line-height: 1.5rem;
  h1 {
    font-size: 1.75em;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }
  .bx--grid {
    padding: 0;
    .bx--row {
      align-items: center;
      margin: 0;
    }
  }
  @media (min-width: 80em) {
    font-size: 1.25em;
    line-height: 2rem;
  }
  .graphic-container {
    display: flex;
    img, video {
      height: 100%;
      width: stretch;
    }
  }
  .text-container {
    @media (max-width: 80em) {
      padding-left: 1em;
      padding-right: 1em;
    }
    ::v-deep a {
      color: white;
      text-decoration: underline;
    }
  }
}
</style>
