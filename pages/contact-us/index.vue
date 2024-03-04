<template>
  <div class="contact-us-page pb-16">
    <breadcrumb :breadcrumb="breadcrumb" :title="breadcrumbTitle" />
    <div class="container">
      <div class="tabs__container">
        <h3>
          Select Form
        </h3>
        <ul class="tabs">
          <li v-for="type in formTypes" :key="type.label">
            <nuxt-link
              class="tabs__button"
              @click.native="resetForms"
              :class="{ active: type.type === $route.query.type || (type.subtypes != undefined && type.subtypes.includes($route.query.type)) || ($route.query.type === undefined && type.type === 'research') }"
              :to="{
                name: 'contact-us',
                query: {
                  ...$route.query,
                  type: type.type,
                }
              }"
            >
              {{ type.label }}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="page-wrap container">
      <div class="subpage">
        <div v-if="formTypeObject" class="body1" v-html="formTypeObject.description"></div>
      </div>
    </div>
    <div class="page-wrap container">
      <div class="subpage mb-0">
        <template v-if="isFeedbackForm">
          <template v-if="!isSubmitted">
            <div class="heading2 mb-8">Let us know why you are contacting us:</div>
            <el-select
              v-model="formType"
              class="input-reason"
              placeholder="Select a reason"
              :popper-append-to-body="false"
            >
              <el-option
                v-for="option in feedbackFormTypeOptions"
                :key="option.key"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <hr v-if="isFeedbackForm && formType != undefined && formType != 'feedback'" class="mt-32 mb-32" />  
          </template>
        </template>
        <component
          v-if="!isSubmitted"
          :is="formComponent"
          @submit="formSubmitted"
        />

        <div v-if="isSubmitted" class="msg-success">
          <template v-if="firstName">
            <p>{{ firstName }},</p>
          </template>
          <p>
            Thank you for your submission!
          </p>
          <a href="#" @click="resetForms">Create another submission</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import GeneralForm from '@/components/ContactUsForms/GeneralForm/GeneralForm.vue'
import BugForm from '@/components/ContactUsForms/BugForm/BugForm.vue'
import FeedbackForm from '@/components/ContactUsForms/FeedbackForm/FeedbackForm.vue'
import InterestForm from '@/components/ContactUsForms/InterestForm/InterestForm.vue'
import ResearchForm from '@/components/ContactUsForms/ResearchForm/ResearchForm.vue'
import ToolsAndResourcesForm from '@/components/ContactUsForms/ToolsAndResourcesForm/ToolsAndResourcesForm.vue'
import NewsAndEventsForm from '@/components/ContactUsForms/NewsAndEventsForm/NewsAndEventsForm.vue'
import CommunitySpotlightForm from '@/components/ContactUsForms/CommunitySpotlightForm/CommunitySpotlightForm.vue'
import { defaultTo, pathOr, propOr } from 'ramda'
import MarkedMixin from '@/mixins/marked'
import createClient from '@/plugins/contentful.js'

const client = createClient()
let formTypes = [
  {
    type: 'research',
    id: '3gBm9CkPV1QiqevHHtQxqP',
    subtypes: []
  },
  {
    type: 'feedback',
    id: '1PEIbcIV21upAq55ocnakO',
    subtypes: ['bug', 'portal-feedback', 'sparc-service', 'general']
  },
  {
    type: 'news-event',
    id: '6yyjWHw7jfpH4qOqDXwfmi',
    subtypes: []
  },
  {
    type: 'story',
    id: '5ZoMC1OGTj1ibNXJ5Na4Ja',
    subtypes: []
  },
  {
    type: 'tool',
    id: '2FGDIx61NO5VBV3GBiXH2C',
    subtypes: []
  }
]
const formComponents = {
  bug: BugForm,
  'portal-feedback': FeedbackForm,
  'sparc-service': InterestForm,
  general: GeneralForm,
  research: ResearchForm,
  tool: ToolsAndResourcesForm,
  'news-event': NewsAndEventsForm,
  story: CommunitySpotlightForm,
}

export default {
  name: 'ContactUsPage',

  components: {
    Breadcrumb,
    PageHero,
    GeneralForm,
    BugForm,
    FeedbackForm,
    InterestForm,
    ResearchForm,
    ToolsAndResourcesForm,
    NewsAndEventsForm,
    CommunitySpotlightForm
  },

  mixins: [MarkedMixin],

  asyncData() {
    return Promise.all([
      client.getEntries({
        content_type: process.env.ctf_contact_us_form_type_id,
      })
    ])
    .then(([page]) => {
      const entries = propOr({}, 'items', page)
      formTypes.forEach(formType => {
        const formTypeId = formType.id
        const entry = entries.find(item => {
          const entryId = pathOr('', ['sys','id'], item)
          return entryId == formTypeId
        })
        formType.label = pathOr('', ['fields', 'title'], entry)
        formType.description = pathOr('', ['fields', 'description'], entry)
      })
      return { formTypes }
    })
    .catch(console.error)
  },

  data: () => {
    return {
      heroCopy: '',
      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        },
        {
          to: {
            name: 'contact-us',
          },
          label: 'Contact Us'
        },
      ],
      formType: '',
      feedbackFormTypeOptions: [
        {
          label: 'I want to report an error or an issue',
          value: 'bug'
        },
        {
          label: 'I have feedback about the SPARC Portal',
          value: 'portal-feedback'
        },
        {
          label: 'I am interested in a SPARC Service',
          value: 'sparc-service'
        },
        {
          label: 'I have another question or inquiry',
          value: 'general'
        },
      ],
      isSubmitted: false,
      firstName: ''
    }
  },

  computed: {
    breadcrumbTitle() {
      if (this.formTypeObject != undefined)
        return this.formTypeObject.label
      return this.formTypes[0].label
    },
    isFeedbackForm() {
      const feedbackFormType = this.formTypes.find(formType => formType.type === 'feedback')
      return this.$route.query.type === 'feedback' || this.formType === feedbackFormType.type || feedbackFormType.subtypes.includes(this.formType)
    },
    formComponent: function() {
      if (this.$route.query.type === 'feedback') {
        return ''
      }
      return defaultTo(ResearchForm, formComponents[this.$route.query.type])
    },
    formTypeObject() {
      if (this.formType == undefined)
        return this.formTypes[0]
      return this.formTypes.find(formType => {
        if (formType.type === this.formType)
          return true
        if (formType.subtypes.includes(this.formType))
          return true
      })
    }
  },

  head() {
    return {
      title: this.breadcrumbTitle,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.breadcrumbTitle,
        },
        {
          hid: 'description',
          name: 'description',
          content: this.formTypeObject.description ? this.formTypeObject.description : 'The open community platform for bridging the body and the brain through neuroscience and systems physiology data, computational and spatial modeling, and device design.'
        },
      ]
    }
  },

  watch: {
    /**
     * Set formType data based on query param
     * @param {Object} to
     */
    $route: {
      handler(to) {
        this.formType = to.query.type === 'research' ? undefined : to.query.type
      },
      immediate: true
    },

    /**
     * Set query param based on formType data
     * @param {String} val
     */
    formType(val) {
      this.$router.push({ query: { ...this.$route.query, type: val } })
    }
  },

  methods: {
    /**
     * Reset all form data
     */
    resetForms: function() {
      this.isSubmitted = false
      this.firstName = ''
    },
    formSubmitted(firstName) {
      this.firstName = firstName
      this.isSubmitted = true
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/_variables.scss';
.contact-us-page {
  background-color: #f5f7fa;
}
.page {
  display: flex;
  margin-top: 7rem;

  p {
    color: #606266;
  }
}
h2 {
  font-size: 1.5rem;
  line-height: 2rem;
}
.msg-success {
  font-size: 1.5rem;
  line-height: 2rem;
}
</style>

<style scoped lang="scss">
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.tabs__container {
  margin-top: 2rem;
  padding-top: 0.5rem;
  background-color: white;
  border: 0.1rem solid $lineColor2;
  h3 {
    padding-left: 0.75rem;
    font-weight: 600;
    font-size: 1.5rem;
  }
}
.tabs {
  display: flex;
  list-style: none;
  overflow: auto;
  margin: 0 0 0 0;
  padding: 0 0;
  outline: 0.1rem solid $purple;
  @media (max-width: 40rem) {
    display: block;
  }
  li {
    width: 100%;
    text-align: center;
    color: $purple;
  }
  li:last-child > a {
    border-right: none;
  }
}
hr {
  border-top: none;
  border-left: none;
  border-width: 2px;
  border-color: $lineColor1;
  margin: 2rem 0;
}
.tabs__button {
  background: #f9f2fc;
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  outline: none;
  padding: 0;
  text-decoration: none !important;
  text-transform: uppercase;
  line-height: 3.5rem;
  @media (min-width: 40rem) {
    font-size: 0.65rem;
    border-right: 0.1rem solid $purple;
  }
  @media (min-width: 50rem) {
    font-size: .75rem;
  }
  @media (min-width: 64rem) {
    font-size: 1.25rem;
    font-weight: 600;
    text-transform: none;
  }
  &:hover,
  &.active {
    color: white;
    background-color: $purple;
    font-weight: 500;
  }
}
.contact-us-page {
  ::v-deep .el-form-item__label {
    color: $grey;
    font-size: 1.5rem;
    line-height: 2.25rem;
    font-weight: 500;
    margin-bottom: .5rem;
    padding-bottom: 0;
  }
  ::v-deep .el-select {
    max-width: 20rem;
    width: 100%;
  }
  ::v-deep .el-input,
  .el-textarea,
  ::v-deep .el-select-dropdown__item {
    ::placeholder {
      color: $lightGrey;
    }
  }
  ::v-deep .el-textarea__inner {
    border-color: $lightGrey;
    border-radius: 4px;
    padding-top: .75rem;
    padding-bottom: .75rem;
    font-family: inherit;
  }
  ::v-deep .el-textarea {
    ::placeholder {
      color: $lightGrey;
    }
  }
  .input-reason {
    max-width: 36rem;
    width: 100%;
    ::placeholder {
      color: $grey;
    }
  }
}
</style>
