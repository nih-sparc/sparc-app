import fakeData from './miserables.json'
//import fakeData from './miserables.small-sample.json'

/**
 * takes a single elasticsearch enriched record (ie for a single dataset) and converts to nodes and edges
 */ 
export function elasticsearchRecordToGraphEntities (elasticsearchRecord) {
	// node entry schema (ie what's expected by our vega spec):
	// {
	//     "group": 1,
	//     "id": 0,
	//     // if needed, we can add these at the end
	//     "index": 0,
	//     "name": "Myriel"
	//     "label": 1
	// },

	let nodes = []

	// edge entry schema:
	// {
	//     // will try to use node.id, but if needed, we can transform to use index at the end instead
	//     "source": 1,
	//     // source->target. But add at end of this function
	//     "id": "1->0",
	//     "target": 0,
	//     "label": "hasAward"
	// },
	let edges = []

	// add this dataset itself

	const datasetID = elasticsearchRecord.item.docid
	nodes.push({
		group: datasetID,
		id: datasetID,
		name: elasticsearchRecord.item.name,
		label: "dataset"
	})

	//////////////////////////
	// add entities for awards
	elasticsearchRecord.supportingAwards && elasticsearchRecord.supportingAwards.forEach((award) => {
		// use identifier if possible, if not use agency name as unique id for this award type 
		// (since not all awards have identifier)
		const id = award.identifier || (award.agency && award.agency.name)

		// group by dataset 
		// why not, it'll look nice
		const group = datasetID

		nodes.push({
	    group,
			id,
			name: group,
			label: "award"
		})
		edges.push({
	    sourceId: datasetID,
			targetId: id,
			label: "receivedAward"
		})
	}) 

	//////////////////////////
	// add entities for owner
	if (elasticsearchRecord.pennsieve && elasticsearchRecord.pennsieve.owner)  {
		const owner = elasticsearchRecord.pennsieve.owner
		// use orcid
		// but add the ORC prefix, so matche sthe curie
		const id = `ORC:${owner.orcid.identifier}`

		// group by dataset 
		// why not, it'll look nice
		const group = datasetID

		nodes.push({
	    group,
			id,
			name: nameForPerson(owner),
			label: "person"
		})

		edges.push({
	    sourceId: datasetID,
			targetId: id,
			label: "isOwnedBy"
		})
	} 

	//////////////////////////
	// add entities for org
	if (elasticsearchRecord.pennsieve && elasticsearchRecord.pennsieve.organization)  {
		const organization = elasticsearchRecord.pennsieve.organization
		// use orcid
		const id = organization.identifier

		// group by dataset 
		// why not, it'll look nice
		const group = datasetID

		nodes.push({
	    group,
			id,
			name: organization.name,
			label: "organization"
		})

		edges.push({
	    sourceId: datasetID,
			targetId: id,
			label: "hasOrganization"
		})
	} 

	//////////////////////////
	// add entities for contributors
	elasticsearchRecord.contributors && elasticsearchRecord.contributors.forEach((contributor) => {

		// use identifier if possible, if not use agency name as unique id for this contributor type
		const id = contributor.curie

		// group by agency name (for now)
		const group = contributor.agency && contributor.agency.name || datasetID

		nodes.push({
	    group,
			id,
			name: nameForPerson(contributor),
			label: "person"
		})

		edges.push({
	    sourceId: id,
			targetId: datasetID,
			label: "contributedTo"
		})

		// if they have affiliations, add that 
		if (contributor.affiliations) {
			contributor.affiliations.forEach(affiliation => {

				// I think they only have descriptions, no other fields
				const affiliationID = affiliation.description

				nodes.push({
					group: datasetID,
					id: affiliationID,
					name: affiliationID,
					label: "affiliation"
				})

				edges.push({
					sourceId: id,
					targetId: affiliationID,
					label: "hasAffiliation"
				})
			}) 
		}
	}) 

	// add "index" for all nodes (maybe it's needed after all, having trouble getting it working without this)
	// looks like it might need 
	nodes = nodes.map((n, index) => {
		n.index = index

		return n
	})

	// add unique ids for all edges, to identify the edges
	edges = edges.map(e => {
		e.id = `${e.sourceId}->${e.targetId}`
		// reference the index of the source and target nodes. 
		// Have to use the specific keys "source" and "target"
		// - https://vega.github.io/vega/docs/transforms/force/#link
		e.source = nodes.find(n => n.id == e.sourceId).index
		e.target = nodes.find(n => n.id == e.targetId).index

		return e
	})

	return {nodes, edges}
}


function nameForPerson (person) {
	return `${person.last.name}, ${person.first.name}`
}

/**
 *
 * takes pennsieve (unenriched) data (ie for a single dataset) and converts to nodes and edges
 * TODO
 */ 
export function pennsieveRecordToGraphEntities (pennsieveRecord) {
	const nodes = []
	const edges = []
	console.warn("WARNING not yet implemented pennsieve record graph entities")

	return {nodes, edges}
}
