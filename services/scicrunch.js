import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.portal_api,
  withCredentials: false,
  timeout: 10000
})

const search = query => {
  return apiClient.get('search/' + query)
}

const getDatasetInfoFromObjectIdentifier = async identifier => {
  const config = {
    params: {
      identifier
    }
  }
  return apiClient.get('dataset_info/using_object_identifier', config)
}
const getDatasetInfoFromPennsieveIdentifier = async identifier => {
  const config = {
    params: {
      identifier
    }
  }
  return apiClient.get('dataset_info/using_pennsieve_identifier', config)
}

const getDatasetInfoFromDOI = async doi => {
  const config = {
    params: {
      doi
    }
  }
  return apiClient.get('dataset_info/using_doi', config)
}

const getImageInfo = async id => {
  return apiClient.get('image/' + id)
}

const getCollectionInfo = async id => {
  return apiClient.get('collections/' + id)
}

export default {
  getDatasetInfoFromObjectIdentifier,
  getDatasetInfoFromDOI,
  getDatasetInfoFromPennsieveIdentifier,
  search,
  getImageInfo,
  getCollectionInfo
}
