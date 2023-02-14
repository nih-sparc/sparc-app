import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.portal_api,
  withCredentials: false,
  timeout: 12003
})

let uberonOrganPairs = undefined

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

/**
 * Get the uberon organ pairs array.
 *
 * @returns {String} Array containing organ, uberon id pair
 */
const getUberonOrganPairs = async () => {
  if (uberonOrganPairs) return uberonOrganPairs
  else {
    return apiClient.get('get-organ-curies/').then(res => {
      uberonOrganPairs = res.data['uberon']['array']
      return uberonOrganPairs
    })
  }
}

/**
 * Get the organ name from the uberon id using a
 * organ - uberon id map from SciCrunch
 * @param {id} The uberon id
 * @returns {String} the organ name
 */
const getOrganFromUberonId = async id => {
  return getUberonOrganPairs().then(pairs => {
    if (pairs) {
      for (let i = 0; i < pairs.length; i++) {
        if (pairs[i]['id'] === id) {
          return pairs[i]['name']
        }
      }
    }
  })
}

export default {
  getDatasetInfoFromObjectIdentifier,
  getDatasetInfoFromDOI,
  getDatasetInfoFromPennsieveIdentifier,
  search,
  getImageInfo,
  getCollectionInfo,
  getOrganFromUberonId
}
