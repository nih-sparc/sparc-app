<template>
  <large-modal
    v-if="dialogVisible"
    :visible="dialogVisible"
    @close-download-dialog="dialogVisible = false"
  >
    <div class="content" slot="mainContent">
      <h1 class="heading1 mb-8">
        {{ fields.title }}
      </h1>
      <!-- eslint-disable vue/no-v-html -->
      <!-- marked will sanitize the HTML injected -->
      <div class="body1" v-html="parseMarkdown(fields.description)" />
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
      <div class="mt-16 body4" v-html="parseMarkdown(fields.termsAndConditions)" />
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
import ErrorMessages from '@/mixins/error-messages'
import marked from '@/mixins/marked/index'

const client = createClient()

export default {
  name: 'LoginModal',

  mixins: [marked],

  data() {
    return {
      dialogVisible: false,
      fields: {}
    }
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  fetch() {
    return client
      .getEntry(process.env.ctf_sparc_login_modal_id)
      .then(({ fields }) => {
          this.fields = fields
        }
      )
      .catch( e => {
        console.error(e)
        //Display the error page with an custom message
        error({ statusCode: 400, message: ErrorMessages.methods.contentful(), display: true, error: e} )
      })
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
      this.$cookies.set('sign-in-redirect-url', this.$nuxt.$route.fullPath)
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
