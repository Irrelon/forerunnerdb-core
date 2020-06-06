import {update as pathUpdate} from "@irrelon/path";
import {matchPipeline} from "./match";
import {queryToPipeline} from "./build";

/**
 * Update searches for matching records in an array of data based on
 * the passed query.
 * @param {Array} data The array of data to query.
 * @param {Object} query A query object.
 * @param {Object} update The update object.
 * @param {Object} [options] An options object.
 * @returns {Array} The array of data that matched the passed query.
 */
const update = (data, query, update = {}, options = {}) => {
	// Break query into operations
	const pipeline = queryToPipeline(query);
	const updated = [];
	
	// Loop through each item of data and check if it matches the query
	for (let currentIndex = 0; currentIndex < data.length; currentIndex++) {
		const item = data[currentIndex];
		const matchResult = matchPipeline(pipeline, item, {originalQuery: query});
		
		if (!matchResult) continue;
		
		// We found a matching record, update it
		pathUpdate(item, update);
		updated.push(item);
		
		if (options.$one === true) {
			// Quit since we only wanted to update the first matching record ($one)
			break;
		}
	}
	
	return updated;
};

export default update;