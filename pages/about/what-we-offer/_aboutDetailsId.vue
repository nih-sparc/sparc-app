<template>
  <div>
    <breadcrumb
      :breadcrumb="breadcrumb"
      :title="aboutDetailsItem.fields.title"
    />
    <page-hero>
      <h1>{{ aboutDetailsItem.fields.title }}</h1>
      <p>{{ aboutDetailsItem.fields.summary }}</p>
    </page-hero>
    <div class="container">
      <div class="subpage">
        <div v-html="parseMarkdown(aboutDetailsItem.fields.description)" />
        <hr />
        <p class="share-text">
          SHARE
        </p>
        <share-links :url="pageUrl" :title="aboutDetailsItem.fields.title"/>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import ShareLinks from '~/components/ShareLinks/ShareLinks.vue'

import MarkedMixin from '@/mixins/marked'
import createClient from '@/plugins/contentful.js'

import { successMessage, failMessage } from '@/utils/notification-messages'

const client = createClient()

const getAboutDetailsItem = async id => {
  try {
    const isSlug = id.split('-').length > 1
    const item = isSlug
      ? await client.getEntries({
          content_type: process.env.ctf_about_details_content_type_id,
          'fields.slug': id
        })
      : await client.getEntry(id)
    return isSlug ? item.items[0] : item
  } catch (error) {
    return {}
  }
}

export default {
  name: 'WhatWeOfferAboutDetailsId',

  components: {
    Breadcrumb,
    PageHero,
    ShareLinks
  },

  mixins: [MarkedMixin],

  async asyncData({ params, redirect }) {
    const aboutDetailsItem = await getAboutDetailsItem(params.aboutDetailsId)

    // Redirect to the friendly URL page, if this page has a slug
    const slug = aboutDetailsItem.fields.slug
    if (slug && params.aboutDetailsId !== slug) {
      redirect({
        name: 'about-what-we-offer-aboutDetailsId',
        params: { aboutDetailsId: slug }
      })
    }

    return {
      aboutDetailsItem: aboutDetailsItem,
      heroCopy: '',
      copy: '',
      breadcrumb: [
        {
          label: 'Home',
          to: {
            name: 'index'
          }
        },
        {
          label: 'About SPARC',
          to: {
            name: 'about'
          }
        },
        {
          label: aboutDetailsItem.fields.type,
          to: {
            name: 'about-what-we-offer'
          }
        }
      ]
    }
  },

  head() {
    return {
      title: this.aboutDetailsItem.fields.title
    }
  },

  methods: {
    /**
     * Copy file URL to clipboard
     * @param {Object} scope
     */
    copyUrl() {
      this.$copyText(window.location.href).then(
        () => {
          this.$message(successMessage(`URL copied to clipboard.`))
        },
        () => {
          this.$message(failMessage(`Cannot copy to clipboard.`))
        }
      )
    },
    /**
     * Construct current url 
     * @returns {String}
     */
    pageUrl: function() {
      return `${process.env.ROOT_URL}${this.$route.fullPath}`
    },
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/_variables.scss';
.subpage {
  margin: 1em 0;
  padding: 1em;
  border: 1px solid #dcdfe6;
  background: white;

  @media (min-width: 48em) {
    margin: 2.5em 0;
    padding: 1em 2em;
  }

  hr {
    opacity: 0.3;
  }
}

.share-text {
  font-weight: 500;
  margin-bottom: 0;
}
</style>
