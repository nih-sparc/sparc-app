<template>
  <div class="help-page">
    <page-hero>
      <h2>{{ helpData.title }}</h2>
      <p>
        {{ helpData.summary }}
      </p>
      <p>
        <!-- {{ heroCopy }} -->
      </p>
      <HelpSearchControls
        :search-on-load="true"
        submit-text="Go"
        @query="onSearchQuery"
      />
    </page-hero>

    <div class="page-wrap container">
      <div class="subpage">
        <el-row type="flex" :gutter="32">
          <el-col :xs="24" :md="22" :lg="6">
            <h2>Menu</h2>
            <ul>
              <li><a href="#">Lorem Ipsum</a></li>
              <li><a href="#">Lorem Ipsum</a></li>
              <li><a href="#">Lorem Ipsum</a></li>
              <li><a href="#">Lorem Ipsum</a></li>
            </ul>
          </el-col>
          <el-col :xs="24" :md="22" :lg="18">
            <help-section
              v-for="item in helpData.sections"
              :key="item.sys.id"
              class="help-section"
              :section="item"
            />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import HelpSection from '@/components/HelpSection/HelpSection.vue'
import HelpSearchControls from '@/components/help-search-controls/HelpSearchControls.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'HelpPage',

  components: {
    HelpSection,
    HelpSearchControls,
    PageHero
  },

  asyncData() {
    return Promise.all([
      // fetch all blog posts sorted by creation date
      client.getEntry(process.env.ctf_support_page_id, { include: 2 })
    ])
      .then(([resp]) => {
        return {
          helpData: resp.fields
        }
      })
      .catch(console.error)
  },

  data() {
    return {
      helpData: []
    }
  },

  methods: {
    onSearchQuery: function() {
      return 0
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.help-section {
  margin: 0 0 2em;
}
</style>
