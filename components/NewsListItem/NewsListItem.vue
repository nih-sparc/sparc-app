<template>
  <div class="news-list-item">
    <h3>
      <router-link
        :to="{
          name: 'news-and-events-news-id',
          params: { id: item.sys.id }
        }"
      >
        {{ item.fields.title }}
      </router-link>
    </h3>
    <p>{{ item.fields.summary }}</p>
    <p class="news-list-item__date">
      {{ publishedDate }}
    </p>
  </div>
</template>

<script>
import FormatDate from '@/mixins/format-date'

export default {
  name: 'NewsListItem',

  mixins: [FormatDate],

  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    /**
     * Compute and formate start date
     * @returns {String}
     */
    publishedDate: function() {
      return this.formatDate(this.item.fields.publishedDate || '')
    }
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
</style>
