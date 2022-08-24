<template>
  <large-modal
    v-if="dialogVisible"
    :visible="dialogVisible"
    @close-download-dialog="dialogVisible = false"
  >
    <div class="content" slot="mainContent">
      <h1>Log into SPARC</h1>
      <p>
        Learn about the new and current features the SPARC Portal has to offer
        <a href="/#" target="_blank">here</a>.
      </p>
      <el-button class="secondary"  @click="onLoginWithORCID">
        <img
          class="orcid-logo mr-2"
          src="@/static/images/orcid_24x24.png"
          width="16"
          height="16"
          alt="Logo for ORCID"
        />
        Sign in with Orcid iD
      </el-button>
      <div class="close-button-container pt-16">
        <el-button @click="dialogVisible = false">
          Close
        </el-button>
      </div>
    </div>
  </large-modal>
</template>
<script>

export default {
  name: 'LoginModal',
  data() {
    return {
      dialogVisible: false
    }
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    showDialog: {
      handler: function(show) {
        if (show) {
          this.dialogVisible = true
        }
      }
    },
    dialogVisible: {
      handler: function(show) {
        if (!show) {
          this.$emit('dialog-closed')
        }
      }
    }
  },

  methods: {
    onLoginWithORCID: async function(x) {
      x.preventDefault()
      this.dialogVisible = false
      this.$cookies.set('auth-redirect-url', this.$nuxt.$route.fullPath)
      await this.$store.dispatch('user/login', 'ORCID')
      
    },
  }
}
</script>
<style scoped lang="scss">
.close-button-container {
  text-align: right;
}
.orcid-logo {
  vertical-align: text-top;
}
</style>
