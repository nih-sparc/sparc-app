<template>
  <large-modal
    v-if="dialogVisible"
    :visible="dialogVisible"
    @close-download-dialog="dialogVisible = false"
  >
    <div class="content" slot="mainContent">
      <h1 class="heading1 mb-8">
        Sign into SPARC
      </h1>
      <p class="body1">
        SPARC Portal login authentication is provided by <a href="https://orcid.org" target="_blank">ORCID iD</a>. Create a SPARC account or sign in to your existing SPARC account via your existing ORCID iD.
        
        Upon initial login to the SPARC Portal via ORCID iD, you will also be creating* an account on <a href="https://pennsieve.io" target="_blank">Pennsieve</a> to unlock all the features SPARC has to offer.
      </p>
      <p class="body1">
        Learn more <a href="https://docs.sparc.science/" target="_blank">here</a> about what features you gain access to by signing into the SPARC Portal.
      </p>
      <el-button class="secondary" @click="onLoginWithORCID">
        <img
          class="orcid-logo mr-2"
          src="@/static/images/orcid_24x24.png"
          width="16"
          height="16"
          alt="Logo for ORCID"
        />
        Sign in with ORCID iD
      </el-button>
      <p class="mt-16 body4">
        By signing in to SPARC, you are accepting the <a href="https://docs.sparc.science/docs/terms-of-service" target="_blank">SPARC Terms of Service</a> and <a href="https://docs.sparc.science/docs/policies" target="_blank">SPARC DRC Privacy Policy</a> in addition to the <a href="https://docs.pennsieve.io/page/pennsieve-terms-of-use" target="_blank">Pennsieve Terms of Service</a> and <a href="https://docs.pennsieve.io/page/privacy-policy" target="_blank">Pennsieve Privacy Policy</a>.
      </p>
      <p class="body4">
        * If you already have an account on Pennsieve, you will be able to link your newly created SPARC account to it by entering your existing Pennsieve account's e-mail address when prompted.
      </p>
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
