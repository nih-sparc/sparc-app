import fakeData from './miserables.json'
//import fakeData from './miserables.small-sample.json'

export default (graphData) => {
  const { nodes, edges } = graphData
  // for now just use their sample code raw
  // https://vega.github.io/vega/examples/force-directed-layout/
  // TODO for some reason, doesn't work. Has more functionality though
  const spec = {
		"$schema": "https://vega.github.io/schema/vega/v5.20.2.json",
		"description": "A node-link diagram with force-directed layout, depicting character co-occurrence in the novel Les Misérables.",
		"width": 700,
		"height": 500,
		"padding": 0,
		"autosize": "none",

		"signals": [
			{ "name": "cx", "update": "width / 2" },
			{ "name": "cy", "update": "height / 2" },
			{ "name": "nodeRadius", "value": 8,
				"bind": {"input": "range", "min": 2, "max": 30, "step": 1} 
		  },
			// "
			{ "name": "nodeCharge", "value": -10,
				"bind": {"input": "range", "min":-50, "max": 10, "step": 1} 
			},
			{ "name": "linkDistance", "value": 30
				//"bind": {"input": "range", "min": 5, "max": 100, "step": 1} 
			},
			// toggles if animated simulation (false) or calculate in batch (true)
			{ "name": "static", "value": false,
				"bind": {"input": "checkbox"} 
			},
			{
				"description": "State variable for active node fix status.",
				"name": "fix", 
				// value at start
				"value": false,
				"on": [
					{
						"events": "symbol:mouseout[!event.buttons], window:mouseup",
						"update": "false"
					},
					{
						"events": "symbol:mouseover",
						"update": "fix || true"
					},
					{
						"events": "[symbol:mousedown, window:mouseup] > window:mousemove!",
						"update": "xy()",
						"force": true
					}
				]
			},
			{
				"description": "Graph node most recently interacted with.",
				"name": "node", "value": null,
				"on": [
					{
						"events": "symbol:mouseover",
						"update": "fix === true ? item() : node"
					}
				]
			},
			{
				"description": "Flag to restart Force simulation upon data changes.",
				"name": "restart", "value": false,
				"on": [
					{"events": {"signal": "fix"}, "update": "fix && fix.length"}
				]
			}
		],

		"data": [
			{
				"name": "node-data",
				//"url": "https://vega.github.io/editor/data/miserables.json",
				"values": nodes,
				"format": {"type": "json"}
			},
			{
				// each record in this array should have a "source" and "target" property, as required by the "links" force 
				// https://vega.github.io/vega/docs/transforms/force/#link
				"name": "link-data",
				//"url": "https://vega.github.io/editor/data/miserables.json",
				"values": edges,
				"format": {"type": "json"}
			}
		],

		"scales": [
			{
				"name": "color",
				"type": "ordinal",
				"domain": {"data": "node-data", "field": "group"},
				"range": {"scheme": "category20c"}
			}
		],

		"marks": [
			// draw the nodes circles
			{
				"name": "nodes",
				"type": "symbol",
				"zindex": 1,

				"from": {"data": "node-data"},
				"on": [
					{
						"trigger": "fix",
						"modify": "node",
						"values": "fix === true ? {fx: node.x, fy: node.y} : {fx: fix[0], fy: fix[1]}"
					},
					{
						"trigger": "!fix",
						"modify": "node", "values": "{fx: null, fy: null}"
					}
				],

				"encode": {
					"enter": {
						"fill": {"scale": "color", "field": "group"},
						"stroke": {"value": "white"}
					},
					"update": {
						"size": {"signal": "2 * nodeRadius * nodeRadius"},
						"cursor": {"value": "pointer"}
					}
				},

				// this scatters/draws together the nodes from each other based on various factors (the "forces" array)
				"transform": [
					{
						"type": "force",
						// The number of iterations to run the simulation when in static mode 
						"iterations": 300,
						// Indicates if the simulation should restart when node object fields are modified
						"restart": {"signal": "restart"},
						// Indicates if the simulation should be computed in batch to produce a static layout
						// (true) or should be animated (false). The default is false. toggleable by a slider in
						// our chart
						"static": {"signal": "static"},
						"signal": "force",
						"forces": [
							{"force": "center", "x": {"signal": "cx"}, "y": {"signal": "cy"}},
							{"force": "collide", "radius": {"signal": "nodeRadius"}},
							{"force": "nbody", "strength": {"signal": "nodeCharge"}},
							// https://vega.github.io/vega/docs/transforms/force/#link
							{
								"force": "link", 
								"links": "link-data", 
								"distance": {"signal": "linkDistance"}
							}
						]
					}
				]
			},

			// https://vega.github.io/vega/docs/marks/path/
			// this draws the edge itself. 
			// - instead of setting a specific path/angle/scalex/scaley, using special linkpath transform,
			// which is just for paths
			// https://vega.github.io/vega/docs/transforms/linkpath/
			// - literally just draws the lines - without this, links still have a "force" on the nodes,
			// pulling them from going too far from each other (due to the "forces" mark) but the lines
			// are not drawn
			{
				"type": "path",
				"from": {"data": "link-data"},
				"interactive": false,
				"encode": {
					"update": {
						"stroke": {"value": "#ccc"},
						"strokeWidth": {"value": 1.5}
					}
				},
				// https://vega.github.io/vega/docs/transforms/linkpath/
				"transform": [
					{
						"type": "linkpath",
						"require": {"signal": "force"},
						// 
						"shape": "line",
						// original
						"sourceX": "datum.source.x", "sourceY": "datum.source.y",
						"targetX": "datum.target.x", "targetY": "datum.target.y"
					}
				]
			}
		]
	}

  return spec
}

