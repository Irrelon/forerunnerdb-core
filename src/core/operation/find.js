import {matchPipeline} from "./match";
import {queryToPipeline} from "./build";

/**
 * Find searches for matching records in an array of data based on
 * the passed query.
 * @param {Array} data The array of data to query.
 * @param {Object} query A query object.
 * @returns {Array} The array of data that matched the passed query.
 */
export const find = (data, query) => {
	// Break query into operations
	const pipeline = queryToPipeline(query);

	// TODO: Loop each operation and check if an index (or multiple indexes) matches the path
	//  and then order indexes that do match by how much they match. Take the most-matching
	//  index and pull the data lookup from it rather than using the whole data array to do
	//  effectively a table scan
	/*if (false) {
		data = index.find();
	}*/

	// Loop through each item of data and return a final filtered array
	return data.filter((item) => matchPipeline(pipeline, item, {"originalQuery": query}));
};

export const findOne = (data, query) => {
	// Break query into operations
	const pipeline = queryToPipeline(query);

	// TODO: Currently only returns the first matching item but we need to take into
	//  account sorting first if a sort operator is specified (which we need to define
	//  since we haven't implemented sorting yet anyway)

	// Loop through each item of data and return the first matching item
	return data.find((item) => matchPipeline(pipeline, item, {"originalQuery": query}));
};

/**
 * Find searches for matching records in an array of data based on
 * the passed query. This function will traverse object hierarchies
 * to find matching data.
 * @param {Array} data The array of data to query.
 * @param {Object} query A query object.
 * @returns {Array} The array of data that matched the passed query.
 */
export const findDeep = (data, query) => {
	return [];
};

// TODO support calling explain that returns a query plan

export default find;