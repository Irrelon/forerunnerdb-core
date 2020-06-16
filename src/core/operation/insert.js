import {pushVal as pathPushVal} from "@irrelon/path";
import {
	testFlight,
	EnumTestFlightResult
} from "./testFlight";

/**
 * @typedef {Object} InsertOptions
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
 * @typedef {Object} InsertResult
 * @property {Array<Object>} inserted The array of documents that got inserted.
 * @property {Array<Object>} notInserted The array of documents that did not get
 * inserted.
 */

/**
 * Inserts a document or array of documents into the passed `dataArr`.
 * @param {Array<Object>} dataArr The array of data to query.
 * @param {Object|Array<Object>} insertArr A document or array of documents to insert.
 * @param {InsertOptions} [options] An options object.
 * @returns {Promise<InsertResult>} The result of the insert operation.
 */
export const insert = async (dataArr, insertArr, options = {}) => {
	const inserted = [];
	const notInserted = [];
	
	const preFlightArr = [];
	const postFlightArr = [];
	
	if (options.$preFlight) {
		preFlightArr.push(options.$preFlight);
	}
	
	if (options.$postFlight) {
		postFlightArr.push(options.$postFlight);
	}
	
	const executeFlight = (doc) => {
		return {...doc};
	};
	
	// Loop through each item of data and insert it
	for (let currentIndex = 0; currentIndex < insertArr.length; currentIndex++) {
		const originalDoc = insertArr[currentIndex];
		const updatedDoc = await testFlight([originalDoc], preFlightArr, executeFlight, postFlightArr, {
			"$atomic": options.$atomic,
			"$ordered": options.$ordered
		});
		
		// If we failed testFlight, skip to the next record
		if (updatedDoc === EnumTestFlightResult.CANCEL) {
			notInserted.push(originalDoc);
			continue;
		}

		if (updatedDoc === EnumTestFlightResult.CANCEL_ORDERED) {
			notInserted.push(originalDoc);
			break;
		}

		if (updatedDoc === EnumTestFlightResult.CANCEL_ATOMIC) {
			return {
				"inserted": [],
				"notInserted": insertArr
			};
		}
		
		inserted.push(updatedDoc);
	}
	
	if (!options.$skipAssignment) {
		// Update the document array
		dataArr.push(...inserted);
	}
	
	return {
		inserted,
		notInserted
	};
};

export default insert;