<template>
  <div class="dataset-action-box mt-16 p-8">
    <dataset-banner-image :src="datasetImage" />
    <sparc-pill class="sparc-pill" v-if="embargoed">
      Embargoed
    </sparc-pill>
    <div class="button-container" v-if="datasetTypeName === 'scaffold' && !datasetInfo.study">
      <div v-if="hasFiles && embargoed && userToken && embargoAccess !== EMBARGO_ACCESS.GRANTED">
        <el-button
          :disabled="embargoAccess != null"
          @click="openAgreementPopup()"
        >
          Request Access
        </el-button> 
        <div class="body4" v-if="embargoAccess === EMBARGO_ACCESS.REQUESTED">
          Your request is pending approval.
        </div>
      </div>
      <div v-else-if="hasFiles" class="button-container">
        <el-button
          class="dataset-button"
          @click="actionButtonClicked('images')"
        >
          View Scaffold
        </el-button>
        <el-button
          class="dataset-button"
          @click="actionButtonClicked('files')"
        >
          Get Scaffold
        </el-button>
      </div>
      <el-button class="secondary" @click="actionButtonClicked('cite')">
        Cite Scaffold
      </el-button>
    </div>
    <div class="button-container" v-else-if="datasetTypeName === 'computational model'">
      <el-button v-if="canViewSimulation" @click="openSimulationViewer()">
        View Simulation
      </el-button>
      <a
        v-if="canRunSimulation"
        :href="`https://osparc.io/study/${simulationId}`"
        target="_blank"
      >
        <el-button>
          Run Simulation
        </el-button>
      </a>
      <div v-if="hasFiles && embargoed && userToken && embargoAccess !== EMBARGO_ACCESS.GRANTED">
        <el-button
          :disabled="embargoAccess != null"
          @click="openAgreementPopup()"
        >
          Request Access
        </el-button>
        <div class="body4" v-if="embargoAccess === EMBARGO_ACCESS.REQUESTED">
          Your request is pending approval.
        </div>
      </div>
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
        v-if="canViewSimulation || canRunSimulation"
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
          <el-button slot="item" style="width: 100%;" class="secondary">
            Go to oSPARC
          </el-button>
        </sparc-tooltip>
      </a>
    </div>
    <div class="button-container" v-else>
      <div v-if="hasFiles && embargoed && userToken && embargoAccess !== EMBARGO_ACCESS.GRANTED">
        <el-button
          :disabled="embargoAccess != null"
          @click="openAgreementPopup()"
        >
          Request Access
        </el-button> 
        <div class="body4" v-if="embargoAccess === EMBARGO_ACCESS.REQUESTED">
          Your request is pending approval.
        </div>
      </div>
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
    <data-use-agreement-popup
      :show-dialog="showAgreementPopup"
      @dialog-closed="showAgreementPopup = false"
      @agreement-signed="requestAccess"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { propOr } from 'ramda'
import { successMessage, failMessage } from '@/utils/notification-messages'
import DatasetBannerImage from '@/components/DatasetBannerImage/DatasetBannerImage.vue'
import SparcPill from '@/components/SparcPill/SparcPill.vue'
import DataUseAgreementPopup from '@/components/DataUseAgreementPopup/DataUseAgreementPopup.vue'
import { EMBARGO_ACCESS } from '@/utils/constants'

export default {
  name: 'DatasetActionBox',

  components: {
    DataUseAgreementPopup,
    DatasetBannerImage,
    SparcPill
  },

  data() {
    return {
      showAgreementPopup: false
    }
  },

  computed: {
    ...mapState('pages/datasets/datasetId', ['datasetInfo', 'datasetTypeName']),
    ...mapGetters('user', ['cognitoUserToken']),
    userToken() {
      return this.cognitoUserToken || this.$cookies.get('user-token')
    },
    EMBARGO_ACCESS() {
      return EMBARGO_ACCESS
    },
    embargoAccess() {
      return propOr(null, 'embargoAccess', this.datasetInfo)
    },
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
     * Returns whether a simulation can be viewed
     */
    canViewSimulation: function() {
      return this.datasetInfo.sciCrunch ? this.datasetInfo.sciCrunch['abi-simulation-file'] : false
    },
    /**
     * Returns simulation id for run simulation button
     * @returns {String}
     */
    simulationId: function() {
      return this.canRunSimulation ? this.datasetInfo.study.uuid : ''
    },
    canRunSimulation: function() {
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
    },
    openSimulationViewer: function() {
      const link = document.createElement('a')

      link.href = `${this.$router.options.base || '/'}datasets/simulationviewer?id=${this.datasetInfo.id}`
      link.target = '_blank'

      document.body.appendChild(link)

      link.click()
      link.remove()
    },
    openAgreementPopup: function() {
      this.showAgreementPopup = true
    },
    requestAccess() {
      const url = `${process.env.discover_api_host}/datasets/${this.datasetInfo.id}/preview?api_key=${this.userToken}`

      this.$axios
        .$post(url, {
          datasetId: this.datasetInfo.id,
        })
        .then(() => {
          this.updateEmbargoAccess(EMBARGO_ACCESS.REQUESTED)

          this.$message(successMessage('Your request has been successfully submitted.'))
        })
        .catch((error) => {
          this.$message(failMessage('Unable to submit request at this time.'))

          throw error
        })
    },
    updateEmbargoAccess(access) {
      const newDatasetInfo = {
        ...this.datasetDetails,
        embargoAccess: access
      }

      this.$store.dispatch('pages/datasets/datasetId/setDatasetInfo', newDatasetInfo)
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
