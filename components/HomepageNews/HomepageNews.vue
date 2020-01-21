<template>
  <div class="featured-datasets container">
    <div class="home-container">
      <h2>News &amp; Upcoming Events</h2>
      <sparc-card
        v-for="(item, idx) in news"
        :key="item.sys.id"
        :image="item.fields.image.fields.file.url"
        :image-alt="item.fields.image.fields.title"
        :image-align="idx % 2 ? 'right' : ''"
      >
        <h3>
          <nuxt-link
            :to="{ name: 'events-eventId', params: { eventId: item.sys.id } }"
          >
            {{ item.fields.title }}
          </nuxt-link>
        </h3>
        <!-- eslint-disable vue/no-v-html -->
        <!-- marked will sanitize the HTML injected -->
        <div v-html="parseMarkdown(item.fields.summary)" />
        <p>
          <nuxt-link
            :to="{ name: 'events-eventId', params: { eventId: item.sys.id } }"
          >
            <el-button>
              Learn More
            </el-button>
          </nuxt-link>
        </p>
      </sparc-card>
    </div>
  </div>
</template>

<script>
import SparcCard from '@/components/SparcCard/SparcCard.vue'

import MarkedMixin from '@/mixins/marked'

export default {
  name: 'HomepageNews',

  components: {
    SparcCard
  },

  mixins: [MarkedMixin],

  props: {
    news: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
.home-container {
  padding-left: 1rem;
  padding-right: 1rem;
  @media (min-width: 768px) {
    padding-left: 6rem;
    padding-right: 6rem;
  }
}
.sparc-card {
  margin-bottom: 24px;
  @media (min-width: 768px) {
    margin-bottom: 40px;
  }
  h3 {
    font-size: 1.333333333em;
  }
}
</style>
