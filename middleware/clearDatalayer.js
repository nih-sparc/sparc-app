export default function ({ app }) {
  if (app != undefined && app.$gtm != undefined) {
    app.$gtm.push({
      event: '',
      event_name: '',
      category: "",
      files: "",
      file_name: "",
      file_path: "",
      file_type: "",
      location: "",
      dataset_id: "",
      version_id: "",
      doi: "",
      citation_type: ""
    })
  }
}