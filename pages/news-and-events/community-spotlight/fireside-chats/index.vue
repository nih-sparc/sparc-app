<script>
export default {
  name: 'CommunityChatsPage',

  async asyncData({ redirect }) {
    redirect("/news-and-events/community-spotlight?selectedSpotlightTypeOptions=firesideChat")
  },
}
</script>
