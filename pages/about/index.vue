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
      <paper
        class="row mt-32"
        :text="parseMarkdown(sparcPortal)"
        :button-text="' View The Roadmap '"
        button-link-external="https://docs.sparc.science/docs/sparc-portal-roadmap"
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

      <div class="gallery-items-container p-32 mt-32">
        <div class="heading2 mb-16">Portal Metrics</div>
        <gallery
          galleryItemType="metrics"
          :items="metricsItems"
        />
        <nuxt-link
          to="about/metrics"
        >
          <el-button class="secondary mt-16">
            View All Metrics
          </el-button>
        </nuxt-link>
      </div>

      <div class="gallery-items-container p-32 mt-32">
        <div class="heading2 mb-16">Highlights</div>
        <gallery
          galleryItemType="highlights"
          :cardWidth="68"
          :items="highlightsItems"
        />
      </div>

      <div class="gallery-items-container p-32 mt-32">
        <div
          class="about-page-text"
          v-html="parseMarkdown(overview)"
        />
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
      highlightsItems: [],
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
      title: this.pageTitle,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.pageTitle,
        },
        {
          hid: 'description',
          name: 'description',
          content: this.heroCopy ? this.heroCopy : 'Stimulating Peripheral Activity to Relieve Conditions (SPARC)'
        },
      ]
    }
  },

  async fetch() {
    const day = new Date().getDay().toString().padStart(2, "0")
    const month = new Date().getMonth().toString().padStart(2, "0")
    const year = new Date().getFullYear()
    let totalDownloads, downloadsLastMonth, totalContributors, newContributors = 0
    await this.$axios
      .$get(`${process.env.METRICS_URL}/pennsieve?year=${year}&month=${month}`)
      .then((response) => {
        const metrics = response[0]
        totalContributors = parseInt(metrics['number_of_sparc_users_overall']['N'])
        newContributors = parseInt(metrics['number_of_new_sparc_users_last_quarter']['N'])
        downloadsLastMonth = parseInt(metrics['number_of_sparc_downloads_last_mo']['N'])
      }).catch((e) => {
        console.log("ERROR RETRIEVING CONTRIBUTORS: ", e)
      })
    await this.$axios
      .$get(`${process.env.discover_api_host}/metrics/dataset/downloads/summary?startDate=2020-01-01&endDate=${year}-${month}-${day}`)
      .then((data) => {
        totalDownloads = 0
        data.forEach(item => {
          if (item['origin'] === "SPARC") {
            totalDownloads += parseInt(item['downloads'])
          }
        })
      })
      .catch((e) => {
        console.log("ERROR RETRIEVING DOWNLOADS: ", e)
      })
    await client.getEntries({
        content_type: process.env.ctf_news_id,
        order: '-fields.publishedDate',
        limit: '999',
        'fields.subject': 'Highlight'
      })
      .then(({ items })=> {
        this.highlightsItems = items
      })
      .catch(() => {
        console.log("ERROR RETRIEVING HIGHLIGHTS")
      })
    this.metricsItems = [
      {
        title: 'Total Downloads',
        data: `${totalDownloads}`,
        subData: `(${downloadsLastMonth} last month)`
      },
      {
        title: 'Dataset Contributors',
        data: `${totalContributors}`,
        subData: `(${newContributors} new in the last month)`
      }
    ]
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
.gallery-items-container {
  background-color: white;
  border: 1px solid $lineColor1;
}

::v-deep h1 {
  font-size:2rem;
  font-weight:500;
  line-height:2.75rem;
}

::v-deep h2 {
  font-size:1.5rem;
  font-weight:500;
  line-height:2.25rem;
}

::v-deep h3 {
  font-size:1rem;
  font-weight:500;
  line-height:1.875rem;
}

</style>
