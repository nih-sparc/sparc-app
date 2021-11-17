<template>
  <div class="about-page">
    <breadcrumb :breadcrumb="breadcrumb" :title="pageTitle" />
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
            class="about-page-text top-margin"
            v-html="parseMarkdown(overview)"
          />
        </div>
      </div>

      <paper
        class="row top-margin"
        :text="parseMarkdown(sparcPortal)"
        :button-text="' About the SPARC Portal '"
        :button-link="aboutLink(aboutPortalPageId)"
        :img-src="sparcPortalImage ? sparcPortalImage.fields.file.url : null"
      />

      <div class="row top-margin">
        <paper
          class="row-item"
          :text="parseMarkdown(whatWeOffer)"
          :button-text="' What We Offer '"
          :button-link="aboutLink(whatWeOfferPageId)"
        />
        <paper
          class="row-item"
          :text="parseMarkdown(teamLeadership)"
          :button-text="' Team & Leadership '"
          :button-link="aboutLink(teamAndLeadershipPageId)"
        />
        <paper
          class="row-item"
          :text="parseMarkdown(getInvolved)"
          :button-text="' Get Involved '"
          :button-link="aboutLink(getInvolvedPageId)"
        />
      </div>

      <div class="row top-margin about-page-border">
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
            <el-button class="about-button"> View Spotlight </el-button>
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

import MarkedMixin from '@/mixins/marked'
import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'AboutPage',

  components: {
    Breadcrumb,
    PageHero,
    Paper
  },

  mixins: [MarkedMixin],

  asyncData() {
    return Promise.all([
      // Get page content
      client.getEntry(process.env.ctf_about_page_id)
    ])
      .then(([page]) => {
        return { ...page.fields }
      })
      .catch(console.error)
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
      projectId: process.env.ctf_project_id,
      heroImage: {},
      futurePlans: '',
      aboutPortalPageId: process.env.ctf_about_portal_page_id,
      whatWeOfferPageId: process.env.ctf_what_we_offer_page_id,
      teamAndLeadershipPageId: process.env.ctf_team_and_leadership_page_id,
      getInvolvedPageId: process.env.ctf_get_involved_page_id
    }
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
@import '@/assets/_variables.scss';
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

.about-button {
  border: 2px solid $median;
  background-color: ghostwhite;
}

.portal-image {
  height: auto;
  width: 30%;
  min-width: 20rem;

  @media screen and (max-width: 767px) {
    display: none;
  }
}

.top-margin {
  margin-top: 4rem;
  @media screen and (max-width: 767px) {
    margin-top: 1rem;
  }
}

.margin-top-auto {
  margin-top: auto;
}

.midnightblue-background {
  background-color: midnightblue;
}

.white-text {
  color: white;
}

.about-page-border {
  border: 1px solid #dcdfe6;
}
</style>
