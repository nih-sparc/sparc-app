<template>
  <div class="details-header">
    <div class="details-header__container">
      <div class="details-header__container--image">
        <img src="http://placehold.jp/368x368.png" />
      </div>
      <div class="details-header__container--content">
        <h3>Cardio-Respiratory System: Heart</h3>
        <h2>
          Comprehensive structural and functional mapping of the mammalian cardiac nervous system
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          Lorem ipsum dolor sit amet, consectetur adipiscing...
        </p>
        <div class="details-header__container--content-meta">
          <div class="content-meta__item">
            <h3>Project Number</h3>
            <p>000000000000</p>
          </div>
          <div class="content-meta__item">
            <h3>Project Leader</h3>
            <p>Fynn Blackwell</p>
          </div>
          <div class="content-meta__item">
            <h3>Institution</h3>
            <p>University of California Los Angeles</p>
          </div>
        </div>
        <div class="details-header__container--content-links">
          <a href="#">View on NIH Website</a>
        </div>
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
    background: white;
    &--image {
      margin-right: 1rem;
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
        font-size: 14px;
        font-weight: normal;
        line-height: 24px;
      }
    }
    &--content-meta {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      margin-left: -11.2rem;
    }

    &--content-links {
      a {
        font-size: 12px;
        color: $median;
        font-weight: bold;
        line-height: 24px;
        margin-left: 1rem;
      }
    }
    .content-meta__item {
      h3 {
        color: black;
        margin-bottom: -4rem;
      }
      p {
        padding-top: 3rem;
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