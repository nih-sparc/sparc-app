<template>
  <div class="featured-datasets container">
    <div class="home-container">
      <h2>News &amp; Upcoming Events</h2>
      <sparc-card
        image="https://placeholder.pics/svg/544x394"
        image-alt="2020 SPARC Ideas Lab"
      >
        <h3>2020 SPARC Ideas Lab</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo commodo consequat.
        </p>
        <p><a href="#">Learn More</a></p>
      </sparc-card>

      <sparc-card
        image="https://placeholder.pics/svg/544x394"
        image-alt="2020 SPARC Ideas Lab"
        image-align="right"
      >
        <h3>2020 SPARC Ideas Lab</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo commodo consequat.
        </p>
        <p><a href="#">Learn More</a></p>
      </sparc-card>
    </div>
  </div>
</template>

<script>
import SparcCard from '@/components/SparcCard/SparcCard.vue'

export default {
  name: 'HomepageNews',

  components: {
    SparcCard
  },

  data: function() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
.home-container {
  padding-left: 1rem;
  padding-right: 1rem;
  @media (min-width: 768px) {
    padding-left: 6rem;
    padding-right: 6rem;
  }
}
.sparc-card {
  margin-bottom: 24px;
  @media (min-width: 768px) {
    margin-bottom: 40px;
  }
}
</style>
