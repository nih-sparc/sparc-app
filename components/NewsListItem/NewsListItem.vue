<template>
  <div class="news-list-item">
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
        >
          {{ item.fields.title }}
        </nuxt-link>
        <a
          v-else
          :href="item.fields.url"
          :target="isInternalLink('item.fields.url') ? '_self' : '_blank'"
        >
          {{ item.fields.title }}
          <svg-icon v-if="!isInternalLink('item.fields.url')" name="icon-open" height="30" width="30" />
        </a>
      </h3>
      <p>{{ item.fields.summary }}</p>
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

import { isInternalLink } from '@/mixins/marked/index'

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
    isInternalLink
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
