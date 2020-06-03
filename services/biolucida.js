import axios from 'axios'

const biolucidaUser = process.env.BIOLUCIDA_USERNAME
  ? process.env.BIOLUCIDA_USERNAME
  : 'guest'
const biolucidaPassword = process.env.BIOLUCIDA_PASSWORD
  ? process.env.BIOLUCIDA_PASSWORD
  : 'notsure'

const apiClient = axios.create({
  baseURL: process.env.BL_SERVER_URL
    ? process.env.BL_SERVER_URL
    : 'http://localhost:8010/proxy/',
  withCredentials: false,
  timeout: 10000,
})

let token = ''
let expiryDate = new Date(8640000000000000)
let pendingAuthentication = undefined

const getToken = async () => {
  if (expiryDate < Date.now()) {
    return token
  }
  let authenticationPromise = undefined
  if (pendingAuthentication) {
    authenticationPromise = pendingAuthentication
  } else {
    pendingAuthentication = authenticate()
    authenticationPromise = pendingAuthentication
  }
  const response = await authenticationPromise
  setToken(response.data.token, response.headers.expires)
  return token
}

const setToken = (newToken, newExpiry) => {
  token = newToken
  expiryDate = Date.parse(newExpiry)
}

const authenticate = () => {
  let bodyFormData = new FormData()
  bodyFormData.set('username', biolucidaUser)
  bodyFormData.set('password', biolucidaPassword)
  bodyFormData.set('token', token)
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  return apiClient.post('authenticate/', bodyFormData, { headers })
}
const getImageMapData = (id) => {
  return apiClient.get('imagemap/search_dataset/discover/' + id)
}
const getThumbnail = async (id) => {
  const activeToken = await getToken()
  const headers = {
    token: activeToken,
  }
  return apiClient.get('thumbnail/' + id, {
    headers,
    responseType: 'arraybuffer',
  })
}

const getImageInfo = async (id) => {
  return apiClient.get('image/' + id, {
    // responseType: 'application/json',
  })
}

const getCollectionInfo = async (id) => {
  const activeToken = await getToken()
  const headers = {
    token: activeToken,
  }
  return apiClient.get('collections/' + id, {
    headers,
    // responseType: 'application/json',
  })
}

export default {
  getThumbnail,
  getImageMapData,
  getImageInfo,
  getCollectionInfo,
}
