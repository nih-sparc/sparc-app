<template>
  <div>
    <h2 class="section-text">Download Dataset</h2>
    <p>
      <strong>Dataset size: </strong>{{ formatMetric(datasetInfo.size) }}
    </p>
    <div class="bx--row">
      <div class="bx--col-sm-4 bx--col-md-8 bx--col">
        <div v-if="!isDatasetSizeLarge">
          <p><strong>Option 1 - Direct download: </strong>Download a zip archive of the raw files and metadata directly to your computer free of charge.</p>
          <a :href="downloadUrl">
            <el-button class="download-button">Download</el-button>
          </a>
        </div>
        <div v-else>
          <p><strong>Option 1 - Direct download: </strong>Direct downloads are only available free of charge for datasets that are 5GB or smaller. Datasets bigger than 5GB will need to be downloaded via AWS. </p>
        </div>
      </div>
      <div class="bx--col-sm-4 bx--col-md-8 bx--col aws-download-column">
        <p>
          <strong>Option 2 - AWS download: </strong>
          Download or transfer the dataset to your AWS Account. The raw files and metadata are stored in an AWS S3 Requester Pays bucket. You can learn more about downloading data from AWS on our
          <a href="https://sparc.science/help/zQfzadwADutviJjT19hA5" target="_blank">Help Page</a>.
        </p>
        <div class="aws-block">
          <h2 class="sub-section-text">Resource Type</h2>
          <p>Amazon S3 Bucket (Requester Pays) *</p>
          <h2 class="sub-section-text">Amazon S3 Bucket</h2>
          <div class="download-text-block">
            {{ datasetArn }}
            <button class="copy-button" @click="handleCitationCopy(datasetArn)">
              <img src="../../static/images/copyIcon.png" />
            </button>
          </div>
          <h2 class="sub-section-text">AWS Region</h2>
          <div class="download-text-block aws">
            {{ awsMessage}}
            <button class="copy-button" @click="handleCitationCopy(awsMessage)">
              <img src="../../static/images/copyIcon.png" />
            </button>
          </div>
        </div>
        <div class="disclosure-text-block">
          <p>*Requester pays means that any costs associated with downloading the data will be charged to your AWS account.
            For transfer pricing information, visit the <a href="https://aws.amazon.com/s3/pricing/" target="blank">AWS Pricing documentation.</a>
          </p>
          <div>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <h2 class="section-text">
      Dataset Files
    </h2>
    <div class="flex mb-16">
      <span>
        <strong>Dataset size: </strong>{{ formatMetric(datasetInfo.size) }}
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
    <files-table :osparc-viewers="osparcViewers" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
    }
  },

  computed: {
    /**
     * Get dataset info from the store
     * @returns {Object}
     */
    ...mapState('pages/datasets/datasetId', ['datasetInfo']),
    /**
     * Checks whether the dataset download size is larger or smaller than 5GB
     * @returns {Boolean}
     */
    isDatasetSizeLarge: function() {
      const datasetSize = propOr(0, 'size', this.datasetInfo)
      return datasetSize > 5000000000
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
      return `${process.env.bf_api_host}/discover/datasets/${this.datasetId}/versions/${this.versionId}/download?downloadOrigin=SPARC`
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
@import '@/assets/_variables.scss';
a {
  text-decoration: underline;
}
.section-text {
  font-weight: 500;
}
hr {
  margin-top: 1rem;
  border-top: none;
}
.download-button {
  margin-bottom: 1rem;
}
.bx--col {
  padding-left: 1rem;
}
.aws-download-column {
  @media (min-width: 64rem) {
    border-left: 1px solid $cloudy;
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
  background-color: #f5f7fa;
  padding: 6px 6px 6px 6px;
  display: flex;
  justify-content: space-between;
  border-radius: 4px;
  margin-bottom: .5rem;
}
.sub-section-text {
  margin-bottom: 0;
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
  padding: 1rem;
  border: 1px solid $cloudy;
  margin-bottom: 1rem;
}
</style>
