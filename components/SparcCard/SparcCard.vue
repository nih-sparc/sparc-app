<template>
  <div
    class="sparc-card"
    :class="{ 'sparc-card--image-right': imageAlign === 'right' }"
  >
    <div class="sparc-card__image" :style="`background-image: url(${image})`">
      <img class="visuallyhidden" :src="image" :alt="imageAlt" />
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
.sparc-card {
  @media (min-width: 768px) {
    display: flex;
  }
  &--image-right {
    .sparc-card__image {
      @media (min-width: 768px) {
        order: 2;
      }
    }
  }
  &__image {
    background-size: cover;
    background-position: center;
    height: 206px;
    @media (min-width: 768px) {
      height: auto;
    }
  }
  &__image,
  &__content-wrap {
    flex: 1 0 0em; // Unit required for IE11
    &__content {
      background: #24245b;
      color: #fff;
      font-size: 0.75em;
      line-height: 1.3125rem;
      padding: 1em;

      @media (min-width: 768px) {
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
