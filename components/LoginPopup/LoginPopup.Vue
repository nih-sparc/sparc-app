

<template>
  <el-dialog
    :visible="visible"
    :show-close="false"
    class="login-class-dialog"
    :height="height"
    @close="closeDialog"
  >
    <div class="login-class-container">
      <button class="close-dialog" @click="closeDialog">

      </button>
      <div class="aws-container">
        <div
        <h1>Login with ORCiD</h1>
        <p>
          text here
        </p>
          <el-button class="secondary" @click="closeDialog">
            Close
          </el-button>
          </div>

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
  name: 'LoginPopup',

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
      awsMessage: 'us-east-1'
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
      return `${process.env.bf_api_host}/discover/datasets/${this.datasetId}/versions/${this.versionId}/download?downloadOrigin=SPARC`
    }
  },

  methods: {
    /**
     * Closes dialog
     */
    closeDialog: function() {
      this.$emit('close-login-dialog')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

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

.login-class-dialog {
  .download-dataset-container {
    display: flex;
    word-break: normal;
  }

  .buttons {
    text-align: center;
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

    &__download-dataset-size {
      margin-top: 35px;
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
  }

  .disclosure-text-block {
    display: flex;
    p {
      font-size: 12px;
      width: 90%;
      line-height: 16px;
    }

    ::v-deep .bf-button {
      min-width: 80px;
      &.secondary {
        width: 6%;
        padding-left: 0;
        padding-right: 0;
      }
    }
  }

  .download-container {
    background-color: $median;
    box-sizing: border-box;
    flex-shrink: 0;
    color: #fff;
    width: 316px;
    overflow: hidden;
    position: relative;
    padding: 40px 40px 0;

    &__download-dataset-size {
      margin-top: 35px;
      margin-bottom: 200px;
    }



    h1 {
      line-height: 32px;
      color: #fff;
      font-size: 24px;
      font-weight: 500;
      margin: 0;
      margin-bottom: 25px;
    }

    p {
      line-height: 24px;
      color: #fff;
      font-size: 16px;
    }
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
    justify-content: space-between;
    border-radius: 4px;
    color: #000;

    &.aws {
      margin-bottom: 36px;
    }
  }

  ::v-deep .el-dialog {
    border-radius: 0;
    width: 868px;

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
