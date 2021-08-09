import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.portal_api,
  withCredentials: false,
  timeout: 11005
})

const browse = async (id, version, path = undefined) => {
  let config = {}
  if (path) {
    config = {
      params: {
        path: path,
        limit: 253
      }
    }
  }

  return apiClient.get(`/${id}/versions/${version}/files/browse`, config)
}

const fetch = async (id, version, path, encode_base_64) => {
  const config = {
    params: {
      encodeBase64: encode_base_64
    }
  }
  return await apiClient.get(
    `/s3-resource/${id}/${version}/files/${path}`,
    config
  )
}

const fetchEmbeddedThumbnail = async (id, version, path) => {
  const config = {
    params: {
      path: `${id}/${version}/files/${path}`
    }
  }
  return await apiClient.get('/thumbnail/segmentation', config)
}

const downloadLink = async file_path => {
  const config = {
    params: {
      key: file_path
    }
  }
  return await apiClient.get('/download', config)
}

export default {
  browse,
  downloadLink,
  fetch,
  fetchEmbeddedThumbnail
}
