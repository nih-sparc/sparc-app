import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.portal_api,
  withCredentials: false,
  timeout: 10000
})

const search = query => {
  return apiClient.get('search/' + query)
}

const getDatasetInfo = async id => {
  return apiClient.get('dataset_info/' + id)
}

const getDatasetInfoFromDOI = async doi => {
  const config = {
    params: {
      doi
    }
  }
  return apiClient.get('dataset_info_from_doi/', config)
}

const getImageInfo = async id => {
  return apiClient.get('image/' + id)
}

const getCollectionInfo = async id => {
  return apiClient.get('collections/' + id)
}

export default {
  getDatasetInfo,
  getDatasetInfoFromDOI,
  search,
  getImageInfo,
  getCollectionInfo
}
