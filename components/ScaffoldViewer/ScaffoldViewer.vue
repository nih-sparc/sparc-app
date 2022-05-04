<template>
  <div class="scaffold-viewer">
    <el-row type="flex" class="mb-2 position-right">
      <bf-button class="ml-8" @click="copyLink">
        <svg-icon name="icon-permalink" height="24" width="24" />
        <span class="visuallyhidden">Copy permalink</span>
      </bf-button>
    </el-row>
    <client-only placeholder="Loading scaffold ...">
      <div class="scaffoldvuer-container">
        <ScaffoldVuer
          ref="scaffoldvuer"
          :state="state"
          :display-markers="displayMarkers"
          :url="scaffoldURL"
          :background-toggle="backgroundToggle"
          :region="region"
          :view-u-r-l="viewURL"
        />
      </div>
    </client-only>
  </div>
</template>

<script>
import { successMessage, failMessage } from '@/utils/notification-messages'

import BfButton from '@/components/shared/BfButton/BfButton.vue'

export default {
  name: 'ScaffoldViewer',

  components: {
    BfButton,
    ScaffoldVuer: process.client
      ? () => import('@abi-software/scaffoldvuer').then(m => m.ScaffoldVuer)
      : null
  },

  props: {
    scaffoldURL: {
      type: String,
      required: true
    },
    viewURL: {
      type: String,
      default: ''
    },
    region: {
      type: String,
      default: ''
    }
  },

  data: () => {
    return {
      displayMarkers: false,
      backgroundToggle: true,
      state: undefined
    }
  },

  watch: {
    '$route.query': '$fetch'
  },
  fetchOnServer: false,
  created: function() {
    this.currentId = undefined
    this.api = process.env.portal_api
    let lastChar = this.api.substr(-1)
    if (lastChar != '/') {
      this.api = this.api + '/'
    }
  },
  methods: {
    copyLink: function() {
      // this.$message(successMessage('Share link copied to clipboard.'))
      let url = this.api + `scaffold/getshareid`
      let state = this.$refs.scaffoldvuer.getState()
      // Dont need the url here
      if (state && state.url) delete state['url']
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ state: state })
      })
        .then(response => response.json())
        .then(data => {
          if (data.uuid) {
            //Remove other scaffold queries
            delete this.$route.query['viewURL']
            delete this.$route.query['region']
            this.currentId = data.uuid
            //Update and copy the url
            this.$router.replace(
              { query: { ...this.$route.query, id: data.uuid } },
              //Callback once the router replace is done, essential
              //for copying the correct url.
              () => {
                this.$copyText(
                  `${process.env.ROOT_URL}${this.$route.fullPath}`
                ).then(
                  () => {
                    this.$message(
                      successMessage('Share link copied to clipboard.')
                    )
                  },
                  () => {
                    this.$message(failMessage('Failed to copy share link.'))
                  }
                )
              }
            )
          }
        })
        .catch(() => {
          this.$message(failMessage('Failed to get a share link.'))
        })
    }
  }
}
</script>

<style scoped lang="scss">
.position-right {
  justify-content: flex-end;
}

.scaffoldvuer-container {
  height: 90vh;
  max-width: calc(100% - 48px);
  left: 24px;
  overflow: hidden;
  position: relative;
  @import '~@abi-software/scaffoldvuer/dist/scaffoldvuer';
}

.time-slider-container .el-tabs__content {
  height: 40px;
}

.time-slider-container .el-slider__marks-text {
  margin-top: 6px !important;
}

.time-slider-tooltip {
  padding: 6px 4px !important;
  font-family: 'Asap', sans-serif;
  font-size: 12px !important;
  color: rgb(48, 49, 51) !important;
  background-color: #f3ecf6 !important;
  border: 1px solid #8300bf !important;
  white-space: nowrap !important;
  min-width: unset !important;
}

.scaffold_viewer_dropdown .el-select-dropdown__item {
  white-space: nowrap;
  text-align: left;
  font-family: 'Asap', sans-serif;
}
</style>
