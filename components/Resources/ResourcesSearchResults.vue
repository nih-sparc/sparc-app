<template>
  <div class="resources-search-results">
    <div
      v-for="data in tableData"
      :key="data.sys.id"
      class="resources-search-results__items"
    >
      <div class="resources-search-results__items--image">
        <img v-show="data.fields.logo" :src="getBannerImage(data)" />
      </div>
      <div class="resources-search-results__items--content">
        <a :href="data.fields.url" target="blank">
          <h2>{{ data.fields.name }}</h2>
        </a>

        <template v-if="data.fields.developedBySparc">
          <p class="resource-category">SPARC</p>
        </template>
        <template v-if="data.fields.owner">
          <h3 class="metadata-title">
            Owner
          </h3>
          <p>
            <a
              v-if="data.fields.contactEmail"
              :href="`mailto:${data.fields.contactEmail}`"
            >
              {{ data.fields.owner }}
            </a>
            <template v-else>
              {{ data.fields.owner }}
            </template>
          </p>
        </template>


        <p class="resources-search-results__items--content-description">
          {{ data.fields.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { pathOr } from 'ramda'

import FormatDate from '@/mixins/format-date'
export default {
  name: 'ResourceSearchResults',

  mixins: [FormatDate],
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    /**
     * Gets the banner image for the resource
     * @returns {String}
     */
    getBannerImage: function(data) {
      return pathOr('', ['fields', 'logo', 'fields', 'file', 'url'], data)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.resources-search-results {
  &__items {
    display: flex;
    flex-direction: row;
    border-bottom: solid 1px $light-grey;
    padding: 1.25em 0;
    @media screen and (max-width: 768px) {
      display: block;
    }
    h2 {
      font-size: 1em;
      color: $median;
      margin-bottom: 0.375rem;
      line-height: 22px;
      font-weight: 500;
    }

    &--content {
      a {
        text-decoration: none;
      }
    }

    &--image {
      margin-right: 1rem;
      @media (min-width: 48em) {
        flex-shrink: 0;
        width: 128px;
      }
      img {
        width: 100%;
        height: auto;
      }
    }
    &--content-date {
      font-size: 1em;
      font-style: italic;
      line-height: 18px;
      font-weight: normal;
      color: $dark-sky;
    }
    &--content-description {
      font-size: 1em;
      font-weight: normal;
      line-height: 22px;
      font-weight: normal;
      color: $dark-sky;
    }
  }
}
.metadata-title {
  color: $dark-sky;
  font-size: 1em;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 0.375rem;
  text-transform: uppercase;
}

.resource-category {
  background: $median;
  border-radius: 15px;
  color: #fff;
  font-size: .875rem;
  top: 10px;
  padding: 0 .65rem;
  right: 14px;
  width: fit-content;
  margin-bottom: 10px;
}
</style>
