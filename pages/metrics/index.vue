<template>
  <div class="metrics-page pb-16">
    <breadcrumb :breadcrumb="breadcrumb" title="Metrics" />
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
            class="metrics-page-text mt-32"
            v-html="parseMarkdown(overview)"
          />
          </div>
        </div>
        <!--
        <paper
        class="row mt-32"
        :text="parseMarkdown(sparcPortal)"
        :button-text="' About the SPARC Portal '"
        :button-link="aboutLink(aboutPortalPageId)"
        :img-src="sparcPortalImage ? sparcPortalImage.fields.file.url : null"
      />
      -->
      </div>
  </div>
</template>

<script>
import PageHero from '@/components/PageHero/PageHero.vue'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import Paper from '@/components/Paper/Paper.vue'
import createClient from '@/plugins/contentful.js'
import ContentfulErrorHandle from '@/mixins/contentful-error-handle'
import MarkedMixin from '@/mixins/marked'

const client = createClient()
export default {
  name: 'SparcMetrics',

  components: {
    PageHero,
    BreadCrumb,
    Paper
  },

  mixins: [ContentfulErrorHandle, MarkedMixin],

  asyncData({ $axios }) {
    //
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
      heroImage: {},
    }
  },
    methods: {
    }

}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.metrics-page {
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
  .metrics-page-text {
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

</style>
