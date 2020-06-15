import {update as pathUpdate} from "@irrelon/path";
import {matchPipeline} from "./match";
import {queryToPipeline} from "./build";

/**
 * @typedef {Object} UpdateOptions
 * @property {Boolean} [$one=false] When true, will only update the first
 * document that matched the query. The return array will only contain
 * one element at most.
 * @property {Boolean} [immutable=false] When true, generates a new document
 * instead of modifying the document object directly.
 */

/**
 * Update does a search for matching records in an array of data based on
 * the passed query and then modifies the data based on the passed update
 * object.
 * @param {Array} data The array of data to query.
 * @param {Object} query A query object.
 * @param {Object} update The update object.
 * @param {UpdateOptions} [options] An options object.
 * @returns {Array} The array of data that matched the passed query and
 * received an update.
 */
export const update = (data, query, update = {}, options = {}) => {
	// Break query into operations
	const pipeline = queryToPipeline(query);
	const updated = [];
	
	// Loop through each item of data and check if it matches the query
	for (let currentIndex = 0; currentIndex < data.length; currentIndex++) {
		let item = data[currentIndex];
		const matchResult = matchPipeline(pipeline, item, {originalQuery: query});

		// If the document did not match our query, start on the next one
		if (!matchResult) continue;
		
		// We found a matching record, update it
		item = pathUpdate(item, update, options);
		updated.push(item);
		
		if (options.$one === true) {
			// Quit since we only wanted to update the first matching record ($one)
			break;
		}
	}
	
	return updated;
};

export default update;