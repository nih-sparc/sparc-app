<template>
  <div class="biolucida-viewer">
    <template v-if="data.status !== 'error'">
      <p>
        <a :href="data.blv_link" target="_blank">
          <bf-button>
            View in 3D
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
          blv_link: '',
          share_link: '',
          status: ''
        }
      }
    }
  },
  watch: {
    queryView() {
      this.$refs.biolucida.contentWindow.postMessage('getImgPos')
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
      // Waiting on changes to Biolucida that will enable us to receive the desired message.
      // console.log('received message.')
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
