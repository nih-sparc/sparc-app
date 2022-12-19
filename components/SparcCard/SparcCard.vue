<template>
  <div
    class="sparc-card"
    :class="{ 'sparc-card--image-right': imageAlign === 'right' }"
  >
    <div
      v-if="!$slots.image"
      class="sparc-card__image"
      :style="`background-image: url(${image})`"
    >
      <img class="visuallyhidden" :src="image" :alt="imageAlt" />
    </div>
    <slot name="image" class="sparc-card__image" />

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
$tablet-small: 48em;
$tablet-large: 64em;
.sparc-card {
  display: flex;
  &--image-right {
    .sparc-card__image {
      @media (min-width: $tablet-small) {
        order: 2;
      }
    }
  }
  &__image-container {
    display: flex;
    visibility: visible;
    background-color: white;
    width: 30%;
    @media (max-width: $tablet-small) {
      display: none;
    }
  }
  &__image {
    width: 100%;
    max-height: 17.562rem;
    margin: auto;
    object-fit: cover;
  }
  &__content-wrap {
    flex: 1;
    background: #24245b;
  }
  &__image,
  &__content-wrap {
    flex: 1 0 0em; // Unit required for IE11
    &__content {
      color: #fff;
      font-size: 0.75em;
      line-height: 1.3125rem;
      padding: 1em;

      display: flex;
      flex-direction: column;
      justify-content: space-between;

      @media (min-width: $tablet-small) and (max-width: $tablet-large) {
        font-size: 1em;
        line-height: 2rem;
        padding: 2em;
      }
      @media (min-width: $tablet-large) {
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
