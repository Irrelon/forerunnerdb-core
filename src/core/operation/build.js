import {extendedType} from "../../utils/type";
import {gates} from "./match";
import {flattenValues, join as pathJoin} from "@irrelon/path";

export const queryFromObject = (obj) => {
	return flattenValues(obj, undefined, "", {
		"transformKey": (key, info) => info.isArrayIndex ? "$" : key,
		"leavesOnly": true
	});
};

/**
 * Generates a generic operation function and returns it.
 * @param {String} op The dollar op name e.g. "$eeq".
 * @returns {Object}
 */
export const genericOperation = (op = "", path, value, typeData) => {
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

export const objectToArray = (obj) => {
	return Object.entries(obj).map(([key, val]) => {
		return {
			[key]: val
		};
	});
};

export const reduceArray = (arr) => {
	if (!Array.isArray(arr)) return arr;
	return arr.reduce((finalArr, item) => {
		if (Array.isArray(item)) {
			return finalArr.concat(reduceArray(item));
		}

		finalArr.push(item);
		return finalArr;
	}, []);
};

export const gateOperation = (op, pipelineGenerator) => (path, value) => {
	const finalValue = (() => {
		return value.reduce((itemArr, item) => {
			if (!Array.isArray(item) && Object.keys(item).length > 1) {
				// The `value` is an object with multiple keys / paths
				// so split the object into an array of objects, each
				// object containing one of the key/val pairs of the
				// original `value` object
				return itemArr.concat(reduceArray(objectToArray(item).map((item) => pipelineGenerator(item, op, path))));
			}

			return itemArr.concat(reduceArray(pipelineGenerator(item, op, path)));
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

export const queryToPipeline = (query, currentGate = "", parentPath = "") => {
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

export const updateToPipeline = (query, currentGate = "", parentPath = "") => {
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

export const operationLookup = {
	// Query operations
	$and,
	$or,
	// Update operations
	$updateReplaceMode,
	$updateSetMode
};