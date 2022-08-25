<template>
  <div>
    <div class="heading2 mb-8">Download Dataset</div>
    <div class="mb-8">
      <span class="label4">Dataset size: </span>{{ formatMetric(datasetInfo.size) }}
    </div>
    <div class="bx--row">
      <div class="bx--col-sm-4 bx--col-md-8 bx--col left-column">
        <div v-if="!isDatasetSizeLarge">
          <div><span class="label4">Option 1 - Direct download: </span>Download a zip archive of the raw files and metadata directly to your computer free of charge.</div>
          <a :href="downloadUrl">
            <el-button class="my-16">Download full dataset</el-button>
          </a>
        </div>
        <div v-else>
          <div><span class="label4">Option 1 - Direct download: </span>Direct downloads are only available free of charge for datasets that are 5GB or smaller. Datasets bigger than 5GB will need to be downloaded via AWS. </div>
        </div>
      </div>
      <div class="bx--col-sm-4 bx--col-md-8 bx--col aws-download-column">
        <div class="mb-8">
          <span class="label4">Option 2 - AWS download: </span>
          Download or transfer the dataset to your AWS Account. The raw files and metadata are stored in an AWS S3 Requester Pays bucket. You can learn more about downloading data from AWS on our
          <a href="https://sparc.science/help/zQfzadwADutviJjT19hA5" target="_blank">Help Page</a>.
        </div>
        <div class="aws-block mb-16 px-16 pb-16 pt-8">
          <div class="heading3">Resource Type</div>
          <div class="mb-0"><span class="heading3">Amazon S3 Bucket</span> (Requester Pays) *</div>
          <div class="download-text-block mb-8 p-4">
            {{ datasetArn }}
            <button class="copy-button" @click="handleCitationCopy(datasetArn)">
              <img src="../../static/images/copyIcon.png" />
            </button>
          </div>
          <div class="heading3 mb-0">AWS Region</div>
          <div class="download-text-block p-4 aws">
            {{ awsMessage}}
            <button class="copy-button" @click="handleCitationCopy(awsMessage)">
              <img src="../../static/images/copyIcon.png" />
            </button>
          </div>
        </div>
        <div>
          * Requester pays means that any costs associated with downloading the data will be charged to your AWS account.
          For transfer pricing information, visit the <a href="https://aws.amazon.com/s3/pricing/" target="blank">AWS Pricing documentation.</a>
        </div>
      </div>
    </div>
    <hr />
    <h2 class="heading2">
      Dataset Files
    </h2>
    <div class="flex mb-16">
      <span>
        <span class="label4">Dataset size: </span>{{ formatMetric(datasetInfo.size) }}
      </span>
      <span class="dataset-link inline">
        <nuxt-link
          :to="{
            name: 'help-helpId',
            params: {
              helpId: ctfDatasetNavigationInfoPageId
            }
          }"
          class="dataset-link"
        >
          How to navigate datasets
        </nuxt-link>
      </span>
    </div>
    <files-table :osparc-viewers="osparcViewers" :dataset-scicrunch="datasetScicrunch"/>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { propOr } from 'ramda'

import { successMessage, failMessage } from '@/utils/notification-messages'
import FilesTable from '@/components/FilesTable/FilesTable.vue'
import FormatMetric from '../../mixins/bf-storage-metrics'

export default {
  name: 'DatasetFilesInfo',

  components: {
    FilesTable,
  },

  mixins: [FormatMetric],

  props: {
    osparcViewers: {
      type: Object,
      default: () => {}
    },
    datasetScicrunch: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    /**
     * Get dataset info from the store
     * @returns {Object}
     */
    ...mapState('pages/datasets/datasetId', ['datasetInfo']),
    ...mapGetters('user', ['cognitoUserToken']),
    userToken() {
      return this.cognitoUserToken || this.$cookies.get('user-token')
    },
    /**
     * Checks whether the dataset download size is larger or smaller than 5GB
     * @returns {Boolean}
     */
    isDatasetSizeLarge: function() {
      const datasetSize = propOr(0, 'size', this.datasetInfo)
      return datasetSize > process.env.max_download_size
    },
    /**
     * Gets dataset ARN
     * @returns {String}
     */
    datasetArn: function() {
      return propOr('', 'uri', this.datasetInfo)
    },
    /**
     * Gets dataset id
     * @returns {Number}
     */
    datasetId: function() {
      return propOr(0, 'id', this.datasetInfo)
    },
    /**
     * Gets dataset version
     * @returns {Number}
     */
    versionId: function() {
      return propOr(0, 'version', this.datasetInfo)
    },
    /**
     * Computes the API url for downloading a dataset
     * @returns {String}
     */
    downloadUrl: function() {
      var url = `${process.env.discover_api_host}/datasets/${this.datasetId}/versions/${this.versionId}/download?downloadOrigin=SPARC`
      if (this.userToken) {
        url += `?api_key=${this.userToken}`
      }
      return url
    }
  },

  data() {
    return {
      ctfDatasetNavigationInfoPageId:
        process.env.ctf_dataset_navigation_info_page_id,
      awsMessage: 'us-east-1'
    }
  },

  methods: {
    /**
     * Handle copy citation to clipboard
     */
    handleCitationCopy: function(text) {
      this.$copyText(text).then(() => {
        this.$message(
          successMessage(
            "Copied to clipboard."
          )
        )
      }),
        () => {
          this.$message(failMessage('Failed to copy.'))
        }
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
a {
  text-decoration: underline;
}
hr {
  margin-top: 1rem;
  border-top: none;
}
.bx--row {
  margin: 0;
}
[class*="bx--col"] {
  padding: 0;
  @media (min-width: 64em) {
    padding: 1em;
  }
}
.left-column {
  padding-left: 0;
}
.aws-download-column {
  @media (min-width: 64rem) {
    border-left: 1px solid $lineColor1
  }
}
.flex {
  display: flex;
  align-content: space-between;
}

.inline {
  margin-left: auto;
  display: inline-block;
}

.download-text-block {
  background-color: $background;
  display: flex;
  justify-content: space-between;
  border-radius: 4px;
}
.copy-button {
  border: none;
  background: transparent;
  cursor: pointer;
  img {
    width: 20px;
    height: 20px;
  }
}
.aws-block {
  border: 1px solid $lineColor1;
}
</style>
