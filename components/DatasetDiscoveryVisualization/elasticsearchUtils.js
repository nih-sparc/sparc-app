import fakeData from './miserables.json'
//import fakeData from './miserables.small-sample.json'

/**
 * checks the vue store for this record before querying the db
 * - can save a round trip!
 * - returns undefined if not found for that doiID
 */ 
export function checkCacheForESRecord (doiID) {
	return this.$store.datasetComparison.osparcResults[doiID]
} 

