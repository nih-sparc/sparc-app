<script>
const decodeQuery = function(queryParams) {
  // Convert to URL schema
  const urlSearchParams = new URLSearchParams();
  for (const key in queryParams) {
    if (queryParams.hasOwnProperty(key)) {
      urlSearchParams.append(key, queryParams[key]);
    }
  }

  return `?${urlSearchParams.toString()}`;
}
export default {
  name: 'FileDetailPage',

  async asyncData({ redirect, route }) {
    redirect(`/datasets/file/${route.params.datasetId}/${route.params.datasetVersion}?${decodeQuery(route.query)}`)
  }
}
</script>
