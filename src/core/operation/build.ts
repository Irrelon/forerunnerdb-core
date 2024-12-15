import {extendedType} from "../../utils/type";
import {gates} from "./match";
import {flattenValues, join as pathJoin} from "@irrelon/path";
import {ForerunnerQuery} from "../../types/ForerunnerQuery";
import {GenericOperation} from "../../types/GenericOperation";
import {ExtendedType} from "../../types/ExtendedType";
import {GateOperation} from "../../types/GateOperation";
import {PipelineGeneratorFunction} from "../../types/PipelineGeneratorFunction";

export const queryFromObject = (obj: ForerunnerQuery) => {
	return flattenValues(obj, undefined, "", {
		"transformKey": (key, info) => info.isArrayIndex ? "$" : key,
		"leavesOnly": true
	});
};

/**
 * Generates a generic operation function and returns it.
 * @param op The dollar op name e.g. "$eeq".
 * @param path
 * @param value
 * @param typeData
 * @returns {GenericOperation}
 */
export const genericOperation = (op: string = "", path: string, value: any, typeData: ExtendedType): GenericOperation => {
	return {
		op,
		"type": typeData.type,
		"instance": typeData.instance,
		path,
		value
	};
};

// Query operations
/*export const $eeq = genericOperation("$eeq");
export const $eq = genericOperation("$eq");
export const $lt = genericOperation("$lt");
export const $lte = genericOperation("$lte");
export const $gt = genericOperation("$gt");
export const $gte = genericOperation("$gte");
export const $in = genericOperation("$in");
export const $nin = genericOperation("$nin");
export const $ne = genericOperation("$ne");
export const $nee = genericOperation("$nee");
export const $fastIn = genericOperation("$fastIn");
export const $fastNin = genericOperation("$fastNin");*/

// Update operations
/*export const $replaceValue = genericOperation("$replaceValue");
export const $inc = genericOperation("$inc");
export const $push = genericOperation("$push");*/

/**
 * Converts an object into an array of objects, where each key-value pair
 * of the original object is transformed into a new object and pushed into
 * the resulting array.
 *
 * @function
 * @param {Object} obj - The input object to be converted.
 * @returns {Array<Object>} An array containing objects where each object represents a key-value pair from the input object.
 */
export const objectToArray = (obj: Record<string, any>): Record<string, any>[] => {
	return Object.entries(obj).map(([key, val]) => {
		return {
			[key]: val
		};
	});
};

/**
 * A recursive function to flatten a nested array structure into a single-level array.
 *
 * The function takes an input array, checks if it contains nested arrays,
 * and recursively reduces them into a singular flattened array. If the input
 * is not an array, it will return the input unchanged.
 *
 * @param {Array} arr - The array to be flattened. It can include nested arrays or single-level elements.
 * @returns {Array} A new flattened array containing all the elements from the nested structure.
 */
export const flattenArray = (arr: any[]): any[] => {
	if (!Array.isArray(arr)) return arr;
	return arr.reduce((finalArr, item) => {
		if (Array.isArray(item)) {
			return finalArr.concat(flattenArray(item));
		}

		finalArr.push(item);
		return finalArr;
	}, []);
};


export const gateOperation = (op: string, pipelineGenerator: PipelineGeneratorFunction): GateOperation => (path: string, value: any[]): GenericOperation => {
	const finalValue = (() => {
		return value.reduce((itemArr, item) => {
			if (!Array.isArray(item) && Object.keys(item).length > 1) {
				// The `value` is an object with multiple keys / paths
				// so split the object into an array of objects, each
				// object containing one of the key/val pairs of the
				// original `value` object, using the objectToArray function
				return itemArr.concat(flattenArray(objectToArray(item).map((item) => pipelineGenerator(item, op, path))));
			}

			return itemArr.concat(flattenArray(pipelineGenerator(item, op, path)));
		}, []);
	})();

	return {
		op,
		"type": "array",
		"instance": "",
		"path": "",
		"value": finalValue
	};
};

/**
 * Generates a pipeline of tasks for the given query object.
 * @param query
 * @param currentGate
 * @param parentPath
 */
export const queryToPipeline = (query: ForerunnerQuery, currentGate = "", parentPath = ""): GenericOperation => {
	if (!currentGate) {
		const queryKeyArr = Object.keys(query);

		// Check if we already have gate operations
		const gateKey = gates.find((key) => {
			return queryKeyArr.indexOf(key) > -1;
		});

		if (gateKey && queryKeyArr.length > 1) {
			// This is an error. A query can either be fully gated
			// or fully un-gated (implicit $and) but not both
			throw new Error("A query cannot contain both gated and un-gated field properties!");
		}

		if (gateKey) {
			return operationLookup[gateKey](parentPath, query[gateKey]);
		}

		// Implicit $and
		return $and(parentPath, objectToArray(query));
	}

	// ROB: When we call a gate operation we pass an empty path but it needs
	// to be the path to the data - do a step through with the tests to see
	// what's breaking... we're bringing match.js back up to speed after
	// doing a fantastic job rationalising the queryToPipeline() call but it
	// needs to handle paths correctly AND it needs to handle $in correctly...
	// which I suspect means we need a new type of genericOperation() like
	// genericArrayOperation() or whatever. X
	return Object.entries(query).map(([path, value]) => {
		const valTypeData = extendedType(value);

		if (path.indexOf("$") === 0) {
			// This is an operation
			return genericOperation(path, parentPath, value, extendedType(value));
		}

		// The path is not an operation so check if it is holding a recursive
		// value or not
		if (!valTypeData.isFlat) {
			// Wrap this in an $and
			if (currentGate !== "$and") {
				return $and(pathJoin(parentPath, path), objectToArray(value));
			}

			// Merge our current data with the parent data
			return objectToArray(value).map((item) => queryToPipeline(item, currentGate, path));
		}

		// The path is not an operation, the value is not recursive so
		// we have an implicit $eeq
		return genericOperation("$eeq", pathJoin(parentPath, path), value, extendedType(value));
	})[0];
};

export const updateToPipeline = (query: ForerunnerQuery, currentGate = "", parentPath = ""): GenericOperation | GenericOperation[] => {
	if (!currentGate) {
		const queryKeyArr = Object.keys(query);

		// Check if we already have gate operations
		const gateKey = gates.find((key) => {
			return queryKeyArr.indexOf(key) > -1;
		});

		if (gateKey && queryKeyArr.length > 1) {
			// This is an error. A query can either be fully gated
			// or fully un-gated (implicit $updateReplaceMode) but not both
			throw new Error("An update cannot contain both gated and un-gated field properties!");
		}

		if (gateKey) {
			return operationLookup[gateKey](parentPath, query[gateKey]);
		}

		// Implicit $updateReplaceMode
		return $updateReplaceMode(parentPath, objectToArray(query));
	}

	return Object.entries(query).map(([path, value]) => {
		const valTypeData = extendedType(value);

		if (path.indexOf("$") === 0) {
			// This is an operation
			if (valTypeData.isFlat) {
				return genericOperation(path, parentPath, value, extendedType(value));
			}

			// Break each path into a separate operation
			return Object.entries(value).map(([key, item]) => genericOperation(path, key, item, extendedType(item)));
		}

		// The path is not an operation so check if it is holding a recursive
		// value or not
		if (!valTypeData.isFlat) {
			// Wrap this in a $updateReplaceMode
			if (currentGate !== "$updateReplaceMode") {
				return $updateReplaceMode(pathJoin(parentPath, path), objectToArray(value));
			} else {
				// Merge our current data with the parent data
				return objectToArray(value).map((item) => updateToPipeline(item, currentGate, path));
			}
		}

		// The path is not an operation, the value is not recursive so
		// we have an implicit $replacePath
		return genericOperation("$replaceValue", pathJoin(parentPath, path), value, extendedType(value));
	})[0];
};

// Query gates
export const $and = gateOperation("$and", queryToPipeline);
export const $or = gateOperation("$or", queryToPipeline);

// Update gates
export const $updateSetMode = gateOperation("$updateSetMode", updateToPipeline);
export const $updateReplaceMode = gateOperation("$updateReplaceMode", updateToPipeline);

export const operationLookup: Record<string, any> = {
	// Query operations
	$and,
	$or,
	// Update operations
	$updateReplaceMode,
	$updateSetMode
};