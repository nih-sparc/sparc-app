<template>
  <div class="biolucida-viewer">
    <template v-if="data.status !== 'error'">
      <p>
        <a :href="data.share_link" target="_blank">
          <bf-button>
            View Full Screen
            <svg-icon
              class="icon-full-screen"
              name="icon-full-screen"
              height="24"
              width="24"
            />
          </bf-button>
        </a>
      </p>
      <iframe ref="biolucida" :src="data.share_link" @load="biolucidaLoaded" />
      <bf-button @click="go">
        Go
      </bf-button>
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
    queryView: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {
          biolucida_image_id: '',
          share_link: '',
          status: '',
          location: ''
        }
      }
    }
  },
  watch: {
    queryView() {
      this.$refs.biolucida.contentWindow.postMessage(
        'getImgPos',
        'https://sparc.biolucida.net'
      )
    }
  },
  mounted() {
    window.addEventListener('message', this.receiveMessage)
  },
  beforeDestroy() {
    window.removeEventListener('message', this.receiveMessage)
  },
  methods: {
    go() {
      this.$refs.biolucida.contentWindow.postMessage(
        '262.5,226,1,38',
        'https://sparc.biolucida.net'
      )
    },
    biolucidaLoaded() {
      if (this.data.location) {
        this.$refs.biolucida.contentWindow.postMessage(
          this.data.location,
          'https://sparc.biolucida.net'
        )
      }
    },
    receiveMessage(event) {
      // Waiting on changes to Biolucida that will enable us to receive the desired message.
      if (event.origin === 'https://sparc.biolucida.net') {
        const message = event.data
        console.log("hhhh:")
        console.log(message)
        if (message === 'setting x-y-z-f failed') {
          this.$message(failMessage('Unable to set image location.'))
        } else if (!message.startsWith('setting x-y-z-f ')) {
          this.$copyText(`${process.env.ROOT_URL}${this.$route.fullPath}`).then(
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
</style>
