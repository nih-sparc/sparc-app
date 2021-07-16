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
		group: "dataset",
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

		nodes.push({
			id,
			name: awardName,
			group: "other",
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

		nodes.push({
			id,
			name: nameForPerson(owner),
			group: "person",
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

		nodes.push({
			id,
			name: organization.name,
			group: "other",
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


	return {nodes, edges}
}


function nameForPerson (person) {
	// there should only be two formats for this. 
	//
	if (person.firstName) {
		// pensnieve api format
		return `${person.lastName}, ${person.firstName}`
	} else {
		// es api format
		return `${person.last.name}, ${person.first.name}`
	}
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
		group: "dataset",
		id: datasetID,
		label: "dataset"
	})

	//////////////////////////
	// add entities for owner
	let ownerId 	= pennsieveRecord.ownerOrcid && pennsieveRecord.ownerOrcid !== "" ? `ORC:${pennsieveRecord.ownerOrcid}` : pennsieveRecord.ownerId
	let ownerName = pennsieveRecord.ownerLastName && pennsieveRecord.ownerLastName !== "" && nameForPerson({
		lastName: pennsieveRecord.ownerLastName, 
		firstName: pennsieveRecord.ownerFirstName
	})

	if (!ownerId)  {
		// if that still doesn't catch, try using name
		ownerId = ownerName
	} 

	if (ownerId)  {
		// use orcid, or if not availble use pennsieve internal id
		// but add the ORC prefix, so matche sthe curie

		// group by dataset 
		// why not, it'll look nice

		nodes.push({
			id: ownerId,
			name: ownerName,
			group: "person",
			label: "person",
		})

		console.log("adding edge", {
	    sourceId: datasetID,
			targetId: ownerId,
			label: "isOwnedBy",
		})
		edges.push({
	    sourceId: datasetID,
			targetId: ownerId,
			label: "isOwnedBy",
		})
	} 

	if (pennsieveRecord.contributors) {
		addEntitiesForContributors({
			nodes, 
			edges, 
			datasetID, 
			contributors: pennsieveRecord.contributors,
		})
	}
		
	if (pennsieveRecord.organizationId) {
		const orgId = pennsieveRecord.organizationId
		nodes.push({
			id: orgId,
			name: pennsieveRecord.organizationName,
			group: "other",
			label: "organization",
		})

		edges.push({
	    sourceId: datasetID,
			targetId: orgId,
			label: "hasOrganization",
		})
	}

	// TODO can add source dataset id also (?)

	console.log("pennsieve entities:", {nodes, edges})
	return {nodes, edges}
}



// modifies the passed in nodes and edges to add relevant data from contributors array
function addEntitiesForContributors({nodes, edges, datasetID, contributors}) {
	contributors.forEach((contributor) => {

		// use identifier if possible, if not use agency name as unique id for this contributor type
		// if not that, full name
		const id = contributor.curie || (contributor.orcid ? `ORC:${contributor.orcid}` : nameForPerson(contributor))

		nodes.push({
			id,
			name: nameForPerson(contributor),
			group: "person",
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
					group: "other",
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

	// no return value, just mutates
}
