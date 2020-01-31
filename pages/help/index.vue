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
import PageHero from '@/components/PageHero/PageHero.vue'
import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'HelpPage',

  components: {
    HelpSection,
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
        // let docDict = {}
        // for (let i = 0; i < docs.items.length; i++) {
        //   docDict[docs.items[i].sys.id] = docs.items[i].fields
        // }
        // for (let i = 0; i < resp.fields.sections.length; i++) {
        //   var curSection = resp.fields.sections[i]
        //   for (let j = 0; j < curSection.fields.helpDocuments.length; j++) {
        //     let curDoc = curSection.fields.helpDocuments[j]
        //     curDoc['title'] = docDict[curDoc.sys.id]['title']
        //     curDoc['summary'] = docDict[curDoc.sys.id]['summary']
        //   }
        // }
        // return {
        //   topics: resp
        // }
      })
      .catch(console.error)
  },

  data() {
    return {
      helpData: []
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
