<script>
// Need to re-direct from the old path of /datasets/segmentationviewer?dataset_version={id}&dataset_id={id}&file_path={filePath} to the corresponding file with that viewer:
// Example: https://sparc.science/datasets/segmentationviewer?dataset_id=295&dataset_version=1&file_path=files%2Fprimary%2Fsub-9902%2Fsam-9902%2F9902_P_6_4_2.xml now maps to
// https://sparc.science/datasets/file/295/1?path=files%2Fprimary%2Fsub-9902%2Fsam-9902%2F9902_P_6_4_2.xml
export default {
  name: 'SegmentationViewerPage',

  async asyncData({ redirect, route }) {
    const datasetId = route.query.dataset_id
    const versionId = route.query.dataset_version
    const filePath = route.query.file_path

    redirect(`/datasets/file/${datasetId}/${versionId}?path=${filePath}`)
  }
}
</script>
