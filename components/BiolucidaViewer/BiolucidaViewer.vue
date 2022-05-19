<template>
  <div class="biolucida-viewer">
    <template v-if="data.status !== 'error'">
      <el-row class="mb-2 justify-space-between" type="flex">
        <bf-button class="ml-8 btn-copy-permalink-solid" @click="launchViewer">
          View in 3D
        </bf-button>
        <client-only>
          <button class="btn-copy-permalink" @click="queryView">
            <sparc-tooltip placement="bottom-center" content="Copy Link">
              <svg-icon
                slot="item"
                name="icon-permalink"
                height="2rem"
                width="1.75rem"
              />
            </sparc-tooltip>
          </button>
        </client-only>
      </el-row>
      <iframe ref="biolucida" :src="data.share_link" @load="biolucidaLoaded" />
    </template>
    <p v-else class="error">
      Sorry, an error has occurred
    </p>
  </div>
</template>

<script>
import { successMessage, failMessage } from '@/utils/notification-messages'

import BfButton from '@/components/shared/BfButton/BfButton.vue'

export default {
  name: 'BiolucidaViewer',

  components: {
    BfButton
  },

  props: {
    data: {
      type: Object,
      default: () => {
        return {
          biolucida_image_id: '',
          blv_link: '',
          share_link: '',
          status: '',
          location: ''
        }
      }
    }
  },
  mounted() {
    window.addEventListener('message', this.receiveMessage)
  },
  beforeDestroy() {
    window.removeEventListener('message', this.receiveMessage)
  },
  methods: {
    launchViewer() {
      window.open(this.data.blv_link, '_blank')
    },
    queryView() {
      this.$refs.biolucida.contentWindow.postMessage(
        'getImgPos',
        process.env.BL_SERVER_URL
      )
    },
    biolucidaLoaded() {
      if (this.data.location) {
        this.$refs.biolucida.contentWindow.postMessage(
          this.data.location,
          process.env.BL_SERVER_URL
        )
      }
    },
    receiveMessage(event) {
      if (event.origin === process.env.BL_SERVER_URL) {
        const message = event.data
        if (message === 'setting x,y,z,f failed') {
          this.$message(failMessage('Unable to set image location.'))
        } else if (!message.startsWith('setting x,y,z,f ')) {
          let linkPath = `${process.env.ROOT_URL}${this.$route.fullPath}`
          if (this.$route.query && this.$route.query.location) {
            linkPath = linkPath.replace(this.$route.query.location, message)
          } else {
            linkPath += `&location=${message}`
          }
          this.$copyText(linkPath).then(
            () => {
              this.$message(successMessage('Share link copied to clipboard.'))
            },
            () => {
              this.$message(failMessage('Failed to copy share link.'))
            }
          )
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_viewer.scss';

iframe {
  border: none;
  height: 500px;
  width: 100%;
}
.error {
  margin: 0;
  text-align: center;
}
.icon-full-screen {
  margin: -5px 0;
}

.justify-space-between {
  justify-content: space-between;
}
</style>
