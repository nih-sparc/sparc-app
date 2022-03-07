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
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 400;
  color: white;
  h1 {
    font-size: 2em;
    line-height: 2.75rem;
    font-weight: 500;
    color: white;
  }
  .bx--grid {
    padding: 0;
    .bx--row {
      align-items: center;
      margin: 0;
    }
  }
  .graphic-container {
    display: flex;
    img, video {
      height: 100%;
      width: 100%;
    }
  }
  .text-container {
    @media (max-width: 80em) {
      padding-left: 1em;
    }
    ::v-deep a {
      color: white;
      text-decoration: underline;
    }
  }
}
</style>
