a<template>
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
              :class="{ active: type.type === $route.query.type || (type.subtypes != undefined && type.subtypes.includes($route.query.type)) || ($route.query.type === undefined && type.type === 'feedback') }"
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
        <component
          :is="formComponent"
        />

        <div v-if="isGeneralSubmitted" class="msg-success">
          <template v-if="firstName">
            <p>{{ firstName }},</p>
          </template>
          <p>
            Thank you for your inquiry. A member of the SPARC team will contact
            you as soon as possible.
          </p>
          <a href="#" @click="resetForms">Submit another inquiry</a>
        </div>

        <div v-if="isBugSubmitted" class="msg-success">
          <p>
            Thank you for letting us know about this error or issue. If you
            requested a response, a member of the SPARC team will contact you
            as soon as possible.
          </p>
          <a href="#" @click="resetForms">Submit another inquiry</a>
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
import ToolsAndResourcesForm from '@/components/ToolsAndResourcesForm/ToolsAndResourcesForm.vue'
import NewsAndEventsForm from '@/components/NewsAndEventsForm/NewsAndEventsForm.vue'
import CommunitySpotlightForm from '@/components/CommunitySpotlightForm/CommunitySpotlightForm.vue'
import { defaultTo } from 'ramda'
import MarkedMixin from '@/mixins/marked'
import createClient from '@/plugins/contentful.js'

const client = createClient()
const formTypes = [
  {
    label: 'Share Feedback',
    type: 'feedback',
    description: "Use the form below to submit your inquiry. For other topics such as Help documentation or Tutorials, visit our <b><a href='https://docs.sparc.science' target='_blank'>Help Center</a></b>",
    subtypes: ['bug', 'portal-feedback', 'sparc-service', 'general']
  },
  {
    label: 'Share Research',
    type: 'research',
    description: "The SPARC Portal is open to everyone for sharing their research data. Tell us about your research.",
    subtypes: []
  },
  {
    label: 'Share News/Event',
    type: 'news-event',
    description: "Submit your news or event with SPARC. We will then be in contact about how we share this to the SPARC community",
    subtypes: []
  },
  {
    label: 'Share Your Story',
    type: 'story',
    description: "Submit your story on how you have used the SPARC Program to advance neuromodulation of the ANS. We will then be in contact about how we share this to the SPARC community.",
    subtypes: []
  },
  {
    label: 'Submit Tool',
    type: 'tool',
    description: "Submit your tool or resource with SPARC. We will then be in contact about how we share this to the SPARC community",
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
      // Get page content
      client.getEntry(process.env.ctf_contact_us_page_id)
    ])
      .then(([page]) => {
        return { ...page.fields }
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
            query: {
              type: 'feedback'
            }
          },
          label: 'Contact Us'
        },
      ],
      formType: '',
      formTypes,
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
      isBugSubmitted: false,
      isGeneralSubmitted: false,
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
      return this.$route.query.type === undefined || this.formType === feedbackFormType.type || feedbackFormType.subtypes.includes(this.formType)
    },
     formComponent: function() {
      return defaultTo('', formComponents[this.$route.query.type])
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
      title: this.breadcrumbTitle
    }
  },

  watch: {
    /**
     * Set formType data based on query param
     * @param {Object} to
     */
    $route: {
      handler(to) {
        this.formType = to.query.type === 'feedback' ? undefined : to.query.type
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
      this.isBugSubmitted = false
      this.isGeneralSubmitted = false
      this.formType = ''
      this.firstName = ''
    },

    /**
     * On general form meetings
     * @param {String} firstName
     */
    onGeneralFormSubmit: function(firstName) {
      this.firstName = firstName
      this.isGeneralSubmitted = true
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

<style lang="scss">
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
  &:focus,
  &.active {
    color: white;
    background-color: $purple;
    font-weight: 500;
  }
}
.contact-us-page {
  .el-form-item__label {
    color: $grey;
    font-size: 1.5rem;
    line-height: 2.25rem;
    font-weight: 500;
    margin-bottom: 1rem;
    padding-bottom: 0;
  }
  .el-select {
    max-width: 20rem;
    width: 100%;
  }
  .el-input,
  .el-textarea,
  .el-select-dropdown__item {
    ::placeholder {
      color: $lightGrey;
    }
  }
  .el-textarea__inner {
    border-color: $lightGrey;
    border-radius: 4px;
    padding-top: .75rem;
    padding-bottom: .75rem;
    font-family: inherit;
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
