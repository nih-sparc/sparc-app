import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.portal_api,
  withCredentials: false,
  timeout: 20000
})

const searchDataset = async id => {
  const response = await apiClient.get('/image_search/' + id)
  return response.data
}

const getXMPInfo = async id => {
  const response = await apiClient.get('/image_xmp_info/' + id)
  return response.data
}

const getThumbnail = async id => {
  return apiClient.get('thumbnail/' + id)
}

const getNeurolucidaThumbnail = async (id, version, path) => {
  const config = {
    params: {
      datasetId: id,
      version,
      path
    }
  }
  const response = await apiClient.get('thumbnail/neurolucida', config)
  return response.data
}

const getImageInfo = async id => {
  const response = await apiClient.get('image/' + id)
  return response.data
}

const getCollectionInfo = async id => {
  return apiClient.get('collections/' + id)
}

export default {
  getThumbnail,
  getNeurolucidaThumbnail,
  searchDataset,
  getImageInfo,
  getCollectionInfo,
  getXMPInfo
}
