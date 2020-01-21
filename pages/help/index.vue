<template>
  <div class="events-page">
    <page-hero class="subpage">
      <h3>SPARC Support Center</h3>
      <p>
        Documentation about SPARC, Data, Maps, and Simulation resources
      </p>
      <p>
        <!-- {{ heroCopy }} -->
      </p>
    </page-hero>

    <div class="page-wrap container">
      <el-row type="flex" justify="center">
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
          <div
            v-for="(item, index) in topics.fields.sections"
            :key="`${item}-${index}`"
          >
            <div class="help-section">
              <help-section :section="item" />
            </div>
          </div>
        </el-col>
      </el-row>
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
      client.getEntry(process.env.ctf_support_page_id, { include: 1 }),
      client.getEntries({
        content_type: 'helpDocument',
        select: 'fields.title,fields.summary'
      })
    ])
      .then(([resp, docs]) => {
        let docDict = {}
        for (let i = 0; i < docs.items.length; i++) {
          docDict[docs.items[i].sys.id] = docs.items[i].fields
        }

        for (let i = 0; i < resp.fields.sections.length; i++) {
          var curSection = resp.fields.sections[i]
          for (let j = 0; j < curSection.fields.helpDocuments.length; j++) {
            let curDoc = curSection.fields.helpDocuments[j]
            curDoc['title'] = docDict[curDoc.sys.id]['title']
            curDoc['summary'] = docDict[curDoc.sys.id]['summary']
          }
        }
        return {
          topics: resp
        }
      })
      .catch(console.error)
  },

  computed: {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.header {
  margin-top: 7rem;
  .gradient {
    padding: 1.5em 0;
    color: #f0f2f5;
    background-image: linear-gradient(90deg, #0026ff 0%, #00ffb9 100%);

    .breadcrumb {
      width: 75%;
    }
  }
}

.help-section {
  color: $vestibular;
  margin-top: 32px;
  margin: 24px auto;
  width: 80%;
  // background-color: #FFF;
  padding: 16px 120px;
  // padding-right: 120px;
  border-radius: 16px;
  max-width: 900px;

  @media screen and (max-width: 800px) {
    padding: 8px;
  }
}
</style>
