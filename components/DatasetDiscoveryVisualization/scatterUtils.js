//import fakeData from './miserables.json'
//import fakeData from './miserables.small-sample.json'

/**
 * takes osparc data and covnerts into spec for vis (currently using plotly)
 */ 
export function generateDefaultScatterplotSpec (osparcData) {
	// TODO
	const data = [{ x: [1, 2, 3, 4, 5], y: [1, 2, 4, 8, 16] }]
	const options = { 
		margin: {
			t: 0 
		},  
		height: 500,
	}
	
	return {data, options}
}
