
const bodyParser = require('body-parser')
const axios = require('axios')

const app = require('express')()

const scicrunch_api_endpoint = "https://scicrunch.org/api/1/elastic/SPARC_PortalDatasets_pr/"
const scicrunch_api_key = process.env.SCICRUNCH_API_KEY

/**
 * takes a DOI id and returns what es needs for its query_string.query, to do a _id lookup
 */ 
function prepareQueryForDoiID (doiID) {
  // I guess axios escapes teh slashes for us, we need to escape the colons though
  const escaped = doiID
    .replace("/", "\\/")

  return "(_id:DOI\\:" + escaped + ")"
}
/**
 * implementation to fetch from es in multiple requests. 
 * - We might hit quota faster, but probably better performance especially with large es payloads (sometimes in MB size)
 */ 
async function fetchInParallel (doiIDs) {
  const bodyBase = {
		size: 10,
		from: 0,
		// get only fields we need, for faster response times
		_source: [
			"item.keywords",
			"item.description",
			"item.name",
			"item.identifier",
			"item.docid",
			"item.curie",
			"contributors",
			"supportingAwards",
			"pennsieve"
		],
		query: {}
  }
  const queryStringBase = {
    // using a single backslash like this works
		// query: "_id:((DOI\:10.26275\/yibc-wyu2))"
    query: null,
  }

  const getOne = async (doiID) => {
    // manual (and quick and dirty) deep cloning, so each http req body is a unique js obj
    const body = Object.assign({}, bodyBase)
    const queryForDoiId = prepareQueryForDoiID(doiID)

    // should end up something like this
		// query: "_id:((DOI\\:10.26275\\/yibc-wyu2))"
    body.query.query_string = Object.assign({}, queryStringBase, {
      query: queryForDoiId,
    })
    console.log("req body to send to scicrunch", body)

    // url to send to scicrunch es endpoint
    const url = scicrunch_api_endpoint + "_search?api_key=" + scicrunch_api_key

    // send it
    try {
      const body = Object.assign({}, bodyBase)

      const oneEnrichedData = await axios.post(url, body)
      console.log("received one response from es endpoint:", oneEnrichedData)
      return {result: oneEnrichedData, doiID}

    } catch (err) {
      // make sure to log the response after digging down,  we have something helpful in the logs
      const { response } = err
      const { request, ...errorObject } = response
      console.error(errorObject)

      throw err
    }
  }

  // send a request to es endpoint, one per DOI ID
  const requests = doiIDs.map(d => getOne(d))

  // wait for all to return, compile into array
  const allResponses = await Promise.all(requests)
  const enrichedData = allResponses.map(response => {
    // dig into all the fluff axios returns
    const axiosData = response.result.data

    // dig into all the fluff es returns
    // - NOTE should only be one record, so return that
    const esRecord = axiosData.hits.hits[0] || {foundStatus: "not-found-in-scicrunch-es-api", doiID: response.doiID}

    return esRecord
  })

  return enrichedData
}
/**
 * implementation to fetch from es in single request. 
 * TODO not tested
 */ 

async function fetchInOneRequest (doiIDs) {
  const body = {
		size: 10,
		from: 0,
		query: {
      query_string: {
        // will add "query" key  and its value here shortly e.g., 
        // "query": "(_id:DOI\\:10.26275\\/yibc-wyu2) OR (_id:DOI\\:10.26275\\/yibc-wyu2) "
      }
		}
  }
		
  const fixedDoiIds = doiIDs.map(prepareQueryForDoiID).join(" OR ")
  body.query.query_string.query = fixedDoiIds
  console.log("req body to send to scicrunch", body)

  // url to send to scicrunch es endpoint
  const url = scicrunch_api_endpoint + "_search?api_key=" + scicrunch_api_key

  // send it
  try {
    const response = await axios.post(url, body)
    console.log("received one response from es endpoint:", oneEnrichedData)
    // dig into all the fluff axios returns
    const axiosData = response.data

    // dig into all the fluff es returns
    // - NOTE should only be one record, so return that
    const esRecords = axiosData.hits.hits
    if (esRecords.length == 0) {
      return "not-found-in-scicrunch-es-api"

    } else {
      return esRecords
    }

  } catch (err) {
    // make sure to log the response after digging down,  we have something helpful in the logs
    const { response } = err
    const { request, ...errorObject } = response
    console.error(errorObject)

    throw err
  }
  

  return enrichedData
}

app.use(bodyParser.json())


// enrich data, given an array of DOI strings as query params
// real route: /sparc-app/dataset-discovery-api/enrich-data-for-datasets
// e.g., for dev env
// http://localhost:3000/sparc-app/dataset-discovery-api/enrich-data-for-datasets?datasetDOIIds[]=10.26275%2Fpfxu-irqf
app.get('/enrich-data-for-datasets', async (req, res, next) => {
  console.log("enriching query:", req.query)
  const reqParams = req.query
  

  try {
    // identifiers received from frontend params, which we use to query the es backend in scicrunch
    // should be array, something like [DOI:10.26275/yibc-wyu2, DOI:10.26275/yibc-wyu2]
    // defaults to none
    const doiIDs = reqParams.datasetDOIIds || []
    console.log("got ids:", doiIDs)

    const enrichedData = await fetchInParallel(doiIDs)
    // const enrichedData = await fetchInOneRequest(doiIDs)


    // send back to frontend
    res.json({ 
      params: reqParams, 
      enrichedData,
    })

  } catch (err) {
    console.error(err)
    next(err)
  }
})

// catch all...so can test if server is up. e.g. in dev env
// curl http://localhost:3000/sparc-app/dataset-discovery-api/test
app.all('*', (req, res) => {
  res.json({ data: 'catch-all' })
})

module.exports = app
