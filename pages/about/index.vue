<template>
  <div class="about-page">
    <breadcrumb :breadcrumb="breadcrumb" :title="pageTitle" />
    <page-hero v-if="heroCopy">
      <el-row :gutter="20">
        <el-col :span="14">
          <h1>{{ pageTitle }}</h1>
          <p>
            {{ heroCopy }}
          </p>
          <button class="about-page-button">
            <a href="#" target="_blank">More Info NIH Website</a>
          </button>
        </el-col>
        <img src="@/static/images/about-hero.png" />
      </el-row>
    </page-hero>
    <div class="page-wrap container">
      <div class="subpage">
        <el-row type="flex" justify="left" :gutter="60">
          <el-col :span="24">
            <!-- eslint-disable vue/no-v-html -->
            <!-- marked will sanitize the HTML injected -->
            <h2>SPARC Program</h2>
            <div class="about-page-text" v-html="parseMarkdown(sparcProgram)" />
          </el-col>
          <el-col :span="8">
            <img src="https://via.placeholder.com/222" />
          </el-col>

        </el-row>
      </div>
      <div class="subpage">
        <el-row type="flex" justify="right" :gutter="40">
          <el-col :span="8">
            <h2>Sparc Portal</h2>
            <img src="https://via.placeholder.com/222" />
          </el-col>
          <el-col class="subpage-col" :span="24">
            <div class="about-page-text" v-html="parseMarkdown(sparcPortal)" />
            <button class="about-teams-and-projects-button">
              View Teams & Projects
            </button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'

import MarkedMixin from '@/mixins/marked'
import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'AboutPage',

  components: {
    Breadcrumb,
    PageHero
  },

  mixins: [MarkedMixin],

  asyncData() {
    return Promise.all([
      // Get page content
      client.getEntry(process.env.ctf_about_page_id)
    ])
      .then(([page]) => {
        console.log('give me page ', page)
        return { ...page.fields }
      })
      .catch(console.error)
  },

  data: () => {
    return {
      heroCopy: '',
      copy: '',
      breadcrumb: {
        name: 'index',
        parent: 'Home'
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/_variables.scss';
.page {
  display: flex;
  margin-top: 7rem;

  p {
    color: #606266;
  }
}

.page-hero {
  padding: 0;
  height: 19rem;

  h1 {
    margin-top: 2.3125rem;
  }
}

.subpage {
  h2 {
    font-size: 28px;
    font-weight: normal;
    line-height: 28px;
    color: $navy;
  }
  .subpage-col {
    margin-top: 38px;
  }
}

.about-page-button {
  width: 12.3rem;
  height: 2.5rem;
  border-radius: 4px;
  margin-top: 1rem;
  a {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: uppercase;
    color: $median;
    text-decoration: none;
  }
}

.about-teams-and-projects-button {
  background: $median;
  text-transform: uppercase;
  height: 2.5rem;
  width: 12.4rem;
  color: #fff;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.about-page-text {
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  color: $dark-sky;
}

img {
  height: 19rem;
}

.about {
  text-align: center;
  min-height: 50vh;
  margin-top: 9rem;
}
</style>
