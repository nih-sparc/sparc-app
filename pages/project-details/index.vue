<template>
  <div class="project-details">
     <div class="project-details__header">
         <div class="project-details__header--image">
            <img src="http://placehold.jp/368x368.png">
         </div>
         <div class="project-details__header--content">
            <h3>Cardio-Respiratory System: Heart</h3>
            <h2>Comprehensive structural and functional mapping of the mammalian cardiac nervous system</h2>
            <p>
               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
               Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
               Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
               Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
               Lorem ipsum dolor sit amet, consectetur adipiscing...
            </p>
            <div class="project-details__header--content-meta">
                <ul>
                    <li>
                        <h3>Project Number</h3>
                        <p>000000000000</p>
                    </li>
                    <li>
                        <h3>Project Leader</h3>
                        <p>Fynn Blackwell</p>
                    </li>
                    <li>
                        <h3>Institution</h3>
                        <p>University of California Los Angeles</p>
                    </li>
                </ul>
            </div>
            <div class="project-details__header--content-buttons">
                <button @click="getDataset">Get Dataset</button>
                <a href="#">View on NIH Website</a>
            </div>
         </div>
     </div>
     <div class="project-details__info">
         lorem ipsum
     </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectDetails'
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
.project-details {
  margin: 1.25rem;
  &__header {
    display: flex;
    flex-direction: row;
    border: solid 1px $cloudy;
    padding: 1rem;
    max-width: 1248px;
    background: white;
    &--image {
      margin-right: 1rem;
    }
    &--content {
      h3 {
        text-transform: uppercase;
        font-weight: 500;
        line-height: 24px;
        font-size: 14px;
        color: $lightblue;
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
  }
}
</style>