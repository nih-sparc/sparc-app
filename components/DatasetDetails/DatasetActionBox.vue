<template>
  <div class="dataset-action-box">
    <dataset-banner-image :src="datasetImage" />
    <sparc-pill v-if="datasetInfo.embargo">
      Embargoed
    </sparc-pill>
    <div v-if="datasetType === 'simulation' && datasetInfo.study">
      <a
        :href="`https://osparc.io/study/${getSimulationId}`"
        target="_blank"
        class="dataset-button-link"
      >
        <el-button class="dataset-button">
          Run Simulation
        </el-button>
      </a>
    </div>
    <div v-else>
      <el-button
        class="dataset-button"
        @click="getDatasetClicked"
      >
        Get Dataset
      </el-button>
      <el-button class="secondary" @click="scrollToCitations">
        Cite Dataset
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { propOr } from 'ramda'

import DatasetBannerImage from '@/components/DatasetBannerImage/DatasetBannerImage.vue'
import SparcPill from '@/components/SparcPill/SparcPill.vue'

export default {
  name: 'DatasetActionBox',

  components: {
    DatasetBannerImage,
    SparcPill
  },

  props: {
  },

  computed: {
    /**
     * Get dataset info from the store
     * @returns {Object}
     */
    ...mapState('pages/datasets/datasetId', ['datasetInfo', 'datasetType']),
    /**
     * Gets dataset version
     * @returns {Number}
     */
    version: function() {
      return propOr(1, 'version', this.datasetInfo)
    },
    /**
     * Returns dataset banner
     * @returns {String}
     */
    datasetImage: function() {
      return propOr('', 'banner', this.datasetInfo)
    },
  },

  methods: {
    /**
     * Get the citations area in the
     * About tab by id
     * @returns {Object}
     */
    getCitationsArea: function() {
      return document.getElementById('citationsArea')
    },

    /**
     * Scroll to the citations area
     * in the About tab
     */
    scrollToCitations: function() {
      this.getCitationsArea().scrollIntoView()
    },
    getDatasetClicked: function() {
      this.$emit('get-dataset')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';

.dataset-action-box {
  display: flex;
  flex-direction: column;
  border: solid 1px $cloudy;
  text-align: center;
  padding: .5rem;
  background: white;
  margin: 1.25rem 0 0;
  button {
    margin: .25rem 0;
  }
}
</style>
