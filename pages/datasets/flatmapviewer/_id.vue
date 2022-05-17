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
          <strong class="file-detail__column_1">Type</strong>
          <div class="file-detail__column_2">
            Flatmap
          </div>
        </div>
        <div v-if="species" class="file-detail">
          <strong class="file-detail__column_1">Species</strong>
          <div class="file-detail__column_2">
            {{ capitalize(species) }}
          </div>
        </div>
        <div v-else class="file-detail">
          <strong class="file-detail__column_1">taxo</strong>
          <div class="file-detail__column_2">
            {{ taxo }}
          </div>
        </div>
        <div v-if="organ_name" class="file-detail">
          <strong class="file-detail__column_1">Organ</strong>
          <div class="file-detail__column_2">
            {{ capitalize(organ_name) }}
          </div>
        </div>
        <div v-else class="file-detail">
          <strong class="file-detail__column_1">uberon</strong>
          <div class="file-detail__column_2">
            {{ uberonid }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column_1">Dataset id</strong>
          <div class="file-detail__column_2">
            {{ datasetId }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column_1">Version</strong>
          <div class="file-detail__column_2">
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
import scicrunch from '@/services/scicrunch'
import FormatString from '@/mixins/format-string'

export default {
  name: 'FlatmapViewerPage',
  components: {
    DetailTabs,
    FlatmapVuer: process.client
      ? () => import('@abi-software/flatmapvuer').then(m => m.FlatmapVuer)
      : null
  },

  mixins: [FormatString],

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
     * Get the uberon id from the query parameter.
     * @returns Number
     */
    uberonid: function() {
      return this.$route.query.uberonid
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
  methods: {
<<<<<<< HEAD
    flatmapReady: function(/*component*/) {
      /*let id = this.checkForIlxtr(this.uberonid)
      component.mapImp.zoomTo(id)
=======
    flatmapReady: function(component) {
      let id = this.checkForIlxtr(this.uberonid)
      component.mapImp.zoomToFeatures(id)
>>>>>>> main

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
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/_viewer.scss';
</style>
