<script>
export default {
  name: 'CommunityStoriesPage',

  async asyncData({ redirect }) {
    redirect("/news-and-events/community-spotlight?selectedSpotlightTypes=successStory")
  },
}
</script>