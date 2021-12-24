<template>
  <div class="dataset-action-box mt-16 p-8">
    <dataset-banner-image :src="datasetImage" />
    <sparc-pill class="sparc-pill" v-if="datasetInfo.embargo">
      Embargoed
    </sparc-pill>
    <div class="button-container" v-if="datasetTypeName === 'scaffold' && !datasetInfo.study">
      <sparc-tooltip
        v-if="embargoed"
        placement="left-center"
      >
        <div slot="data">
          This scaffold is currently embargoed.<br />SPARC datasets are subject to a 1-year<br />embargo during which time the datasets<br />are visible only to members of the<br />SPARC consortium. During embargo, the<br />public will be able to view basic<br />metadata about these datasets as well<br />as their release date.
        </div>
        <el-button
          slot="item"
        >
          Get Saffold
        </el-button>
      </sparc-tooltip>
      <el-button
        v-else-if="hasFiles"
        class="dataset-button"
        @click="actionButtonClicked('files')"
      >
        Get Scaffold
      </el-button>
      <el-button class="secondary" @click="actionButtonClicked('cite')">
        Cite Scaffold
      </el-button>
    </div>
    <div class="button-container" v-else-if="datasetTypeName === 'computational model'">
      <a
        v-if="hasSimulation"
        :href="`https://osparc.io/study/${simulationId}`"
        target="_blank"
      >
        <el-button>
          Run Simulation
        </el-button>
      </a>
      <sparc-tooltip
        v-if="embargoed"
        placement="left-center"
      >
        <div slot="data">
          This model is currently embargoed.<br />SPARC datasets are subject to a 1-year<br />embargo during which time the datasets<br />are visible only to members of the<br />SPARC consortium. During embargo, the<br />public will be able to view basic<br />metadata about these datasets as well<br />as their release date.
        </div>
        <el-button
          slot="item"
        >
          Get Model
        </el-button>
      </sparc-tooltip>
      <el-button
        v-else-if="hasFiles"
        @click="actionButtonClicked('files')"
      >
        Get Model
      </el-button>
      <el-button class="secondary" @click="actionButtonClicked('cite')">
        Cite Model
      </el-button>
      <a
        v-if="hasSimulation"
        href="https://osparc.io/"
        target="_blank"
      >
        <sparc-tooltip
          placement="left-center"
        >
          <div slot="data">
            oSPARC simulations may offer<br />additional functionality, such as<br />more parameters, if you create<br />an account at 
            <a class="ospac-tooltip" href="https://osparc.io/">
              osparc.io
            </a>
          </div>
          <el-button slot="item" class="secondary">
            Go to oSPARC
          </el-button>
        </sparc-tooltip>
      </a>
    </div>
    <div class="button-container" v-else>
      <sparc-tooltip
        v-if="embargoed"
        placement="left-center"
      >
        <div slot="data">
          This dataset is currently embargoed.<br />SPARC datasets are subject to a 1-year<br />embargo during which time the datasets<br />are visible only to members of the<br />SPARC consortium. During embargo, the<br />public will be able to view basic<br />metadata about these datasets as well<br />as their release date.
        </div>
        <el-button
          slot="item"
        >
          Get Dataset
        </el-button>
      </sparc-tooltip>
      <el-button
        v-else-if="hasFiles"
        @click="actionButtonClicked('files')"
      >
        Get Dataset
      </el-button>
      <el-button class="secondary" @click="actionButtonClicked('cite')">
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

  computed: {
    /**
     * Get dataset info from the store
     * @returns {Object}
     */
    ...mapState('pages/datasets/datasetId', ['datasetInfo', 'datasetTypeName']),
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
    /**
     * Returns simulation id for run simulation button
     * @returns {String}
     */
    simulationId: function() {
      return this.hasSimulation ? this.datasetInfo.study.uuid : ''
    },
    hasSimulation: function() {
      return this.datasetInfo.study
    },
    hasFiles: function() {
      return this.fileCount >= 1
    },
    fileCount: function() {
      return propOr('0', 'fileCount', this.datasetInfo)
    },
    embargoed: function() {
      return propOr(false, 'embargo', this.datasetInfo)
    },
  },

  methods: {
    /**
     * Get the dataset details tab area by id
     * @returns {Object}
     */
    getDatasetDetailsTabArea: function() {
      return document.getElementById('datasetDetailsTabsContainer')
    },

    /**
     * scroll to the dataset details tab area
     */
    scrollToDatasetDetailsTabArea: function() {
      this.getDatasetDetailsTabArea().scrollIntoView()
    },
    actionButtonClicked: function(tabId) {
      this.$router.replace({
        query: { ...this.$route.query, datasetDetailsTab: tabId }
      }).finally(() => {
        this.scrollToDatasetDetailsTabArea()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

.dataset-action-box {
  display: flex;
  flex-direction: column;
  border: solid 1px $lineColor1;
  text-align: center;
  background: white;
  position: relative;
  .sparc-pill {
    position: absolute;
    right: 1rem;
    top: 1rem;
  }
  button {
    margin: .25rem 0;
  }
  a {
    display: inline-grid;
    text-decoration: none;
  }
  .button-container {
    display: flex;
    flex-direction: column;
    width: fit-content;
    align-self: center;
  }
  .ospac-tooltip {
    color: $purple;
  }
}
</style>
