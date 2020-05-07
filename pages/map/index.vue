<template>
  <div class="map">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h1>Map</h1>
      <div class="sideText">
        Interactive maps reveal the anatomy and functional
          relationships of the autonomic nerves and the organs that they
          innervate. 2D and 3D maps render spatial dynamics, connectivity, and
          physiology across a range of species and nerve-organ systems.
      </div>
    </page-hero>
    <div class="page-wrap portalmapcontainer">
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
process.client ? import('@abi-software/mapintegratedvuer/dist/mapintegratedvuer.css') : null

export default {
  name: 'Map',

  components: {
    Breadcrumb,
    PageHero,
    MapContent: process.client ? () => import('@/components/MapApp/MapApp') : null
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

  .sideText{
    top: 0px;
    font-size:0.8em;
    position:absolute;
    line-height:1.2em;
    width:40em;
    margin-left:6em; 
  }

  .portalmapcontainer {
    margin-top: 1.5rem;
    height:90vh;
    max-width:none;

    @media screen and (min-width: 1440px) {
      width: 1393px;
      height: 778px;
      padding-left:24px;
    }

    @media screen and (min-width: 1920px) {
      width: 1851px ;
      height: 938px ;
      padding-left:34px;
    }
  }
  .map-app {
    position:relative;
    width:100%;
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
