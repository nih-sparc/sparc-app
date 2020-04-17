<template>
  <div class="map">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h1>Map</h1>
      <p>
        Interactive Map
      </p>
    </page-hero>
    <div class="page-wrap container">
      <client-only placeholder="Loading...">
        <div class="map-app">
          <MapContent />
        </div>
      </client-only>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
process.client ? import('@abi-software/mapintegratedvuer') : null
process.client ? import('@abi-software/mapintegratedvuer/dist/mapintegratedvuer.css') : null

export default {
  name: 'Map',

  components: {
    Breadcrumb,
    PageHero,
  },

  data() {
    return {
      resources: [],
      title: 'Map',
      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        }
      ]
    }
  },


  methods: {
 

  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.map {

  .container {
    margin-top: 1.5rem;
    height:45em;

  }
  .map-app {
    position:absolute;
    width:95%;
    height:100%;
    border: solid 1px #dcdfe6;
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.06);
  }
  .page-wrap {
    &__results {
      font-size: 0.875em;
      font-weight: normal;
      line-height: 1em;

      @media screen and (max-width: 768px) {
        margin-left: 0.9375rem;
      }

      p {
        margin-top: 1.5rem;
      }
    }
    @media (min-width: 48em) {
      padding-top: 0;
    }
  }

}
</style>
