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
$image-fixed-small: 250px;
$image-fixed-large: 350px;
$tablet-small: 768px;
$tablet-large: 1024px;
.sparc-card {
  @media (min-width: $tablet-small) {
    display: flex;
  }
  &--image-right {
    .sparc-card__image {
      @media (min-width: $tablet-small) {
        order: 2;
      }
    }
  }
  &__image {
    @media (min-width: $tablet-small) {
      flex: 0 0 $image-fixed-small;
      max-height: $image-fixed-small;
    }
    @media (min-width: $tablet-large) {
      flex: 0 0 $image-fixed-large;
      max-height: $image-fixed-large;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  &__image,
  &__content-wrap {
    @media (min-width: $tablet-small) {
      min-height: $image-fixed-small;
      display: flex;
    }
    @media (min-width: $tablet-large) {
      min-height: $image-fixed-large;
      display: flex;
    }
    &__content {
      background: #24245b;
      color: #fff;
      font-size: 0.75em;
      line-height: 1.3125rem;
      padding: 1em;

      display: flex;
      flex-direction: column;
      justify-content: space-between;

      @media (min-width: $tablet-small + 1) and (max-width: $tablet-large) {
        font-size: 1em;
        line-height: 2rem;
        padding: 2em;
      }
      @media (min-width: $tablet-large + 1) {
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
