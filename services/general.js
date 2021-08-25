import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.portal_api,
  withCredentials: false,
  timeout: 20000
})

const lookupOLSTerm = async term => {
  const config = {
    params: {
      term
    }
  }
  const response = await apiClient.get('/ols_lookup', config)
  return response.data
}

export default {
  lookupOLSTerm
}
