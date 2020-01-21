<template>
  <div class="featured-datasets container">
    <h2>Browse Datasets by Categories</h2>
    <div class="datasets-wrap">
      <nuxt-link
        v-for="dataset in datasets"
        :key="dataset.id"
        class="dataset"
        :to="{
          name: 'datasets-datasetId',
          params: { datasetId: dataset.id }
        }"
      >
        <img :src="dataset.image" :alt="`Icon for ${dataset.type} dataset`" />
        <p class="mb-0 mt-8">
          {{ dataset.type }}
        </p>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
// @TODO remove
const mockDatasets = [
  {
    id: 0,
    name: '123',
    type: 'Category 0',
    image: 'https://placeholder.pics/svg/252x252'
  },
  {
    id: 1,
    name: '123',
    type: 'Category 1',
    image: 'https://placeholder.pics/svg/252x252'
  },
  {
    id: 2,
    name: '123',
    type: 'Category 2',
    image: 'https://placeholder.pics/svg/252x252'
  },
  {
    id: 3,
    name: '123',
    type: 'Category 3',
    image: 'https://placeholder.pics/svg/252x252'
  },
  {
    id: 4,
    name: '123',
    type: 'Category 4',
    image: 'https://placeholder.pics/svg/252x252'
  },
  {
    id: 5,
    name: '123',
    type: 'Category 5',
    image: 'https://placeholder.pics/svg/252x252'
  },
  {
    id: 6,
    name: '123',
    type: 'Category 6',
    image: 'https://placeholder.pics/svg/252x252'
  },
  {
    id: 7,
    name: '123',
    type: 'Category 7',
    image: 'https://placeholder.pics/svg/252x252'
  },
  {
    id: 8,
    name: '123',
    type: 'Category 8',
    image: 'https://placeholder.pics/svg/252x252'
  },
  {
    id: 9,
    name: '123',
    type: 'Category 9',
    image: 'https://placeholder.pics/svg/252x252'
  }
]
export default {
  name: 'FeaturedDatasets',

  data: function() {
    return {
      datasets: mockDatasets
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';

.featured-datasets {
  text-align: center;
  padding: 4.0625em 0 2.5em;
}
h2 {
  margin-bottom: 1.5625em;
}
.datasets-wrap {
  align-items: center;
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
  @media (min-width: 768px) {
    padding-left: 0.4375rem;
    padding-right: 0.4375rem;
  }
}
.dataset {
  color: #000;
  margin: 19px;
  text-decoration: none;
  width: 70px;
  @media (min-width: 768px) {
    height: 126px;
    width: 126px;
    margin: 1.5625em 3.5625rem;
  }
  &:hover,
  &:focus {
    opacity: 0.9;
  }
  img {
    display: block;
    height: 70px;
    width: 100%;
    @media (min-width: 768px) {
      height: 100%;
    }
  }
  p {
    font-size: 0.75em;
    @media (min-width: 769px) {
      border: 0;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }
  }
}
</style>
