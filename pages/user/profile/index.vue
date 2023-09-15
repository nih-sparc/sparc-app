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
          <div class="resource-container body1">
            SPARC Newsletter: 
            <template v-if="!isSubscribed">
              <span class="label4"><b>You are not subscribed.</b></span>
              <div class="body4">
                Keep up to date with all the latest news and events from the SPARC Portal by subscribing to our newsletter. View all past newsletters <a href="//us2.campaign-archive.com/home/?u=e60c48f231a30b544eed731ea&id=c81a347bd8" target="_blank">here</a>.
              </div>
              <div class="mt-8">
                <el-button class='secondary' v-on:click='subscribeToNewsletter(profileEmail, firstName, lastName)'>Subscribe to newsletter</el-button>
              </div>
            </template>
            <template v-else>
              <span class="label4"><b>You are currently subscribed.</b></span>
              <div class="body1">
                View all past newsletters <nuxt-link to="/news-and-events#stayConnected">here</nuxt-link>.
              </div>
              <div class="mt-8">
                <el-button class='secondary' v-on:click='unsubscribeFromNewsletter(profileEmail)'>Un-subscribe from newsletter</el-button>
              </div>
            </template>
          </div>
          <div class="resource-container body1">
            Pennsieve: 
            <span class="label4"><b>You are registered.</b></span>
            <div class="body4">
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
            <span class="heading2 mb-16">Published Datasets ({{ datasets.length }})</span>
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
            v-loading="datasetsLoading"
            galleryItemType="datasets"
            :items="datasets"
          />
        </div>
        <div  v-if="showDatasetSubmissionFeature" class="section heading2 p-16 mt-16">
          <div class="datasets-container-title">
            <span class="heading2">Dataset Submission Requests ({{ datasetSubmissions.length }})</span>
            <span>
              <el-popover
                width="fit-content"
                trigger="hover"
                :append-to-body=false
                popper-class="popover"
                >
                <svg-icon slot="reference" class="icon-help" icon="icon-help" width="26" height="26" />
                <div>
                  In order to publish a dataset on the SPARC Portal your submission must first be approved by the curation team. If there are dataset requests that you think are missing please contact curation@sparc.science
                </div>
              </el-popover>
            </span>
          </div>
          <div v-loading="submissionsLoading">
            <template v-for="datasetSubmission in datasetSubmissions">
              <div :key="datasetSubmission.id" class="resource-container row">
                <span class="body1 left-col mr-16">
                  <div class="link1 submission-name" v-on:click="submissionNameClicked(datasetSubmission)">{{ datasetSubmission.name }}</div>
                  <div v-if="isDraft(datasetSubmission)" class="body4">
                    Updated: {{ getUpdatedDate(datasetSubmission) }}
                  </div>
                  <div v-else class="body4">
                    Submitted: {{ getSubmittedDate(datasetSubmission) }}
                  </div>
                  <div class="label1">
                    Status: {{ getStatus(datasetSubmission) }}
                  </div>
                </span>
                <span class="right-col">
                  <template v-if="isDraft(datasetSubmission)">
                    <el-button v-on:click="submitDraft(datasetSubmission.nodeId)"  class="secondary submit-button">
                      Submit Draft
                    </el-button>
                    <el-button v-on:click="deleteClicked(datasetSubmission)" class="danger">
                      Delete Draft
                    </el-button>
                  </template>
                  <el-button v-else-if="isSubmitted(datasetSubmission)" v-on:click="retractClicked(datasetSubmission)" class="secondary">
                    Retract Request
                  </el-button>
                  <el-button v-else-if="isWithdrawn(datasetSubmission) || isRejected(datasetSubmission)" v-on:click="deleteClicked(datasetSubmission)" class="danger">
                    Delete Request
                  </el-button>
                </span>
              </div>
            </template>
          </div>
          <el-button class='secondary mt-16' v-on:click='newRequestClicked'>Submit new request</el-button>
        </div>
      </div>
    </div>
    <dataset-submission-modal
      :show-modal="showDatasetSubmissionModal"
      :questions="questions"
      :default-form="defaultForm"
      :disabled="datasetSubmissionDisabled"
      @modal-closed="showDatasetSubmissionModal = false"
      @proposal-submitted="fetchDatasetSubmissions"
    />
    <confirmation-modal
      :show-modal="showDeleteConfirmationModal"
      @confirmed="deleteSubmission"
      @cancelled="showDeleteConfirmationModal = false"
      @modal-closed="submissionToDelete = ''"
    >
      <p class="body1" slot="confirmation-body">
        Are you sure you want to delete?
      </p>
    </confirmation-modal>
    <confirmation-modal
      :show-modal="showRetractConfirmationModal"
      @confirmed="retractSubmission"
      @cancelled="showRetractConfirmationModal = false"
      @modal-closed="submissionToRetract = ''"
    >
      <template slot="confirmation-body">
        <div class="confirmation-body">
          <p class="label4">
            Withdraw Dataset Proposal: "{{submissionToRetract.name}}"?
          </p>
          <p class="body4 danger-text">
            This will withdraw the request to review and consider the dataset proposal from SPARC.
          </p>
        </div>
      </template>
    </confirmation-modal>
  </div>
</template>

<script>
import { failMessage } from '@/utils/notification-messages'
import { pathOr, propOr } from 'ramda'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import Gallery from '~/components/Gallery/Gallery.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import NewsletterMixin from '@/components/ContactUsForms/NewsletterMixin'
import AuthenticatedMixin from '@/mixins/authenticated/index'
import DatasetSubmissionModal from '@/components/DatasetSubmissionModal/DatasetSubmissionModal.vue'
import createAlgoliaClient from '@/plugins/algolia.js'
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal.vue'

const algoliaClient = createAlgoliaClient()
const algoliaIndex = algoliaClient.initIndex(process.env.ALGOLIA_INDEX)

export default {
  name: 'profile',

  components: {
    Breadcrumb,
    ConfirmationModal,
    DatasetSubmissionModal,
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
      datasetSubmissions: [],
      showDatasetSubmissionModal: false,
      datasetsLoading: true,
      submissionsLoading: true,
      questions: [],
      defaultForm: {},
      datasetSubmissionDisabled: false,
      submissionToDelete: '',
      showDeleteConfirmationModal: false,
      submissionToRetract: '',
      showRetractConfirmationModal: false,
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
    showDatasetSubmissionFeature() {
      return process.env.SHOW_DATASET_SUBMISSION_FEATURE == 'true'
    }
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
    orcid: {
      handler: async function(newValue) {
        if (newValue && newValue !== '') {
          this.fetchPublishedDatasets(newValue)
          this.fetchDatasetSubmissions()
          this.fetchQuestions()
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
          const datasetName = pathOr('', ['item','name'], hit)
          const datasetId = propOr('', 'objectID', hit)
          const pennsieveIdentifier = pathOr('', ['item', 'identifier'], hit)
          const numCitations = await this.getCitationsCount(pennsieveIdentifier)
          const numDownloads = this.getDownloadsCount(datasetId)
          items.push({
            'name': datasetName,
            'intId': datasetId,
            'banner': pathOr('', ['pennsieve','banner','uri'], hit),
            'numDownloads': numDownloads,
            'numCitations': numCitations
          })
        })
        return items
      })
      .catch(() => {
        return []
      }).finally(() => {
        this.datasetsLoading = false
      })
    },
    async fetchDatasetSubmissions() {
      const headers = { 'Authorization': `Bearer ${this.userToken}` }
      this.datasetSubmissions = await this.$axios
        .get(`${process.env.PENNSIEVE_API_VERSION_2}/publishing/proposal`, { headers })
        .then(({ data }) => {
          return data
        }).catch(() => {
          return []
        }).finally(() => {
          this.submissionsLoading = false
        })
    },
    async fetchQuestions() {
      const headers = { 'Authorization': `Bearer ${this.userToken}` }
      const repoUrl = `${process.env.PENNSIEVE_API_VERSION_2}/publishing/repositories`
      await this.$axios
        .get(repoUrl, { headers })
        .then(({ data }) => {
          this.questions = data.find(repo => repo.name === 'sparc')?.questions
        }).catch(() => {
          this.hasError = true
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
    },
    getSubmittedDate(submission) {
      const unixTime = propOr('0', 'submittedAt', submission)
      const submittedDate = new Date(unixTime * 1000)
      const month = submittedDate.toLocaleString('default', { month: 'long' })
      return `${submittedDate.getDate()} ${month} ${submittedDate.getFullYear()}`
    },
    getUpdatedDate(submission) {
      const unixTime = propOr('0', 'updatedAt', submission)
      const updatedDate = new Date(unixTime * 1000)
      const month = updatedDate.toLocaleString('default', { month: 'long' })
      return `${updatedDate.getDate()} ${month} ${updatedDate.getFullYear()}`
    },
    isDraft(submission) {
      return propOr('', 'proposalStatus', submission) === 'DRAFT'
    },
    isSubmitted(submission) {
      return propOr('', 'proposalStatus', submission) === 'SUBMITTED'
    },
    isWithdrawn(submission) {
      return propOr('', 'proposalStatus', submission) === 'WITHDRAWN'
    },
    isRejected(submission) {
      return propOr('', 'proposalStatus', submission) === 'REJECTED'
    },
    getStatus(submission) {
      return propOr('UNKNOWN', 'proposalStatus', submission)
    },
    newRequestClicked() {
      this.defaultForm = {}
      this.datasetSubmissionDisabled = false
      this.showDatasetSubmissionModal = true
    },
    submissionNameClicked(submission) {
      this.datasetSubmissionDisabled = true
      let form = {
        detailedDescription: submission.description,
        shortDescription: submission.name
      }
      this.questions.forEach(question => {
        const key = question.id
        form[key] = submission.survey?.find(question => question.questionId == key).response || ''
      })
      this.defaultForm = form
      this.showDatasetSubmissionModal = true
    },
    submitDraft(nodeId) {
      const headers = { 'Authorization': `Bearer ${this.userToken}` }
      this.$axios
        .post(`${process.env.PENNSIEVE_API_VERSION_2}/publishing/proposal/submit?node_id=${nodeId}`, {}, { headers })
        .catch(() => {
          this.$message(failMessage('Failed to submit draft.'))
        }).finally(() => {
          this.fetchDatasetSubmissions()
        })
    },
    deleteClicked(nodeId) {
      this.submissionToDelete = nodeId
      this.showDeleteConfirmationModal = true
    },
    deleteSubmission() {
      const headers = { 'Authorization': `Bearer ${this.userToken}` }
      this.$axios
        .delete(`${process.env.PENNSIEVE_API_VERSION_2}/publishing/proposal?proposal_node_id=${this.submissionToDelete.nodeId}`, { headers })
        .catch(() => {
          this.$message(failMessage('Failed to delete.'))
        }).finally(() => {
          this.fetchDatasetSubmissions()
          this.showDeleteConfirmationModal = false
        })
    },
    retractClicked(submission) {
      this.submissionToRetract = submission
      this.showRetractConfirmationModal = true
    },
    retractSubmission() {
      const headers = { 'Authorization': `Bearer ${this.userToken}` }
      this.$axios
        .post(`${process.env.PENNSIEVE_API_VERSION_2}/publishing/proposal/withdraw?node_id=${this.submissionToRetract.nodeId}`, {}, { headers })
        .catch(() => {
          this.$message(failMessage('Failed to retract request.'))
        }).finally(() => {
          this.fetchDatasetSubmissions()
          this.showRetractConfirmationModal = false
        })
    },
  }
}

</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.submission-request {
  border: 1px solid $lineColor2;
}
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
.row {
  display: flex;
  .right-col {
    width: fit-content;
    .secondary, .danger {
      display: block;
      margin: 0;
      min-width: 9.75rem;
    }
    .submit-button {
      margin-bottom: .25rem;
    }
  }
  .left-col {
    width: 100%;
  }
}
.link1 {
  text-decoration: underline;
  cursor: pointer;
}
.submission-name {
  width: fit-content;
}
.danger-text {
  color: $danger !important
}
.confirmation-body {
  text-align: center;
}
::v-deep .popover {
  background-color: #f9f2fc;
  word-wrap: normal;
  word-break: normal;
  max-width: 300px;
}
</style>
