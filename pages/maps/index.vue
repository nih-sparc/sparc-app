<template>
  <div class="maps">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h1>Maps</h1>
      <p>
        SPARC is creating a detailed PNS map based on SPARC data and information
        available from the literature. The map you see represents the current
        state of the SPARC connectivity database and is not comprehensive. New
        connectivity will be added as the SPARC program progresses.
      </p>
    </page-hero>
    <div ref="mappage" class="page-wrap portalmapcontainer">
      <client-only placeholder="Loading...">
        <div class="mapClass">
          <MapContent />
        </div>
      </client-only>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
export default {
  name: 'MapsPage',

  components: {
    Breadcrumb,
    PageHero,
    MapContent: process.client
      ? () => import('@abi-software/mapintegratedvuer').then(m => m.MapContent)
      : null
  },

  data() {
    return {
      resources: [],
      title: 'Maps',
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

  methods: {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.maps {
  .page-hero__copy p {
    @media (min-width: 48em) {
      font-size: 0.9375rem;
      line-height: 1.5rem;
    }
  }

  .portalmapcontainer {
    margin-top: 1.5rem;
    height: 90vh;
    max-width: calc(100% - 48px);
    padding-left: 24px;
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
<style lang="scss">
.mapClass {
  position: relative;
  width: 100%;
  height: 100%;
  border: solid 1px #dcdfe6;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.06);
  @import '~@abi-software/mapintegratedvuer/dist/mapintegratedvuer';
}
</style>
<style
  src="@abi-software/mapintegratedvuer/assets/mapicon-species-style.css"
></style>
