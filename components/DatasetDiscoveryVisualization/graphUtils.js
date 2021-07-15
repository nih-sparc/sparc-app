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

	const nodes = []

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
	    source: datasetID,
			target: id,
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
	    source: datasetID,
			target: id,
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
	    source: datasetID,
			target: id,
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
	    source: id,
			target: datasetID,
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
					source: id,
					target: affiliationID,
					label: "hasAffiliation"
				})
			}) 
		}
	}) 

	// add ids for all edges
	edges = edges.map(e => {
		e.id = `${e.source}->${e.target}`

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
	return {nodes, edges}
}
