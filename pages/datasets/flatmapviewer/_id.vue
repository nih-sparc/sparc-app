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
        <div class="file-detail">
          <strong class="file-detail__column">taxo</strong>
          <div class="file-detail__column">
            {{ taxo }}
          </div>
        </div>
        <div class="file-detail">
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
export default {
  name: 'FlatmapViewerPage',
  components: {
    DetailTabs,
    FlatmapVuer: process.client
      ? () => import('@abi-software/flatmapvuer').then(m => m.FlatmapVuer)
      : null
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
    flatmapReady: function(component) {
      let id = this.checkForIlxtr(this.uberonid)
      component.mapImp.zoomTo(id)
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
