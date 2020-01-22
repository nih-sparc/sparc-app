<template>
  <div class="data-page">
    <page-hero v-if="heroCopy" class="subpage">
      <h2>A growing collection of SPARC data</h2>
      <p>
        The SPARC portal provides access to high-value datasets, maps, and
        predictive simulations ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Lorem ipsum dolor sit amet.
      </p>
    </page-hero>
    <div class="page-wrap container">
      <el-row type="flex" justify="center">
        <el-col :span="24">
          <ul class="search-tabs">
            <li v-for="type in searchTypes" :key="type.label">
              <nuxt-link
                class="search-tabs__button"
                :to="{
                  name: 'data',
                  query: {
                    type: type.type
                  }
                }"
              >
                {{ type.label }}
              </nuxt-link>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { compose, head, propOr } from 'ramda'
import PageHero from '@/components/PageHero/PageHero.vue'

import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'DataPage',

  components: {
    PageHero
  },

  mixins: [],

  asyncData() {
    return Promise.all([
      // Get page content
      client.getEntry(process.env.ctf_about_page_id)
    ])
      .then(([page]) => {
        return { ...page.fields }
      })
      .catch(console.error)
  },

  data: () => {
    return {
      searchType: 'dataset',
      searchTypes: [
        {
          label: 'Datasets',
          type: 'dataset'
        },
        {
          label: 'Files',
          type: 'file'
        },
        {
          label: 'Organs',
          type: 'organ'
        },
        {
          label: 'Projects',
          type: 'project'
        },
        {
          label: 'Simulations',
          type: 'simulation'
        }
      ]
    }
  },


  mounted: function() {
    // Check the searchType param in the route and set it if it doesn't exist
    if (!this.$route.query.searchType) {
      const firstTabType = compose(propOr('', 'type'), head)(this.searchTypes)

      this.$router.replace({ query: { type: firstTabType } })
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/_variables.scss';

.search-tabs {
  border-bottom: 2px solid #dbdfe6;
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    margin: 0 2em;
    transform: translateY(2px);
    &:first-child {
      margin-left: 0;
    }
  }
}
.search-tabs__button {
  background: none;
  border: none;
  color: #909399;
  cursor: pointer;
  display: block;
  font-size: 1.25em;
  font-weight: 500;
  outline: none;
  padding: 0.5rem;
  text-decoration: none;
  &:hover,
  &:focus,
  &.nuxt-link-exact-active {
    color: $navy;
    border-bottom: 2px solid $median;
  }
}
</style>
