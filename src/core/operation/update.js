import {update as pathUpdate} from "@irrelon/path";
import {matchPipeline} from "./match";
import {queryToPipeline} from "./build";
import {
	testFlight,
	EnumTestFlightResult
} from "./testFlight";

/**
 * @typedef {Object} UpdateOptions
 * @property {Boolean} [$one=false] When true, will only update the first
 * document that matched the query. The return array will only contain
 * one element at most.
 * @property {Boolean} [$ordered=false] When true, will stop processing on
 * the first update failure but leave previous updates intact.
 * @property {Boolean} [$atomic=false] When true, will cancel all updates on
 * the first update failure, reverting any previous updates.
 * @property {Boolean} [$skipAssignment=false] When true, the passed `data`
 * will not be updated at all but the returned array will still contain the
 * updated documents.
 * @property {Function} [$preFlight] If passed, will be called with the document
 * to update and if the preFlight function returns true, we will continue but if
 * it returns false we will cancel the update.
 * @property {Function} [$postFlight] If passed, will be called with the document
 * being updated and the result of the update and if the $postFlight function
 * returns true, we will continue but if it returns false we will cancel the
 * update.
 */

/**
 * Update does a search for matching records in an array of data based on
 * the passed query and then modifies the data based on the passed update
 * object.
 * @param {Array<Object>} dataArr The array of data to query.
 * @param {Object} query A query object.
 * @param {Object} update The update object.
 * @param {UpdateOptions} [options] An options object.
 * @returns {Promise<Array<Object>>} The array of data that matched the passed query
 * and received an update.
 */
export const update = async (dataArr, query, update = {}, options = {}) => {
	// Break query into operations
	const pipeline = queryToPipeline(query);
	const updated = [];
	const updateMap = {};
	
	const preFlightArr = [];
	const postFlightArr = [];
	
	if (options.$preFlight) {
		preFlightArr.push(options.$preFlight);
	}
	
	if (options.$postFlight) {
		postFlightArr.push(options.$postFlight);
	}
	
	const executeFlight = (originalDoc) => {
		return pathUpdate(originalDoc, update, {
			"immutable": true
		});
	};
	
	// Loop through each item of data and check if it matches the query
	for (let currentIndex = 0; currentIndex < dataArr.length; currentIndex++) {
		const originalDoc = dataArr[currentIndex];
		const matchResult = matchPipeline(pipeline, originalDoc, {"originalQuery": query});

		// If the document did not match our query, start on the next one
		if (!matchResult) continue;
		
		const updatedDoc = await testFlight([originalDoc], preFlightArr, executeFlight, postFlightArr, {
			"$atomic": options.$atomic,
			"$ordered": options.$ordered
		});
		
		// If we failed testFlight, skip to the next record
		if (updatedDoc === EnumTestFlightResult.CANCEL) continue;
		if (updatedDoc === EnumTestFlightResult.CANCEL_ORDERED) break;
		if (updatedDoc === EnumTestFlightResult.CANCEL_ATOMIC) return [];
		
		updateMap[currentIndex] = updatedDoc;
		updated.push(updatedDoc);
		
		if (options.$one === true) {
			// Quit since we only wanted to update the first matching record ($one)
			break;
		}
	}
	
	if (!options.$skipAssignment) {
		// Update the document array
		Object.entries(updateMap).forEach(([documentIndex, updatedDoc]) => {
			dataArr[documentIndex] = updatedDoc;
		});
	}
	
	// TODO support $immutable and return a whole new dataArr
	
	return updated;
};

export default update;