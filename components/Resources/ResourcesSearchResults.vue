<template>
  <div class="resources-search-results">
    <div v-for="data in tableData" class="resources-search-results__items">
      <div
        v-show="data.fields.logo"
        class="resources-search-results__items--image"
      >
        <img v-show="data.fields.logo" :src="getBannerImage(data)" />
      </div>
      <div class="resources-search-results__items--content">
          hello
        <h4>{{ data.fields.name }}</h4>
        <p class="resources-search-results__items--content-date">
          {{ formatDate(data.sys.updatedAt) }}
        </p>
        <p class="resources-search-results__items--content-description">
          {{ data.fields.description }}
        </p>
      </div>
    </div>
  </div>
  <!-- <el-table :data="tableData">
    <el-table-column
      :fixed="true"
      prop="fields.title"
      label="Title"
      width="300"
    >
      <template slot-scope="scope">
        <nuxt-link
          :to="{
            name: 'organs-organId',
            params: { organId: scope.row.sys.id }
          }"
        >
          {{ scope.row.fields.name }}
        </nuxt-link>
      </template>
    </el-table-column>
    <el-table-column :fixed="true" prop="fields.title" label="Banner">
      <template slot-scope="scope">
        <img
          :src="getImageSrc(scope)"
          :alt="getImageAlt(scope)"
          height="128"
          width="128"
        />
      </template>
    </el-table-column>
  </el-table> -->
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
    height: 9.375rem;
    display: flex;
    flex-direction: row;
    border-bottom: solid 1px $light-grey;
    margin-bottom: 1.375rem;
    h4 {
      font-size: 1em;
      color: $median;
      line-height: 22px;
      font-weight: 500;
    }
    &--image {
      margin-right: 1rem;
      img {
        width: 128px;
        height: 128px;
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
</style>
