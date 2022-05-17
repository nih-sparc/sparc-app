<template>
  <div class="flatmap-viewer-page">
    <div class="page-wrap container">
      <detail-tabs
        :tabs="tabs"
        :active-tab="activeTab"
        class="container"
        @set-active-tab="activeTab = $event"
      >
        <client-only placeholder="Loading flatmap ...">
          <div class="flatmap-container">
            <FlatmapVuer
              ref="flatmap"
              :entry="taxo"
              :name="taxo"
              style="height:100%;width:100%;"
              :display-minimap="false"
              :flatmap-a-p-i="flatmapAPI"
              @ready="flatmapReady"
            />
          </div>
        </client-only>
      </detail-tabs>
      <div class="subpage">
        <div class="page-heading" />
        <div class="file-detail">
          <strong class="file-detail__column">File Details</strong>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">Type</strong>
          <div class="file-detail__column">
            Flatmap
          </div>
        </div>
        <div class="file-detail" v-if="species">
          <strong class="file-detail__column">Species</strong>
          <div class="file-detail__column">
            {{ capitalize(species) }}
          </div>
        </div>
        <div class="file-detail" v-else>
          <strong class="file-detail__column">taxo</strong>
          <div class="file-detail__column">
            {{ taxo }}
          </div>
        </div>
        <div class="file-detail" v-if="organ_name">
          <strong class="file-detail__column">Organ</strong>
          <div class="file-detail__column">
            {{ capitalize(organ_name) }}
          </div>
        </div>
        <div class="file-detail" v-else>
          <strong class="file-detail__column">uberon</strong>
          <div class="file-detail__column">
            {{ uberonid }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">Dataset id</strong>
          <div class="file-detail__column">
            {{ datasetId }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">Version</strong>
          <div class="file-detail__column">
            {{ versionNumber }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import idMaps from '@/static/js/uberon-map.js'
import flatmaps from '@/services/flatmaps'
import scicrunch from '@/services/scicrunch'
import FormatString from '@/mixins/format-string'

import { failMessage } from '@/utils/notification-messages'

export default {
  name: 'FlatmapViewerPage',
  components: {
    DetailTabs,
    FlatmapVuer: process.client
      ? () => import('@abi-software/flatmapvuer').then(m => m.FlatmapVuer)
      : null
  },

  mixins: [ FormatString ],

  async asyncData({ route }) {
    //Get the organ name from uberon id
    const uberonid = route.query.uberonid
    let organ_name = undefined
    try {
      organ_name = await scicrunch.getOrganFromUberonId(uberonid)
    } catch (e) {
      // Error caught return empty data.
    }
    return {
      organ_name
    }
  },
  data: () => {
    return {
      tabs: [
        {
          label: 'Flatmap Viewer',
          type: 'flatmap'
        }
      ],
      activeTab: 'flatmap',
      file: {},
      flatmapAPI: process.env.flatmap_api
    }
  },
  computed: {
    /**
     * Get the taxo from the query parameter.
     * @returns String
     */
    taxo: function() {
      return this.$route.query.taxo
    },
    /**
     * Get the species name using the static mapping
     * @returns String
     */
    species: function() {
      for (const [key, value] of Object.entries(idMaps.species)) {
        if (value === this.$route.query.taxo) return key
      }
      return undefined
    },
    /**
     * Get the species name of the dataset. This is used if the datasts's species does not have a flatmap. (It will then use a rat flatmap)
     * @returns String
     */
    forSpecies: function() {
      return this.$route.query.for_species
    },
    /**
     * Get the uberon id from the query parameter.
     * @returns Number
     */
    uberonid: function() {
      return this.$route.query.uberonid
    },
    /**
     * Get the organ from the query parameter.
     * @returns Number
     */
    organ: function() {
      return this.$route.query.organ
    },
    /**
     * Return the dataset id from the route query.
     * @returns String
     */
    datasetId: function() {
      return this.$route.query.dataset_id
    },
    /**
     * Return the version number from the route query.
     * @returns String
     */
    versionNumber: function() {
      return this.$route.query.dataset_version
    }
  },
  mounted: function() {
    this.checkSpeciesMatch()
  },
  methods: {
    flatmapReady: function(component) {
      let id = this.checkForIlxtr(this.uberonid)
      component.mapImp.zoomToFeatures(id)

      // **NOTE: This is commented out until fCCB approves the popups
      // component.checkAndCreatePopups({
      //   resource: [id],
      //   eventType: 'click'
      // })
    },
    checkForIlxtr: function(id) {
      if (id.includes('neuron-type-keast') && !id.includes('ilxtr')) {
        return 'ilxtr:' + id
      }
      return id
    },
    checkSpeciesMatch: function() {
      if (
        this.forSpecies &&
        this.forSpecies !== flatmaps.speciesMap[this.taxo] // if they don't match, we know that a rat was used
      ) {
        this.$message(
          failMessage(
            `Sorry! A flatmap for a ${this.forSpecies} does not yet exist. The ${this.organ} of a rat has been shown instead.`
          )
        )
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  display: flex;
  margin-top: 7rem;
  p {
    color: #606266;
  }
}
.about {
  text-align: center;
  min-height: 50vh;
  margin-top: 9rem;
}
h1 {
  flex: 1;
  font-size: 1.5em;
  line-height: 2rem;
}
.page-heading {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.375rem;
  @media (min-width: 48em) {
    flex-direction: row;
  }
}
.page-heading__button {
  flex-shrink: 0;
}
.file-detail {
  border-bottom: 1px solid #dbdfe6;
  flex-direction: column;
  font-size: 0.875em;
  display: flex;
  padding: 1rem 0.625rem;
  @media (min-width: 48em) {
    flex-direction: row;
  }
}
.file-detail__column {
  flex: 1;
}
</style>
<style lang="scss">
.flatmap-container {
  margin-top: 1.5rem;
  height: 90vh;
  max-width: calc(100% - 48px);
  padding-left: 24px;
  @import '~@abi-software/flatmapvuer/dist/flatmapvuer';
}
</style>
