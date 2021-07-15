import fakeData from './miserables.json'
//import fakeData from './miserables.small-sample.json'

export default (nodes, edges) => {
	// started from here, 
	////  https://vda-lab.github.io/visualisation-tutorial/vega-force-directed-networks.html
	//
	// but then trying to add features back in from this one:
  // https://vega.github.io/vega/examples/force-directed-layout/
  const spec = {
		"$schema": "https://vega.github.io/schema/vega/v5.json",
		"width": 700,
		"height": 500,
		// "width": 350,
		// "height": 250,
		"padding": 0,
		"autosize": "none",

		"signals": [
			{ "name": "cx", "update": "width / 2" },
			{ "name": "cy", "update": "height / 2" },
			{ "name": "nodeRadius", "value": 8,
				"bind": {"input": "range", "min": 2, "max": 30, "step": 1} 
		  },
			{ "name": "nodeCharge", "value": -5,
				"bind": {"input": "range", "min":-30, "max": 10, "step": 1} 
			},
			{ "name": "linkDistance", "value": 30
				//"bind": {"input": "range", "min": 5, "max": 100, "step": 1} 
			},
			// toggles if animated simulation (false) or calculate in batch (true)
			{ "name": "static", "value": false,
				"bind": {"input": "checkbox"} 
			},
		],

		"data": [
			{
				"name": "node-data",
				//"url": "https://raw.githubusercontent.com/vega/vega-datasets/master/data/miserables.json",
				//"format": {"type": "json", "property": "nodes"}
				"values": fakeData.nodes,
				"format": {"type": "json"}
			},
			{
				"name": "link-data",
				"url": "https://raw.githubusercontent.com/vega/vega-datasets/master/data/miserables.json",
				 "format": {"type": "json", "property": "links"}
				//"values": fakeData.links,
				//"format": {"type": "json"}
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
