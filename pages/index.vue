<template>
  <div>
    <div class="head">
      <div class="texture">
        <el-row class="blob-row" type="flex" justify="center">
          <el-col class="blob-column" :sm="24" :md="12" :lg="12" :xl="12">
            <img class="blob1" alt="Irregular blob" :src="irregularBlob1" />
          </el-col>
          <el-col class="blob-column" :sm="24" :md="12" :lg="12" :xl="12">
            <img class="blob2" alt="Irregular blob" :src="irregularBlob2" />
          </el-col>
        </el-row>
      </div>
      <div class="content">
        <div class="hero section">
          <div>
            <el-row type="flex" justify="center">
              <el-col :xs="22" :sm="22" :md="22" :lg="18" :xl="16">
                <el-row>
                  <el-col :xs="22" :sm="22" :md="12" :lg="12">
                    <h1 class="hero-header">Advancing bioelectronic medicine through open science.</h1>
                    <a href=/browse><el-button type="primary" class="explore-the-data">Explore the data</el-button></a>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
      
    <div class="about">
      <div class="texture">
        <el-row class="blob-row" type="flex" justify="space-between">
          <el-col class="blob-column" :sm="24" :md="12" :lg="12" :xl="12">
            <img class="blob3" alt="Irregular blob" :src="transparentBlob3" />
          </el-col>
          <el-col class="blob-column" :sm="24" :md="12" :lg="12" :xl="12">
            <img class="blob4" alt="Irregular blob" :src="transparentBlob3" />
          </el-col>
        </el-row>
      </div>

      <div class="section content">
        <el-row type="flex" justify="center">
          <el-col :xs="22" :sm="22" :md="14" :lg="14">
            <div class="options">
              <span class="option">
                <a :class="{ active: activeTextBlock === 'goal' }" href="#" @click.prevent="toggleText('goal')">Goal</a>
              </span>
              <span>•</span>
              <span class="option">
                <a :class="{ active: activeTextBlock === 'current' }" href="#" @click.prevent="toggleText('current')">Current</a>
              </span>
              <span>•</span>
              <span class="option">
                <a :class="{ active: activeTextBlock === 'future' }" href="#" @click.prevent="toggleText('future')">Future</a>
              </span>
            </div>
            <p>
              {{ activeText }}
            </p>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="section cores">
      <el-row type="flex" justify="center">
        <el-col :xs="22" :sm="22" :md="22" :lg="18" :xl="16">
          <el-row class="cards" type="flex" justify="center" :gutter="20">
            <el-col :xs="20" :sm="8" v-for="core in cores" v-bind:key="core.name">
              <el-card class="core-card" shadow="never" :body-style="{ padding: '0px' }">
                <img v-bind:src="core.image" class="image" />
                <div class="content">
                  <p>{{core.name}}</p>
                  <p v-html="core.description"></p>
                  <div class="bottom clearfix">
                    <a :href="core.link"><el-button type="text" class="button">{{core.linkText}}</el-button></a>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="section search">
      <el-row>
        <el-col>
          <h1>Search the portal</h1>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="22" :sm="22" :md="12" :lg="8">
          <search-controls @query="onSearchQuery" />
        </el-col>
      </el-row>
    </div>
    <div class="section">
      <el-row type="flex" justify="center">
        <el-col :xs="22" :sm="22" :md="22" :lg="18" :xl="16">
          <!-- <featured-datasets /> -->
        </el-col>
      </el-row>
    </div>
  </div>
  
</template>

<script>
import irregularBlob1 from "@/static/images/irregular-blob-1.svg";
import irregularBlob2 from "@/static/images/irregular-blob-2.svg";
import transparentBlob3 from "@/static/images/transparent-blob-3.svg";
import mapCore from "../static/images/map-core-image.jpg";
import simulationCore from "../static/images/osparc-human.png";
import dataCore from "../static/images/datcore-card-image.svg";
import datasetAbstractImage from "../static/images/dataset-abstract-image.png";
import eventCard from "@/components/EventCard/EventCard.vue";

// import FeaturedDatasets from "../featured-datasets-carousel/FeaturedDatasetsCarousel.vue";
import SearchControls from "@/components/search-controls/SearchControls.vue";

const cores = [
  {
    name: "Data",
    description:"A collection of curated data provides new insights into the autonomic nervous system. ",
    link: "/browse",
    linkText: "Dive into the data",
    image: dataCore
  },
  {
    name: "Maps",
    description:"Interactive visualizations facilitate exploration of nerve-organ anatomy and function.",
    link: "/map",
    linkText: "View the maps",
    image: mapCore
  },
  {
    name: "Virtual studies",
    description:"An online platform called o<sup>2</sup>S<sup>2</sup>PARC enables data analyses and predictive simulations.",
    link: "/sim",
    linkText: "Run computations",
    image: simulationCore
  }
];

export default {
  name: "index",
  components: {
    SearchControls,
    eventCard
  },

  data: () => ({
    textBlocks: {
      goal: 'Catalyze the development of next-generation bioelectronic medicines by providing access to high-value datasets, maps, and predictive simulations.',
      current: 'Launched in July 2019, the SPARC Portal is an open-source web application that provides access to a growing collection of interactive autonomic neuroscience resources.',
      future: 'The SPARC Portal will enable users to run advanced analytics and computational studies to predict the effects of neuromodulation on organ function.'
    },
    activeTextBlock: 'goal',
    irregularBlob1,
    irregularBlob2,
    mapCore,
    simulationCore,
    dataCore,
    transparentBlob3,
    datasetAbstractImage,
    cores,
    value2: '',
    state: ''
  }),

  computed: {
    /**
     * Compute active text to show
     * @returns {String}
     */
    activeText: function () {
      return this.textBlocks[this.activeTextBlock]
    }
  },

  methods: {
    /**
     * Sets the activeTextBlock
     * @param {String}
     */
    toggleText: function(key) {
      this.activeTextBlock = key
    },

    /**
     * Navigate to the browse page with search
     * @param {String} selectedType
     * @param {String} terms
     */
    onSearchQuery: function(selectedType, terms) {
      const url = terms === null
        ? `/data/?searchType=${selectedType}`
        : `/data/?searchType=${selectedType}&searchTerms=${terms}`

      window.location.href = url
    }
  }
};
</script>

<style lang="scss" scoped>

.twitter-timeline {
  max-width:300px;

}
.page-container {
  margin-top: -5em;
}

.section-header {
  margin-bottom: 1em;
}

.cards {
  flex-wrap: wrap;
  margin-top: -2em;
}

.flush-column {
  overflow: hidden;
}

.core-card {
  width: 100%;
  margin-top: 2em;

  img {
    width: 100%;
  }

  .content {
    padding: 1em;
    background: #f5f7fa;
  }
}

.search {
  background: #8300bf;
  color: white;
  text-align: center;

  .search-button {
    padding-top: 1em;

    .view-search-results {
      background: #24245b;
      text: #fff;
      border: 0;
    }
  }

  .controls {
    padding-top: 1em;
    min-height: 4em;

    .control {
      display: inline-block;
      height: 100%;
      width: 100%;
      font-size: 2em;

      .search-type-selector {
        padding: 0.5em;
        border: 0;
        color: #8300bf;
        border-radius: 0;
        background: none;
        -webkit-appearance: none;
        width: 100%;
        height: 100%;

        > input {
          border-radius: 0 !important;
          border: 0 !important;
          background: none;
        }
      }

      .search-input {
        background: none;
        border: 0;
        padding: 0.5em;
        color: #8300bf;
        -webkit-appearance: none;
        width: 100%;
        height: 100%;

        > input {
          border-radius: 0 !important;
          border: 0 !important;
          background: none;
        }

        ::placeholder {
          color: #8300bf;
          opacity: 1;
        }
      }
    }
  }
}

.texture {
  z-index: 0;
  height: 100%;
  min-height: 100%;
  position: absolute;
  width: 100%;
  user-select: none;
  overflow: hidden;

  .blob-row {
    height: 100%;
    background: none;
    flex-wrap: wrap;

    .blob-column {
      height: 100%;
      text-align: center;
      padding-left: 5em;
      padding-right: 5em;
      padding-bottom: 3em;
      background: none;

      img {
        height: 100%;
      }

      img.blob1 {
        padding-left: 5em;
      }

      img.blob2 {
        transform: scale(0.7);
      }

      img.blob3 {
        margin-top: 1em;
        margin-left: -3em;
        transform: scale(1.8);
      }

      img.blob4 {
        margin-top: 5em;
        margin-right: -1em;
        transform: scale(1.8);
      }
    }
  }
}

.content {
  z-index: 1;
  position: relative;
  display:flex;

}

.hero-header {
  margin-bottom: 0.5em;
}

.head {
  position: relative;
  z-index: 1;

  .content {
    .hero {
      padding-top: 13em;
      padding-bottom: 10em;
    }
  }
}

.about {
  background: #24245b;
  color: #f9f2fc;
  text-align: center;
  font-family: "Asap", sans-serif;
  font-size: 22px;
  position: relative;

  .content {
    .option {
      padding: 0 0.5em;

      a {
        text-decoration: none;
        color: #f9f2fc;

        &.active {
          color: #c200fd;
        }
      }
    }
  }
}

.section {
  padding: 5rem 0;
}

.explore-the-data {
  background: #8300bf;
  text-transform: uppercase;
  border: 0px;
}

.cores {
  background: #edf1fc;
}
</style>
