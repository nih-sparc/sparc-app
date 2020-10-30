<template>
  <el-dialog
    :visible="visible"
    :show-close="false"
    class="download-dataset-dialog"
    :height="height"
    @close="closeDialog"
  >
    <div class="download-dataset-container">
      <button class="close-dialog" @click="closeDialog">
        <svg-icon
          name="icon-remove"
          width="16"
          height="16"
          color="#71747c"
          class="close-icon"
        />
      </button>
      <div v-if="!isDatasetSizeLarge" class="download-block">
        <h1>Direct Download</h1>
        <p>
          You can download the raw files and metadata directly to your computer
          as a zip archive free of charge.
        </p>
        <p class="dataset-size-text">
          Dataset Size: {{ formatMetric(datasetDetails.size) }}
        </p>
        <div class="buttons">
          <a :href="downloadUrl">
            <bf-button class="download-button">Download Dataset</bf-button>
          </a>
          <bf-button class="secondary button-spacing" @click="closeDialog">
            Cancel
          </bf-button>
        </div>
      </div>
      <div v-else class="aws-container">
        <h1>Download from AWS</h1>
        <p>
          Raw files and metadata are stored in an AWS S3 Requester Pays bucket.
          You can learn more about downloading data from AWS on our
          <nuxt-link :to="{ name: 'help' }">
            Help Page.
          </nuxt-link>
        </p>
        <h2>Resource Type</h2>
        <p>Amazon S3 Bucket (Requester Pays)</p>
        <h2>Amazon S3 Bucket</h2>
        <div class="text-block">
          {{ datasetArn }}
        </div>
        <h2>AWS Region</h2>
        <div class="text-block aws">
          us-east-1
        </div>
        <div class="buttons">
          <nuxt-link
            :to="{
              name: 'help-helpId',
              params: {
                helpId: helpId
              }
            }"
          >
            <bf-button class="download-button">
              More Information
            </bf-button>
          </nuxt-link>
          <bf-button class="secondary button-spacing" @click="closeDialog">
            Okay
          </bf-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { propOr } from 'ramda'

import BfButton from '../shared/BfButton/BfButton.vue'

import FormatMetric from '../../mixins/bf-storage-metrics'

export default {
  name: 'DownloadDataset',

  components: {
    BfButton
  },

  mixins: [FormatMetric],

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    datasetDetails: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      helpId: process.env.ctf_help_aws_id
    }
  },

  computed: {
    /**
     * Checks whether the dataset download size is larger or smaller than 1GB
     * @returns {Boolean}
     */
    isDatasetSizeLarge: function() {
      const datasetSize = propOr(0, 'size', this.datasetDetails)
      return datasetSize > 5000000000
    },

    /**
     * Compute height based on isDatasetSizeLarge
     * @returns {String}
     */
    height: function() {
      return this.isDatasetSizeLarge ? '460px' : '284px'
    },

    /**
     * Gets dataset id
     * @returns {Number}
     */
    datasetId: function() {
      return propOr(0, 'id', this.datasetDetails)
    },

    /**
     * Gets dataset version
     * @returns {Number}
     */
    versionId: function() {
      return propOr(0, 'version', this.datasetDetails)
    },

    /**
     * Gets dataset ARN
     * @returns {String}
     */
    datasetArn: function() {
      return propOr('', 'uri', this.datasetDetails)
    },

    /**
     * Computes the API url for downloading a dataset
     * @returns {String}
     */
    downloadUrl: function() {
      return `${process.env.bf_api_host}/discover/datasets/${this.datasetId}/versions/${this.versionId}/download`
    }
  },

  methods: {
    /**
     * Closes dialog
     */
    closeDialog: function() {
      this.$emit('close-download-dialog')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

@media screen and (max-width: 767px) {
  ::v-deep .el-dialog {
    width: 93%;
  }
}
.el-dialog__body {
  padding: 0;
}
.el-dialog__header {
  display: none;
}

.discover-banner {
  background: #edf1fc;
  padding: 8px;
  text-align: center;
}

.download-dataset-dialog {
  .download-dataset-container {
    display: flex;
    word-break: normal;
  }
  .download-block {
    padding: 40px;

    img {
      position: absolute;
      top: 245px;
      left: -102px;
      opacity: 0.3;
      width: 413px;
      height: 402px;
    }

    p {
      line-height: 24px;
      color: #000;
      font-size: 16px;
      margin-top: 8px;
      margin-bottom: 16px;
    }

    .size {
      text-align: center;
      line-height: 24px;
      color: #ffffff;
      font-size: 14px;
      margin-top: 2px;
    }

    .download-button {
      width: 178px;
      @media screen and (max-width: 767px) {
        width: 100%;
      }
    }

    .dataset-size-text {
      font-size: 18px;
      font-weight: 500;
      line-height: 24px;
      margin-bottom: 32px;
    }
  }

  @media screen and (max-width: 767px) {
    .buttons {
      display: flex;
      flex-direction: row;
    }
  }

  @media screen and (max-width: 767px) {
    ::v-deep .bf-button {
      &.secondary {
        width: 30%;
      }
    }
  }

  a {
    text-decoration: none;
    &:hover {
      text-decoration: none;
    }
  }

  .aws-container {
    margin: 40px 48px;
    margin-top: 47px;
  }

  .close-dialog {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    position: absolute;
    right: 41px;
  }

  .close-icon {
    margin-top: 26px;
    margin-right: -12px;
  }

  h1 {
    line-height: 36px;
    color: $midnight;
    font-size: 28px;
    font-weight: normal;
    margin-bottom: 8px;
  }

  p {
    color: #000000;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: -4px;
  }

  h2 {
    color: #000000;
    font-size: 18px;
    font-weight: 500;
    line-height: 24px;
    margin: 0 0 8px;
    margin-top: 15px;
  }

  .text-block {
    border-radius: 2px;
    background-color: #f5f7fa;
    padding: 6px 6px 6px 6px;
    margin-bottom: 16px;
    font-family: monospace;
    font-size: 14px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    color: #000;

    &.aws {
      margin-bottom: 36px;
    }
  }

  .aws-block {
    box-sizing: border-box;
    padding: 40px 40px 0;
  }

  ::v-deep .el-dialog {
    border-radius: 0;
    width: 768px;
    @media screen and (max-width: 767px) {
      width: 93%;
    }
    .el-dialog__body {
      padding: 0;
    }

    .el-dialog__header {
      padding: 0;
      border-bottom: none;
    }
  }
}
</style>
