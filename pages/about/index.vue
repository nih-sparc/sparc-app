<template>
  <div class="about-page pb-16">
    <breadcrumb :breadcrumb="breadcrumb" title="About SPARC" />
    <page-hero v-if="heroCopy">
      <h1>{{ pageTitle }}</h1>
      <!-- eslint-disable vue/no-v-html -->
      <!-- marked will sanitize the HTML injected -->
      <div v-html="parseMarkdown(heroCopy)" />
    </page-hero>
    <div class="page-wrap container">
      <div class="row">
        <div class="col">
          <div
            class="about-page-text mt-32"
            v-html="parseMarkdown(overview)"
          />
        </div>
      </div>

      <paper
        class="row mt-32"
        :text="parseMarkdown(sparcPortal)"
        :button-text="' About the SPARC Portal '"
        :button-link="aboutLink(aboutPortalPageId)"
        :img-src="sparcPortalImage ? sparcPortalImage.fields.file.url : null"
      />

      <div class="row mt-32">
        <paper
          class="row-item"
          :text="parseMarkdown(whatWeOffer)"
          :button-text="' What We Offer '"
          :button-link="aboutLink(whatWeOfferPageId)"
        />
        <paper
          class="row-item"
          :text="parseMarkdown(teamLeadership)"
          :button-text="' Who We Are '"
          :button-link="aboutLink(teamAndLeadershipPageId)"
        />
        <paper
          class="row-item"
          :text="parseMarkdown(getInvolved)"
          :button-text="' Help Us Grow '"
          :button-link="aboutLink(getInvolvedPageId)"
        />
      </div>

      <div class="gallery-container p-16 mt-32">
        <div class="heading2 mb-16">Portal Metrics</div>
        <gallery
          galleryItemType="metrics"
          :items="metricsItems"
        />
        <nuxt-link
          to="about/sparc-portal/metrics"
        >
          <el-button class="secondary mt-16">
            View All Metrics
          </el-button>
        </nuxt-link>
      </div>

      <div class="row mt-32 about-page-border">
        <img
          v-if="sparcPortalImage"
          slot="image"
          class="portal-image"
          :src="communitySpotlightImage.fields.file.url"
        />
        <div class="subpage-col midnightblue-background">
          <div
            class="about-page-text white-text"
            v-html="parseMarkdown(communitySpotlight)"
          />
          <NuxtLink
            class="margin-top-auto"
            to="/news-and-events/community-spotlight"
          >
            <el-button class="secondary"> View Spotlight </el-button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import Paper from '@/components/Paper/Paper.vue'
import Gallery from '~/components/Gallery/Gallery.vue'

import createClient from '@/plugins/contentful.js'

import ContentfulErrorHandle from '@/mixins/contentful-error-handle'
import MarkedMixin from '@/mixins/marked'

const client = createClient()

export default {
  name: 'AboutPage',

  components: {
    Breadcrumb,
    PageHero,
    Paper,
    Gallery
  },

  mixins: [ContentfulErrorHandle, MarkedMixin],

  asyncData() {
    return Promise.all([
      // Get page content
      client.getEntry(process.env.ctf_about_page_id)
    ])
      .then(([page]) => {
        return { ...page.fields }
      })
      .catch((e) => {
        console.error(e);
        //The ContentfulErrorHandle mixins will display out an
        //error message
        return { contentfulError: true }
      })
  },

  data: () => {
    return {
      heroCopy: '',
      copy: '',
      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        }
      ],
      metricsItems: [],
      projectId: process.env.ctf_project_id,
      heroImage: {},
      futurePlans: '',
      aboutPortalPageId: process.env.ctf_about_portal_page_id,
      whatWeOfferPageId: process.env.ctf_what_we_offer_page_id,
      teamAndLeadershipPageId: process.env.ctf_team_and_leadership_page_id,
      getInvolvedPageId: process.env.ctf_get_involved_page_id
    }
  },

  head() {
    return {
      title: this.pageTitle
    }
  },

  async fetch() {
    const month = new Date().getMonth()
    const year = new Date().getFullYear()
    await this.$axios
      .$get(`https://dev-metrics.sparc.science/pennsieve?year=${year}&month=${month}`)
      .then((response) => {
        const metrics = response[0]
        const downloadsLastQuarter = parseInt(metrics['number_of_sparc_downloads_last_quarter']['N'])
        const downloadsLastMonth = parseInt(metrics['number_of_sparc_downloads_last_mo']['N'])
        const totalContributors = parseInt(metrics['number_of_sparc_users_overall']['N'])
        const newContributors = parseInt(metrics['number_of_new_sparc_users_last_quarter']['N'])
        this.metricsItems = [
          {
            title: 'Downloads last month',
            data: `${downloadsLastMonth}`,
            subData: `(${downloadsLastQuarter} last quarter)`
          },
          {
            title: 'Dataset Contributors',
            data: `${totalContributors}`,
            subData: `(${newContributors} new in the last month)`
          }
        ]
      })
      .catch(() => {
        console.log("ERROR RETRIEVING METRICS")
      })
  },

  methods: {
    /**
     * Compute the link to the help article
     * This will use the slug if available, and fallback
     * to the ID of the entry if not
     * @returns {Object}
     */
    aboutLink(entryId) {
      const route = 'about-aboutDetailsId'
      const aboutDetailsId = entryId
      return { name: route, params: { aboutDetailsId } }
    }
  }
}
</script>

<style scoped lang="scss">
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.about-page {
  background-color: $background;
}
.page {
  display: flex;
  margin-top: 7rem;

  p {
    color: #606266;
  }
}

.subpage-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: white;
  padding: 2rem;

  @media screen and (max-width: 767px) {
    margin-top: 0;
  }
  .about-page-text {
    @media screen and (max-width: 767px) {
      margin-left: 0;
    }
  }
}

.row-item {
  width: 30%;
  display: flex;
  @media screen and (max-width: 767px) {
    width: 100%;
  }
}

.row {
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
}

.portal-image {
  height: auto;
  width: 30%;
  min-width: 20rem;

  @media screen and (max-width: 767px) {
    display: none;
  }
}

.margin-top-auto {
  margin-top: auto;
}

.midnightblue-background {
  background-color: $darkBlue;
}

.white-text {
  color: white;
}

.about-page-border {
  border: 1px solid $lineColor2;
}
.gallery-container {
  background-color: white;
  border: 1px solid $lineColor1;
}
</style>
