<template>
  <div class="section-container container py-16">
    <div class="heading2 mb-32">Projects and Datasets</div>
    <div class="row">
      <div class="col p-16">
        <div class="body2 mb-16">Here is a project you might be interested in:</div>
        <projects-and-datasets-card 
          :title="project.fields.title" 
          :description="project.fields.shortDescription" 
          :banner="project.fields.banner" 
          :link="'projects/' + project.sys.id"
          button-text="View Project"
        />
        <nuxt-link class="view-all-link body2 mt-16" to="/data?type=projects">
          View All Projects
        </nuxt-link>
      </div>
      <div class="col p-16">
        <div class="body2 mb-16">Here is a dataset you might be interested in:</div>
        <projects-and-datasets-card 
          :title="dataset.title" 
          :description="dataset.description" 
          :banner="dataset.banner" 
          :link="'datasets/' + dataset.id"
          button-text="View Dataset"
        />
        <nuxt-link class="view-all-link body2 mt-16" to="/data?type=dataset">
          View All Datasets
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectsAndDatasetsCard from '@/components/ProjectsAndDatasets/ProjectsAndDatasetsCard/ProjectsAndDatasetsCard.vue'

export default {
  name: 'ProjectsAndDatasets',
  components: {
    ProjectsAndDatasetsCard
  },
  props: {
    project: {
      type: Object,
      default: () => {}
    },
    dataset: {
      type: Object,
      default: () => {}
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.section-container {
  text-align: center;
}
.col {
  display: flex;
  width: 46%;
  height: auto;
  background-color: $darkBlue;
  flex-direction: column;
  @media screen and (max-width: 767px) {
    width: 95% !important;
    margin-bottom: 1rem;
  }
}
.row {
  display: flex;
  text-align: left;
  justify-content: space-between;
  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
}
.view-all-link {
  text-decoration: underline;
}
</style>
