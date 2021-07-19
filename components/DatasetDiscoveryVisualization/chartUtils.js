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

/**
 *
 * expects an array with key of the keyword, and value the count
 */
export function generateWordCloudSpec (keywordsData) {
	// replicating output created by this:
	// https://vega.github.io/vega/docs/transforms/countpattern/
	const counts = Object.keys(keywordsData).map(keyword => {
		const count = keywordsData[keyword]

		return {
			text: keyword, 
			count,
		}
	})
	console.log("counts", counts)

	return {
		"$schema": "https://vega.github.io/schema/vega/v5.json",
		"name": "wordcloud",
		"width": 400,
		"height": 200,
		"padding": 0,
		"autosize": "none",

		"signals": [
			{
				"name": "wordPadding", "value": 1,
				"bind": {"input": "range", "min": 0, "max": 5, "step": 1}
			},
			{
				"name": "fontSizeRange0", "value": 8,
				"bind": {"input": "range", "min": 8, "max": 42, "step": 1}
			},
			{
				"name": "fontSizeRange1", "value": 24,
				"bind": {"input": "range", "min": 8, "max": 42, "step": 1}
			},
			{
				"name": "rotate", "value": 45,
				"bind": {"input": "select", "options": [0, 30, 45, 60, 90]}
			}
		],

		"data": [
			{
				"name": "table",
				values: counts,
				"transform": [
					{
						"type": "formula", "as": "weight",
						"expr": "if(datum.text=='VEGA', 600, 300)"
					},
					{
						"type": "formula", "as": "rotate",
						"expr": "[-rotate, 0, rotate][~~(random() * 3)]"
					},
					{
						"type": "wordcloud",
						"size": [{"signal": "width"}, {"signal": "height"}],
						"text": {"field": "text"},
						"font": "Helvetica Neue, Arial",
						"fontSize": {"field": "count"},
						"fontWeight": {"field": "weight"},
						"fontSizeRange": [{"signal": "fontSizeRange0"}, {"signal": "fontSizeRange1"}],
						"padding": {"signal": "wordPadding"},
						"rotate": {"field": "rotate"}
					}
				]
			}
		],

		"scales": [
			{
				"name": "color",
				"type": "ordinal",
				"range": ["#d5a928", "#652c90", "#939597"]
			}
		],

		"marks": [
			{
				"type": "text",
				"from": {"data": "table"},
				"encode": {
					"enter": {
						"text": {"field": "text"},
						"align": {"value": "center"},
						"baseline": {"value": "alphabetic"},
						"fill": {"scale": "color", "field": "text"},
						"font": {"value": "Helvetica Neue, Arial"},
						"fontWeight": {"field": "weight"}
					},
					"update": {
						"x": {"field": "x"},
						"y": {"field": "y"},
						"angle": {"field": "angle"},
						"fontSize": {"field": "fontSize"},
						"fillOpacity": {"value": 1}
					},
					"hover": {
						"fillOpacity": {"value": 0.5}
					}
				}
			}
		]
	}
}

// this one is for plotly
// NOTE this one is little bit different, don't pass in data directly, only a complete options
export function generateSummaryTableSpec () {
	const data = [
      ['Salaries', 'Office', 'Merchandise', 'Legal', '<b>TOTAL</b>'],
      [1200000, 20000, 80000, 2000, 12120000],
      [1300000, 20000, 70000, 2000, 130902000],
      [1300000, 20000, 120000, 2000, 131222000],
      [1400000, 20000, 90000, 2000, 14102000]]

	const options = [{
		type: 'table',
		header: {
			values: [["<b>EXPENSES</b>"], ["<b>Q1</b>"],
					 ["<b>Q2</b>"], ["<b>Q3</b>"], ["<b>Q4</b>"]],
			align: "center",
			line: {width: 1, color: 'black'},
			fill: {color: "grey"},
			font: {family: "Arial", size: 12, color: "white"}
		},
		cells: {
			values: data,
			align: "center",
			line: {color: "black", width: 1},
			font: {family: "Arial", size: 11, color: ["black"]}
		}
	}]


	return {options}
}
