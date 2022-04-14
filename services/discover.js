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

const getSegmentationInfo = async (id, version, path) => {
  const config = {
    params: {
      dataset_path: `${id}/${version}/${path}`
    }
  }
  return apiClient.get('/segmentation_info', config)
}

const downloadLink = (key, contentType) => {
  const config = {
    params: { key, contentType }
  }
  return apiClient.get('/download-link', config)
}

const getDiscoverPath = source_identifier => {
  const config = {
    params: {
      uri: source_identifier
    }
  }
  const response = apiClient.get('/s3-resource/discover_path', config)
  return response
}

export default {
  browse,
  downloadLink,
  fetch,
  fetchEmbeddedThumbnail,
  getDiscoverPath,
  getSegmentationInfo
}
