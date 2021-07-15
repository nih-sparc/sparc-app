import fakeData from './miserables.json'
//import fakeData from './miserables.small-sample.json'

export default (nodes, edges) => {
  // for now just use their sample code raw
  // https://vega.github.io/vega/examples/force-directed-layout/
	////  https://vda-lab.github.io/visualisation-tutorial/vega-force-directed-networks.html
  const spec = {
		"$schema": "https://vega.github.io/schema/vega/v5.json",
		"width": 700,
		"height": 500,
		"padding": 0,
		"autosize": "none",

		"signals": [
			{ "name": "cx", "update": "width / 2" },
			{ "name": "cy", "update": "height / 2" },
		],

		"data": [
			{
				"name": "node-data",
				"url": "https://raw.githubusercontent.com/vega/vega-datasets/master/data/miserables.json",
				"format": {"type": "json", "property": "nodes"}
			},
			{
				"name": "link-data",
				"url": "https://raw.githubusercontent.com/vega/vega-datasets/master/data/miserables.json",
				"format": {"type": "json", "property": "links"}
			}
		],

		"marks": [
			{
				"name": "nodes",
				"type": "symbol",
				"zindex": 1,

				"from": {"data": "node-data"},

				"encode": {
					"enter": {
						"fill": {"value": "grey"}
					}
				},

				"transform": [
					{
						"type": "force",
						"iterations": 300,
						"velocityDecay": 0.4,
						"forces": [
							{"force": "center", "x": {"signal": "cx"}, "y": {"signal": "cy"}},
							{"force": "collide", "radius": 5},
							{"force": "nbody", "strength": -10},
							{"force": "link", "links": "link-data", "distance": 15}
						]
					}
				]
			},
			{
				"type": "path",
				"from": {"data": "link-data"},
				"interactive": false,
				"encode": {
					"update": {
						"stroke": {"value": "lightgrey"},
						"strokeWidth": {"value": 0.5}
					}
				},
				"transform": [
					{
						"type": "linkpath", "shape": "line",
						"sourceX": "datum.source.x", "sourceY": "datum.source.y",
						"targetX": "datum.target.x", "targetY": "datum.target.y"
					}
				]
			}
		]
	}

  return spec
}
