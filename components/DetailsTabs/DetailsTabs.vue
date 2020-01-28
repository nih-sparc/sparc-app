<template>
  <div name="details-tabs">
    <div class="details-tabs__container">
      <el-row type="flex">
        <el-col :span="24">
          <ul class="details-tabs__container--types">
            <li v-for="tab in tabTypes" :key="tab.label">
              <nuxt-link
                class="details-tabs__container--button"
                :class="{ active: tab.type === 'teamInformation' }"
                :to="{
                name: 'data',
                query: {
                  type: tab.type
                }
              }"
              >{{ tab.label }}</nuxt-link>
            </li>
          </ul>
        </el-col>
      </el-row>
      <div class="details-tabs__container--data">
          <h3>Project Leader</h3>
          <p><u>Kalyanam Shivkumar</u></p>
          <h3>Other Contacts</h3>
          <ul>
              <li>Charles Fowlkes</li>
              <li><u>Viviana Gradinaru</u></li>
              <li>Beth Habecker</li>
              <li>Stephen Daniel</li>
              <li><u>David Paterson</u></li>
              <li>Irving Zucker</li>
          </ul>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailsTabs",
  data() {
    return {
      tabTypes: [
        {
          label: "Team Information",
          type: "teamInformation"
        },
        {
          label: "Diseases",
          type: "diseases"
        },
        {
          label: "Datasets",
          type: "datasets"
        },
        {
          label: "Related Projects",
          type: "relatedProjects"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
.details-tabs {
    margin: 1.25rem;
  &__container {
    background: white;
    border: solid 1px $cloudy;
    padding-left: 3rem;
    padding-right: 2rem;
    margin: 1.3rem;
    &--types {
      border-bottom: 2px solid #dbdfe6;
      display: flex;
      list-style: none;
      margin: 0 0 1.5rem;
      padding: 0;
    li {
      margin: 0 2em;
      transform: translateY(2px);
      &:first-child {
        margin-left: 0;
      }
    }
  }

  &--button {
      background: none;
      border: none;
      color: $dark-sky;
      cursor: pointer;
      display: block;
      font-size: 1.375em;
      font-weight: normal;
      outline: none;
      padding: 0.5rem;
      text-decoration: none;
      &:hover,
      &:focus,
      &.active {
       color: $navy;
       border-bottom: 2px solid $median;
     }
  }

    &--data {
      h3 {
        font-size: 14px;
        font-weight: 500;
        line-height: 16px;
      }
      p {
        font-size: 14px;
        font-weight: normal;
        line-height: 24px;
        margin-top: 0;
      }
      ul {
          list-style: none;
          padding-left: 0;
          margin-top: 0;
          li {
            font-size: 14px;
            font-weight: normal;
            line-height: 24px;
          }
      }
    }
  }
  }
</style>