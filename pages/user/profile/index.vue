<template>
  <div>
    <breadcrumb :breadcrumb="breadcrumb" :title=title />
    <page-hero>
      <h1>{{ title }}</h1>
      <p>
        The SPARC Portal account allows you to fully utilize portal functionality. <a href="https://docs.sparc.science/docs/sparc-portal-login" target="_blank">Learn more</a> about which features require login and find out more details about why a Pennsieve account is created for you in the process.
      </p>
    </page-hero>
    <div class="background-container">
      <div class="container py-24">
        <div class="section p-16 mt-16">
          <div class="heading2">
            My Information
          </div>
          <el-row>
            <el-col :span=12>
              <div class="body1">First name: <span class="heading3"><b>{{firstName}}</b></span></div>
              <div class="body1">Last name: <span class="heading3"><b>{{lastName}}</b></span></div>
              <div class="body1">E-mail: <span class="heading3"><b>{{profileEmail}}</b></span></div>
            </el-col>
            <el-col :span=12>
              <div v-if="orcid" class="body1">ORCID: 
                <span>
                  <a :href="orcidUri" target="_blank">{{ orcid }}</a>
                </span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="section heading2 p-16 mt-16">
          Available Resources
          <div class="resource-container heading2">
            SPARC Newsletter: 
            <template v-if="!isSubscribed">
              <div class="heading3"><b>You are not subscribed.</b></div>
              <div class="body1">
                Keep up to date with all the latest news and events from the SPARC Portal by subscribing to our newsletter. View all past newsletters <a href="//us2.campaign-archive.com/home/?u=e60c48f231a30b544eed731ea&id=c81a347bd8" target="_blank">here</a>.
              </div>
              <div class="mt-8">
                <el-button class='secondary' v-on:click='subscribeToNewsletter(profileEmail, firstName, lastName)'>Subscribe to newsletter</el-button>
              </div>
            </template>
            <template v-else>
              <span class="heading3"><b>You are currently subscribed.</b></span>
              <div class="body1">
                View all past newsletters <nuxt-link to="/news-and-events#stayConnected">here</nuxt-link>.
              </div>
              <div class="mt-8">
                <el-button class='secondary' v-on:click='unsubscribeFromNewsletter(profileEmail)'>Un-subscribe from newsletter</el-button>
              </div>
            </template>
          </div>
          <div class="resource-container heading2">
            Pennsieve: 
            <div class="heading3"><b>You are registered.</b></div>
            <div class="body1">
              The Pennsieve Data Management Platform provides a scalable cloud-based solution for managing, analyzing, and sharing scientific datasets.
            </div>
            <div class="mt-8">
              <a href="https://app.pennsieve.io/#" target="_blank">
                <el-button class='secondary'>
                  Launch Pennsieve <svg-icon icon="icon-open" height="16" width="16" />
                </el-button>
              </a>
            </div>
          </div>
        </div>

        <div class="section heading2 p-16 mt-16">
          <div class="datasets-container-title">
            <span class="heading2 mb-16">My Published Datasets ({{ datasets.length }})</span>
            <span>
              <el-popover
                width="fit-content"
                trigger="hover"
                :append-to-body=false
                popper-class="popover"
                >
                <svg-icon slot="reference" class="icon-help" icon="icon-help" width="26" height="26" />
                <div>
                  My published Datasets relates to all Datasets, Computational and Anatomical models where you have been associated to the dataset using your ORCID number. If there are datasets that you feel should be linked to you please contact curation@sparc.science
                </div>
              </el-popover>
            </span>
          </div>
          <gallery
            galleryItemType="datasets"
            :items="datasets"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { pathOr, propOr } from 'ramda'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import Gallery from '~/components/Gallery/Gallery.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import NewsletterMixin from '@/components/ContactUsForms/NewsletterMixin'
import AuthenticatedMixin from '@/mixins/authenticated/index'
import createAlgoliaClient from '@/plugins/algolia.js'

const algoliaClient = createAlgoliaClient()
const algoliaIndex = algoliaClient.initIndex(process.env.ALGOLIA_INDEX)

export default {
  name: 'profile',

  components: {
    Breadcrumb,
    Gallery,
    PageHero
  },

  async asyncData({env, $axios}) {
    let downloadsSummary = 0
    try {
      const startDate = new Date('2000','1');
      const currentDate = new Date()
      const url = `${env.LOGIN_API_URL}/discover/metrics/dataset/downloads/summary`
      downloadsSummary = await $axios.$get(url, {
          params: { startDate: startDate, endDate: currentDate }
        }).then(response => {
          return response
      })
    } catch (error) {
      return 0
    }
    return {
      downloadsSummary
    }
  },

  data: () => {
    return {
      title: "SPARC Profile",
      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        }
      ],
      datasets: [],
    }
  },

  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.title,
        },
        {
          hid: 'description',
          name: 'description',
          content: 'The SPARC Portal account allows you to fully utilize portal functionality.'
        },
      ]
    }
  },

  computed: {
    ...mapGetters('user', ['firstName', 'lastName', 'profileEmail', 'cognitoUserToken', 'pennsieveUser']),
    userToken() {
      return this.cognitoUserToken || this.$cookies.get('user-token')
    },
    isSubscribed: function() {
      return propOr('unsubscribed', 'status', this.memberInfo) === 'subscribed'
    },
    orcid() {
      return pathOr(null, ['orcid', 'orcid'], this.pennsieveUser)
    },
    orcidUri() {
      return `https://orcid.org/${this.orcid}`
    },
  },

  mixins: [AuthenticatedMixin, NewsletterMixin],

  watch: {
    profileEmail: {
      handler: async function(newValue) {
        if (newValue !== '') {
          this.getMemberInfo(newValue)
        }
      },
      immediate: true
    },
    userToken: {
      handler: async function(newValue) {
        if (newValue && newValue !== '') {
          this.fetchPublishedDatasets()
        }
      },
      immediate: true
    },
    orcid: {
      handler: async function(newValue) {
        if (newValue && newValue !== '') {
          this.fetchPublishedDatasets(newValue)
        }
      },
      immediate: true
    },
  },
  methods: {
    async fetchPublishedDatasets(orcid) {
      const filter = `contributors.curie:\"ORCID:${orcid}\"`
      this.datasets = await algoliaIndex.search('', {
        filters:filter,
        hitsPerPage: 999
      }).then(async ({ hits }) => {
        let items = []
        await hits.forEach(async hit => {
            const datasetId = propOr('', 'objectID', hit)
            const pennsieveIdentifier = pathOr('', ['item', 'identifier'], hit)
            const numCitations = await this.getCitationsCount(pennsieveIdentifier)
            const numDownloads = this.getDownloadsCount(datasetId)
            items.push({
              ...hit,
              'banner': pathOr('', ['pennsieve','banner','uri'], hit),
              'numDownloads': numDownloads,
              'numCitations': numCitations
            })
          })
          return items
        })
        .catch(() => {
          return []
        })
    },
    async getCitationsCount(id) {
      try {
        const headers = { 'Authorization': `Bearer ${this.userToken}` }
        const url = `${process.env.LOGIN_API_URL}/datasets/${id}/external-publications`
        return this.$axios.$get(url, { headers }).then(response => {
            let numCitations = propOr('0', 'length', response)
            return numCitations
        })
      } catch (error) {
        return 0
      }
    },
    getDownloadsCount(id) {
      let numDownloads = 0
      this.downloadsSummary.filter(download => download.datasetId == id).forEach(item => {
        numDownloads += item.downloads;
      })
      return numDownloads
    }
  }
}

</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

a {
  text-decoration: underline;
}
.section {
  background-color: white;
  border: 2px solid $lineColor1;
}
.icon-help {
  fill: $purple;
}
.background-container {
  background-color: #f5f7fa
}
.resource-container {
  padding: .5rem;
  margin-top: .5rem;
  border: 1px solid $lineColor2;
}
.datasets-container-title {
  display: flex;
  justify-content: space-between;
}

::v-deep .popover {
  background-color: #f9f2fc;
  word-wrap: normal;
  word-break: normal;
  max-width: 300px;
}
</style>
