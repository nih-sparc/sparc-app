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
        <share-links />
      </div>
      <div v-if="aboutDetailsItem.fields.learnMore" class="subpage">
        <h1 class="heading1 mb-16">Learn More</h1>
        <learn-more-card
          v-for="(item, index) in aboutDetailsItem.fields.learnMore"
          :key="`${item}-${index}`"
          :about-details-item="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import LearnMoreCard from '@/components/LearnMoreCard/LearnMoreCard.vue'
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
  name: 'AboutDetailsId',

  components: {
    Breadcrumb,
    PageHero,
    LearnMoreCard,
    ShareLinks
  },

  mixins: [MarkedMixin],

  async asyncData({ params, redirect }) {
    const aboutDetailsItem = await getAboutDetailsItem(params.aboutDetailsId)

    // Redirect to the friendly URL page, if this page has a slug
    const slug = aboutDetailsItem.fields.slug
    if (slug && params.entryId !== slug) {
      redirect({
        name: `about-${slug}`
      })
    }
    return {
      aboutDetailsItem: aboutDetailsItem,
      heroCopy: '',
      copy: '',
      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        },
        {
          label: 'About',
          to: {
            name: 'about'
          }
        }
      ]
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
    }
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
  h1 {
    font-weight: 300;
  }
}

.share-text {
  font-weight: 500;
  margin-bottom: 0;
}
</style>
