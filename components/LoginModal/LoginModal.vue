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
      <!-- eslint-disable vue/no-v-html -->
      <!-- marked will sanitize the HTML injected -->
      <div class="body1">
        <p>
          SPARC Portal login authentication is provided by <a href="https://orcid.org">ORCID iD</a>. Create a SPARC Portal account or sign in to your existing SPARC Portal account by using your existing ORCID iD credentials. If you do not have an existing ORCID iD, please <a href="https://orcid.org/register">register here</a> for a free account.
        </p>
        <p>
          Upon initial login to the SPARC Portal via ORCID iD, you will also be creating* an account on <a href="https://app.pennsieve.io/">Pennsieve</a> to unlock all the features the SPARC Portal has to offer.
        </p>
        <p>
          Learn more <a href="https://docs.sparc.science/docs/sparc-portal-login">here</a> about why a Pennsieve account is being created for you and which features are enabled by the SPARC Portal login.
        </p>
      </div>
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
      <!-- eslint-disable vue/no-v-html -->
      <!-- marked will sanitize the HTML injected -->
      <p class="mt-16 body4">
        Use of the SPARC Portal, its data and resources, regardless of registration status, implies acceptance of the <a href="https://docs.sparc.science/docs/policies">SPARC Data and Resource Center Privacy Policy</a> and adherence to the <a href="https://docs.sparc.science/docs/terms-of-service">SPARC Terms of Service</a> and the <a href="https://docs.sparc.science/docs/instructions-for-sparc-investigators-to-cite-their-datasets-in-manuscripts-1">SPARC Citation Policy</a>. By signing in to SPARC, you are also accepting the <a href="https://docs.pennsieve.io/page/pennsieve-terms-of-use">Pennsieve Terms of Use</a> and <a href="https://docs.pennsieve.io/page/privacy-policy">Pennsieve Privacy Policy</a>.
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
import createClient from '@/plugins/contentful.js'
import marked from '@/mixins/marked/index'

const client = createClient()

export default {
  name: 'LoginModal',

  mixins: [marked],

  data() {
    return {
      dialogVisible: false,
    }
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    redirectUrl: {
      type: String,
      default: ''
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
      this.$cookies.set('sign-in-redirect-url', this.redirectUrl || this.$nuxt.$route.fullPath)
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
