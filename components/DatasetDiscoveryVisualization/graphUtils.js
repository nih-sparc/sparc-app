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
		name: elasticsearchRecord.item.name,
		group: datasetID,
		id: datasetID,
		label: "dataset"
	})

	//////////////////////////
	// add entities for awards
	elasticsearchRecord.supportingAwards && elasticsearchRecord.supportingAwards.forEach((award) => {
		// use identifier if possible, if not use agency name as unique id for this award type 
		// (since not all awards have identifier)
		const awardName = (award.agency && award.agency.name) || "(unnamed award)"
		// for now, let's just group all awards having the same agency name together
		//const id = award.identifier || awardName
		const id = awardName

		// group by dataset 
		// why not, it'll look nice
		const group = datasetID

		nodes.push({
			id,
			name: awardName,
	    group,
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
			id,
			name: nameForPerson(owner),
	    group,
			label: "person",
		})

		edges.push({
	    sourceId: datasetID,
			targetId: id,
			label: "isOwnedBy",
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
			id,
			name: organization.name,
	    group,
			label: "organization",
		})

		edges.push({
	    sourceId: datasetID,
			targetId: id,
			label: "hasOrganization",
		})
	} 

	//////////////////////////
	// add entities for contributors
	elasticsearchRecord.contributors && addEntitiesForContributors({
		nodes, 
		edges, 
		datasetID, 
		contributors: elasticsearchRecord.contributors,
	})

  // add unique ids for all edges, to identify the edges
	edges = edges.map(e => {
		e.id = `${e.sourceId}->${e.targetId}`
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

	const datasetID = pennsieveRecord.doi ? `DOI:${pennsieveRecord.doi}` : id

	nodes.push({
		name: pennsieveRecord.name,
		group: datasetID,
		id: datasetID,
		label: "dataset"
	})

	//////////////////////////
	// add entities for owner
	if (pennsieveRecord.ownerOrcid)  {
		
		// use orcid, or if not availble use pennsieve internal id
		// but add the ORC prefix, so matche sthe curie
		let ownerId = pennsieveRecord.ownerOrcid ? `ORC:${pennsieveRecord.ownerOrcid}` : pennsieveRecord.ownerId

		// group by dataset 
		// why not, it'll look nice
		const group = datasetID

		nodes.push({
			id: ownerId,
			name: nameForPerson(`${pennsieveRecord.ownerLastName}, ${pennsieveRecord.ownerFirstName}`),
	    group,
			label: "person",
		})

		edges.push({
	    sourceId: datasetID,
			targetId: ownerId,
			label: "isOwnedBy",
		})
	} 
	return {nodes, edges}
}

// modifies the passed in nodes and edges to add relevant data from contributors array
function addEntitiesForContributors({nodes, edges, datasetID, contributors}) {
	contributors.forEach((contributor) => {

		// use identifier if possible, if not use agency name as unique id for this contributor type
		const id = contributor.curie || `ORC:${contributor.orcid}`

		// group by datasetid 
		const group = datasetID

		nodes.push({
			id,
			name: nameForPerson(contributor),
	    group,
			label: "person",
		})

		edges.push({
	    sourceId: id,
			targetId: datasetID,
			label: "contributedTo",
		})

		// if they have affiliations, add that 
		if (contributor.affiliations) {
			contributor.affiliations.forEach(affiliation => {

				// I think they only have descriptions, no other fields
				const affiliationID = affiliation.description

				nodes.push({
					id: affiliationID,
					name: affiliationID,
					group: datasetID,
					label: "affiliation",
				})

				edges.push({
					sourceId: id,
					targetId: affiliationID,
					label: "hasAffiliation",
				})
			}) 
		}
	}) 

}
