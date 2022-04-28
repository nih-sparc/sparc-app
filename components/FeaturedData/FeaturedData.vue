<template>
  <div v-loading="isLoadingOrganFacetIds" class="featured-data container">
    <h2>Find Data by Category</h2>
    <div class="data-wrap">
      <nuxt-link
        v-for="item in featuredData"
        :key="item.sys.id"
        class="featured-data__item"
        :to="`${getLink(item.fields)}`"
      >
        <img
          :src="imageUrl(item)"
          :alt="`Icon for ${item.fields.label} category`"
        />
        <p class="mb-0 mt-8">
          {{ item.fields.label }}
        </p>
      </nuxt-link>
    </div>

    <nuxt-link :to="{ name: 'data', query: { type: 'dataset' } }">
      <el-button class="mt-32 secondary">
        View more
      </el-button>
    </nuxt-link>
  </div>
</template>

<script>
import createAlgoliaClient from '@/plugins/algolia.js'
import { getAlgoliaFacets, facetPropPathMapping } from '../../pages/data/utils'
import { isEmpty, pathOr } from 'ramda'

const algoliaClient = createAlgoliaClient()
const algoliaIndex = algoliaClient.initIndex(process.env.ALGOLIA_INDEX)
export default {
  name: 'FeaturedData',

  props: {
    featuredData: {
      type: Array,
      default: () => []
    }
  },

  data: () => {
    return {
      organFacets: [],
      isLoadingOrganFacetIds: true
    }
  },

  created() {
    this.loadOrganFacets()
  },

  methods: {
    /**
     * Get image URL for the featured data
     * @param {Object} item
     * @returns {String}
     */
    imageUrl: function(item) {
      return pathOr('', ['fields', 'image', 'fields', 'file', 'url'], item)
    },
    loadOrganFacets: function() {
      this.isLoadingOrganFacetIds = true
      getAlgoliaFacets(algoliaIndex, facetPropPathMapping)
        .then(data => {
          this.organFacets = data.find(
            facet => facet.key === 'anatomy.organ.name'
          ).children
        })
        .finally(() => {
          this.isLoadingOrganFacetIds = false
        })
    },
    filterOrgans(contentfulFields) {
      const normStr = str => str.toLowerCase().trim()
      return this.organFacets.filter(
        organ =>
          normStr(organ.label).includes(normStr(contentfulFields.label)) ||
          (contentfulFields.containsSearch &&
            contentfulFields.containsSearch.some(keyword =>
              normStr(organ.label).includes(normStr(keyword))
            ))
      )
    },
    getLink(contentfulFields) {
      if (isEmpty(this.organFacetIds)) {
        return contentfulFields.link
      }
      var organIds = this.filterOrgans(contentfulFields).map(organ => organ.id)
      return organIds.length === 0
        ? contentfulFields.link
        : `${contentfulFields.link}&selectedFacetIds=${organIds.join(',')}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';

.featured-data {
  text-align: center;
  padding: 3em 0 4em;
}
h2 {
  margin-bottom: 1.5625em;
}
.data-wrap {
  align-items: center;
  display: grid;
  row-gap: 2rem;
  justify-items: center;
  justify-content: space-around;

  @media (min-width: 768px) {
    padding-left: 0.4375rem;
    padding-right: 0.4375rem;
  }
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  }
  @media (max-width: 1023px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (max-width: 767px) {
    grid-template-columns: 1fr 1fr;
  }
}
.featured-data__item {
  color: #000;
  text-decoration: none;
  width: 128px;
  margin: 1.525em 0rem;
  &:hover,
  &:focus {
    opacity: 0.9;
  }
  img {
    background: #fff;
    border-radius: 50%;
    display: block;
    margin-bottom: 8px;
    width: 128px;
    border: solid 1px $lightblue;
    height: 128px;
  }
  p {
    font-size: 1em;
    font-weight: 700;
    color: $navy;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
