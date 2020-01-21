<template>
  <div class="featured-data container">
    <h2>Browse Data by Category</h2>
    <div class="data-wrap">
      <nuxt-link
        v-for="item in featuredData"
        :key="item.id"
        class="featured-data__item"
        :to="{
          name: 'datasets-datasetId',
          params: { datasetId: item.id }
        }"
      >
        <img :src="item.image" :alt="`Icon for ${item.type} category`" />
        <p class="mb-0 mt-8">
          {{ item.type }}
        </p>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
// @TODO remove
const mockFeaturedData = [
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
  }
]
export default {
  name: 'FeaturedData',

  data: function() {
    return {
      featuredData: mockFeaturedData
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
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
  @media (min-width: 768px) {
    padding-left: 0.4375rem;
    padding-right: 0.4375rem;
  }
}
.featured-data__item {
  color: #000;
  margin: 19px;
  text-decoration: none;
  width: 70px;
  @media (min-width: 768px) {
    width: 128px;
    margin: 1.5625em 3.5625rem;
  }
  &:hover,
  &:focus {
    opacity: 0.9;
  }
  img {
    background: #fff;
    border-radius: 50%;
    display: block;
    height: 70px;
    margin-bottom: 8px;
    width: 100%;
    @media (min-width: 768px) {
      height: 100%;
    }
  }
  p {
    font-size: 0.8125em;
    font-weight: 700;
  }
}
</style>
