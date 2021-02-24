<template>
  <el-dialog
    :visible="visible"
    :show-close="false"
    class="version-history-dialog"
    width="772px"
    height="600px"
    @close="closeDialog"
  >
    <bf-dialog-header slot="title" title="Version History" />

    <div class="version-history-container">
      <el-row class="table-header" type="flex" justify="center">
        <el-col :span="6">
          Version
        </el-col>
        <el-col :span="6">
          Date Published
        </el-col>
        <el-col :span="10" :push="2">
          DOI
        </el-col>
      </el-row>
      <el-row
        v-for="version in versions"
        :key="version.doi"
        class="table-rows"
        type="flex"
        justify="center"
      >
        <el-col :span="6">
          <router-link
            :to="{
              name: 'version',
              params: {
                version: version.version,
                datasetId
              },
              query: {
                type: 'dataset'
              }
            }"
            @click.native="$emit('update:visible', false)"
          >
            Version {{ version.version }}
          </router-link>
        </el-col>
        <el-col :span="6">
          {{ formatDate(version.updatedAt) }}
        </el-col>
        <el-col :span="10" :push="2">
          {{ version.doi }}
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import BfDialogHeader from '@/components/bf-dialog-header/BfDialogHeader.vue'

import FormatDate from '@/mixins/format-date'

export default {
  name: 'VersionHistory',

  components: {
    BfDialogHeader
  },

  mixins: [FormatDate],

  props: {
    visible: {
      type: Boolean,
      default: false
    },

    datasetId: {
      type: Number,
      default: 0
    },

    latestVersion: {
      type: Number,
      default: 0
    },

    versions: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    /**
     * Closes the dialog
     */
    closeDialog() {
      this.$emit('close-version-dialog')
      // scroll version history list to top
      const scrollEl = this.$el.querySelector('.el-dialog__body')
      scrollEl.scrollTop = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.version-history-dialog {
  .version-history-container {
    height: 290px;

    .table-header {
      background-color: #f9f9f9;
      height: 40px;
      // width: 616px;
      padding-left: 24px;
      color: #404554;
      font-weight: 600;
      font-size: 14px;
      line-height: 16px;
      padding-top: 12px;
      margin-left: 0px !important;
    }

    .table-rows {
      height: 40px;
      // width: 616px;
      padding-left: 24px;
      color: #000000;
      font-size: 14px;
      line-height: 16px;
      padding-top: 14px;
      border-top: solid 1px #dadada;
      margin-left: 0px !important;

      a {
        text-decoration: underline;

        &:focus {
          color: #1c46bd;
        }
      }
    }
  }

  ::v-deep .el-dialog {
    width: 616px !important;
    height: 350px;
    .el-dialog__header {
      background-color: #f1f1f3;
      padding-top: 16px;
      border-radius: 4px 4px 0px 0px;
      padding-bottom: 8px;

      .bf-dialog-header {
        .bf-dialog-header-title {
          font-size: 14px;
          font-weight: bold;
          line-height: 16px;
        }

        .icon-close {
          margin-bottom: 5px;
          .svg-icon {
            width: 16px !important;
            height: 16px !important;
          }
        }
      }
    }
    .el-dialog__body {
      padding: 0px 0px;
      overflow: scroll;
    }
  }
}
</style>
