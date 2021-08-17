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
      <iframe ref="biolucida" :src="data.share_link" />
    </template>
    <p v-else class="error">
      Sorry, an error has occurred
    </p>
  </div>
</template>

<script>
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
          status: ''
        }
      }
    }
  },
  watch: {
    queryView() {
      // console.log('query view.')
      // console.log(this.$refs.biolucida)
      // this.$refs.biolucida.contentWindow.postMessage(
      // 'getImgPos',
      // 'https://localhost:3000'
      // )
      this.$refs.biolucida.contentWindow.postMessage(
        'getImgPos',
        'https://sparc.science/'
      )
      // this.$refs.biolucida.contentWindow.postMessage(
      // 'getImgPos',
      // this.$refs.biolucida
      // )
      // postMessage('gggggg', this.$refs.biolucida)
      // postMessage('getImgPos', this.$refs.biolucida.contentWindow)
      // console.log('three requests, any response???')
      // this.$refs.biolucida.contentWindow.postMessage(
      // '84-54-1-3',
      // 'https://sparc.science/'
      // )
    }
  },
  mounted() {
    window.addEventListener('message', this.receiveMessage)
  },
  beforeDestroy() {
    window.removeEventListener('message', this.receiveMessage)
  },
  methods: {
    receiveMessage(event) {
      // console.log('received message!!')
      // console.log(event.origin)
      // console.log(event.data)
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
