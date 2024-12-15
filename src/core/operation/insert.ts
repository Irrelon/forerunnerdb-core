import {
	testFlight,
	EnumTestFlightResult
} from "./testFlight";
import {CollectionDocument} from "../../types/CollectionDocument";
import {InsertOptions} from "../../types/InsertOptions";
import { InsertResult } from "../../types/InsertResult";
import {FlightTestFunction} from "../../types/FlightTestFunction";

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
 * @property {Function} [$assignment] If passed, overrides the function that
 * would normally push the final data to the `dataArr` argument.
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
 * @param {Object|Array<Object>} insertObjOrArr A document or array of documents to insert.
 * @param {InsertOptions} [options] An options object.
 * @returns {Promise<InsertResult>} The result of the insert operation.
 */
export const insert = async (dataArr: CollectionDocument[], insertObjOrArr: CollectionDocument | CollectionDocument[], options: InsertOptions = {}): Promise<InsertResult> => {
	let insertArr: CollectionDocument[];

	if (Array.isArray(insertObjOrArr)) {
		insertArr = insertObjOrArr;
	} else {
		insertArr = [insertObjOrArr];
	}

	const inserted: CollectionDocument[] = [];
	const notInserted: CollectionDocument[] = [];

	const preFlightArr: FlightTestFunction[] = [];
	const postFlightArr: FlightTestFunction[] = [];

	const assignmentFunc = options.$assignment || ((args: CollectionDocument[]) => {
		dataArr.push(...args);
	});

	if (options.$preFlight) {
		preFlightArr.push(options.$preFlight);
	}

	if (options.$postFlight) {
		postFlightArr.push(options.$postFlight);
	}

	const executeFlight = (doc: CollectionDocument) => {
		// Decouple outer object
		return {...doc};
	};

	// Loop through each item of data and insert it
	for (let currentIndex = 0; currentIndex < insertArr.length; currentIndex++) {
		const originalDoc = insertArr[currentIndex];
		const updatedDoc = await testFlight([originalDoc], preFlightArr, executeFlight, postFlightArr, {
			"$atomic": Boolean(options.$atomic),
			"$ordered": Boolean(options.$ordered)
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
				inserted: [],
				notInserted: insertArr,
				nInserted: 0,
				nFailed: insertArr.length,
				failures: []
			};
		}

		inserted.push(updatedDoc);
	}

	if (!options.$skipAssignment && inserted.length) {
		assignmentFunc(inserted);
	}

	return {
		inserted,
		notInserted,
		nInserted: inserted.length,
		nFailed: 0,
		failures: []
	};
};

export default insert;