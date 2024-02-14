<template>
  <div :v-if="isDestinationLinkRetreived" class="news-list-item">
    <div v-if="item.fields.image" class="image">
      <event-banner-image :src="item.fields.image.fields.file.url"/>
      <sparc-pill class="sparc-pill" v-if="fundingOpportunity">
        Funding
      </sparc-pill>
    </div>
    <div class="news-content-wrap">
      <h3>
        <nuxt-link
          v-if="item.fields.requiresADetailsPage"
          :to="{
            name: 'news-and-events-news-id',
            params: { id: item.sys.id }
          }"
          v-html="highlightMatches(item.fields.title, $route.query.search)"
        />
        <a
          v-else
          :href="item.fields.url"
          :target="openInNewTab ? '_blank' : '_self'"
        >
          <span v-html="highlightMatches(item.fields.title, $route.query.search)"/>
          <svg-icon v-if="openInNewTab" name="icon-open" height="30" width="30" />
        </a>
      </h3>
      <p v-html="highlightMatches(item.fields.summary, $route.query.search)"/>
      <p class="news-list-item__date">
        {{ publishedDate }}
      </p>
    </div>
  </div>
</template>

<script>
import { pathOr } from 'ramda'
import FormatDate from '@/mixins/format-date'
import EventBannerImage from '@/components/EventBannerImage/EventBannerImage.vue'
import SparcPill from '@/components/SparcPill/SparcPill.vue'

import { isInternalLink, opensInNewTab } from '@/mixins/marked/index'
import { highlightMatches } from '~/pages/data/utils'

export default {
  name: 'NewsListItem',

  components: {
    EventBannerImage,
    SparcPill
  },

  mixins: [FormatDate],

  props: {
    item: {
      type: Object,
      default: () => {}
    },
  },

  data() {
    return {
      isDestinationLinkRetreived: false,
      openInNewTab: false
    }
  },
  async mounted() {
    const url = pathOr("", ['fields', 'url'], this.item)
    if (url.includes('bit.ly')) {
      const bitlyId = url.replace("https://", "")
      try {
        const response = await this.$axios.post(process.env.bitly_expand_endpoint, { bitlink_id: bitlyId }, {
          headers: {
            Authorization: `Bearer ${process.env.BITLY_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          }
        })
        const newUrl = response.data.long_url
        this.openInNewTab = !isInternalLink(newUrl)
      } catch {
        console.log("Error retreiving bitly link destination url")
        this.openInNewTab = !isInternalLink(url)
      }
    }
    else {
      this.openInNewTab = !isInternalLink(url)
    }
    this.isDestinationLinkRetreived = true
  },
  computed: {
    /**
     * Compute and formate start date
     * @returns {String}
     */
    publishedDate: function() {
      return this.formatDate(this.item.fields.publishedDate || '')
    },
    fundingOpportunity: function() {
      const subjectTag = pathOr([], ['fields', 'subject'], this.item)
      return subjectTag == 'Funding Opportunity'
    }
  },

  methods: {
    isInternalLink,
    opensInNewTab,
    highlightMatches
  }
}
</script>

<style lang="scss" scoped>
h3 {
  font-size: 1em;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}
p {
  margin-bottom: 0.5rem;
}
.news-list-item__date {
  font-size: 0.875rem;
  font-style: italic;
  margin: 0;
}
.news-list-item {
  display: flex;
  flex-direction: row;
  img {
    display: block;
    object-fit: cover;
    width: 8rem;
    height: 8rem;
  }

  .image {
    position: relative;
    margin: 2px;
  }

  .news-content-wrap {
    margin-left: 16px;
  }
}
.sparc-pill {
  position: absolute;
  right: .25rem;
  top: .25rem;
}
</style>
