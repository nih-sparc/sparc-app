<template>
  <div class="details-header">
    <div class="details-header__container">
      <div class="details-header__container--image">
        <slot name="banner image" />
      </div>
      <div class="details-header__container--content">
        <slot name="subtitle" />
        <slot name="title" />
        <slot name="description" />
        <slot name="meta content" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailsHeader'
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
.details-header {
  margin: 1.25rem;
  &__container {
    display: flex;
    flex-direction: row;
    border: solid 1px $cloudy;
    padding: 1rem;
    padding-top: 0;
    background: white;
    &--image {
      margin-right: 1rem;
      margin-top: 2rem;
      .dataset-image {
        border: solid 1px $cloudy;
      }
    }
    &--content {
      padding-top: 1.53rem;
      h3 {
        text-transform: uppercase;
        font-weight: 500;
        line-height: 24px;
        font-size: 14px;
        color: $medium-gray;
      }
      h2 {
        font-weight: 500;
        font-size: 24px;
        line-height: 32px;
      }
      p {
        font-size: 16px;
        font-weight: normal;
        line-height: 28px;
      }
    }
    &--content-meta {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
    }

    &--content-links {
      a {
        font-size: 12px;
        color: $median;
        font-weight: bold;
        line-height: 24px;
        margin-left: 1rem;
      }
      button {
        background: $median;
        height: 2.5rem;
        width: 12rem;
        border-radius: 4px;
        a {
          color: white;
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          text-decoration: none;
          margin-left: 0;
        }
      }
    }
    .content-meta__item {
      margin-right: 5.3rem;
      h3 {
        color: black;
        margin-bottom: -4rem;
      }
      p {
        padding-top: 3rem;
        margin-top: 0.5rem;
      }
    }

    &--dataset-description {
      font-size: 14px !important;
      font-weight: normal;
      line-height: 24px !important;
      color: black;
      margin-bottom: 3rem;
    }

    .header-stats-section {
      display: flex;
      margin: 40px 0 0;
    }

    .header-stats-block {
      align-items: center;
      display: flex;
      font-size: 14px;
      font-weight: 500;
      margin-right: 12px;
      margin-bottom: 1rem;
      .svg-icon {
        margin-right: 3px;
      }
      a {
        &:focus {
          color: #1c46bd;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .details-header {
    margin: 0;
    margin-top: 1.5rem;
    &__container {
      flex-direction: column;
    }
  }
}
</style>
