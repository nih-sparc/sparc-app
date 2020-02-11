<template>
  <div
    class="sparc-card"
    :class="{ 'sparc-card--image-right': imageAlign === 'right' }"
  >
    <div class="sparc-card__image">
      <img :src="image" :alt="imageAlt" />
    </div>

    <div class="sparc-card__content-wrap">
      <div class="sparc-card__content-wrap__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SparcCard',

  props: {
    image: {
      type: String,
      default: ''
    },
    imageAlt: {
      type: String,
      default: ''
    },
    imageAlign: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
$image-fixed: 350px;
$sparc-card-bp: 1024px;
.sparc-card {
  /*background: #24245b;*/
  @media (min-width: $sparc-card-bp) {
    display: flex;
  }
  &--image-right {
    .sparc-card__image {
      @media (min-width: $sparc-card-bp) {
        order: 2;
      }
    }
  }
  &__image {
    @media (min-width: $sparc-card-bp) {
      flex: 0 0 $image-fixed;
      max-height: $image-fixed;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  &__image,
  &__content-wrap {
    @media (min-width: $sparc-card-bp) {
      min-height: $image-fixed;
      display: flex;
    }
    &__content {
      background: #24245b;
      color: #fff;
      font-size: 0.75em;
      line-height: 1.3125rem;
      padding: 1em;

      @media (min-width: $sparc-card-bp) {
        font-size: 1.125em;
        line-height: 2rem;
        padding: 3em;
      }

      a {
        color: #fff;
        text-decoration: none;
        &:hover,
        &:focus {
          text-decoration: underline;
        }
      }

      p {
        max-width: 80%;
      }
    }
  }
}
</style>
