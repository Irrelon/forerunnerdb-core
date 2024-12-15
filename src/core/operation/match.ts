import {get as pathGet} from "@irrelon/path";
import {GenericOperation} from "../../types/GenericOperation";
import {OperationFunction} from "../../types/OperationFunction";
import {OperationFunctionExtraInfo} from "../../types/OperationFunctionExtraInfo";

export const gates = ["$and", "$or", "$not", "$nor"];

export const matchPipeline = (pipeline: GenericOperation, data: any, extraInfo = {"originalQuery": {}}) => {
	const opFunc = operationLookup[pipeline.op];

	if (!opFunc) {
		throw new Error(`Unknown operation "${pipeline.op}"`);
	}

	return opFunc(data, pipeline.value, {"originalQuery": extraInfo.originalQuery, "operation": pipeline});
};

export const $and = (dataItem: object, opArr: GenericOperation[], extraInfo: OperationFunctionExtraInfo = {"originalQuery": {}}) => {
	// Match true on ALL operations to pass, if any are
	// returned then we have found a NON MATCHING entity
	return opArr.every((opData) => {
		let dataValue;
		let opValue;
		let opFunc;

		if (gates.indexOf(opData.op) > -1) {
			// The operation is a gate
			return operationLookup[opData.op](dataItem, opData.value, extraInfo);
		}

		dataValue = pathGet(dataItem, opData.path, undefined, {"arrayTraversal": true, "arrayExpansion": true});
		opFunc = operationLookup[opData.op];
		opValue = opData.value;

		if (!opFunc) {
			throw new Error(`Unknown operation "${opData.op}" in operation ${JSON.stringify(opData)}`);
		}

		return opFunc(dataValue, opValue, {"originalQuery": extraInfo.originalQuery, "operation": opData});
	});
};

export const $not = (data: any, query: any, extraInfo: OperationFunctionExtraInfo = {"originalQuery": {}}) => { // Not operator
	return !$and(data, query, extraInfo);
};

export const $or = (dataItem: any, opArr: GenericOperation[], extraInfo: OperationFunctionExtraInfo = {"originalQuery": {}}) => {
	// Match true on ANY operations to pass, if any are
	// returned then we have found a NON MATCHING entity
	return opArr.some((opData) => {
		let dataValue;
		let opValue;
		let opFunc;

		if (gates.indexOf(opData.op) > -1) {
			// The operation is a gate
			return operationLookup[opData.op](dataItem, opData.value, extraInfo);
		}

		dataValue = pathGet(dataItem, opData.path, undefined, {"arrayTraversal": true});
		opFunc = operationLookup[opData.op];
		opValue = opData.value;

		if (!opFunc) {
			throw new Error(`Unknown operation "${opData.op}"`);
		}

		return opFunc(dataValue, opValue, {"originalQuery": extraInfo.originalQuery, "operation": opData});
	});
};

const normalise = (data: any) => {
	if (data instanceof Date) {
		return data.toISOString();
	}

	return data;
};

export const $gt = (data: any, query: any, extraInfo: OperationFunctionExtraInfo = {}) => {
	// Greater than
	return normalise(data) > normalise(query);
};

export const $gte = (data: any, query: any, extraInfo: OperationFunctionExtraInfo = {}) => {
	// Greater than or equal
	return normalise(data) >= normalise(query);
};

export const $lt = (data: any, query: any, extraInfo: OperationFunctionExtraInfo = {}) => {
	// Less than
	return normalise(data) < normalise(query);
};

export const $lte = (data: any, query: any, extraInfo: OperationFunctionExtraInfo = {}) => {
	// Less than or equal
	return normalise(data) <= normalise(query);
};

export const $exists = (data: any, query: any, extraInfo: OperationFunctionExtraInfo = {}) => {
	// Property exists
	return (data === undefined) !== normalise(query);
};

export const $eq = (data: any, query: any, extraInfo: OperationFunctionExtraInfo = {}) => { // Equals
	// eslint-disable-next-line eqeqeq
	return normalise(data) == normalise(query); // jshint ignore:line
};

export const $eeq = (data: any, query: any, extraInfo: OperationFunctionExtraInfo = {}) => { // Equals equals
	return normalise(data) === normalise(query);
};

export const $ne = (data: any, query: any, extraInfo: OperationFunctionExtraInfo = {}) => { // Not equals
	// eslint-disable-next-line eqeqeq
	return normalise(data) != normalise(query); // eslint ignore:line
};
// Not equals equals
export const $nee: OperationFunction = (data, query, extraInfo: OperationFunctionExtraInfo = {}) => {
	return normalise(data) !== normalise(query);
};

export const $in = (data: any, query: any[], {originalQuery, operation}: OperationFunctionExtraInfo = {"originalQuery": undefined, "operation": undefined}) => {
	// Check that the in query is an array
	if (Array.isArray(query)) {
		let inArr = query,
			inArrCount = inArr.length,
			inArrIndex;

		for (inArrIndex = 0; inArrIndex < inArrCount; inArrIndex++) {
			if ($eeq(data, inArr[inArrIndex], {originalQuery, operation})) {
				return true;
			}
		}

		return false;
	}

	console.log(`Cannot use an $in operator on non-array data in query ${JSON.stringify(originalQuery)}`);
	return false;
};

export const $nin = (data: any, query: any[], {originalQuery, operation}: OperationFunctionExtraInfo = {"originalQuery": undefined, "operation": undefined}) => {
	// Check that the in query is an array
	if (Array.isArray(query)) {
		let inArr = query,
			inArrCount = inArr.length,
			inArrIndex;

		for (inArrIndex = 0; inArrIndex < inArrCount; inArrIndex++) {
			if ($eeq(data, inArr[inArrIndex], {originalQuery, operation})) {
				return false;
			}
		}

		return true;
	}

	console.log(`Cannot use an $in operator on non-array data in query ${JSON.stringify(originalQuery)}`);
	return false;
};

export const $fastIn = (data: any, query: any, {originalQuery, operation}: OperationFunctionExtraInfo = {"originalQuery": undefined, "operation": undefined}) => {
	if (query instanceof Array) {
		// Data is a string or number, use indexOf to identify match in array
		return query.indexOf(data) !== -1;
	}

	console.log(`Cannot use an $in operator on non-array data in query ${JSON.stringify(originalQuery)}`);
	return false;
};

export const $fastNin = (data: any, query: any, {originalQuery, operation}: OperationFunctionExtraInfo = {"originalQuery": undefined, "operation": undefined}) => {
	if (query instanceof Array) {
		// Data is a string or number, use indexOf to identify match in array
		return query.indexOf(data) === -1;
	}

	console.log(`Cannot use an $in operator on non-array data in query ${JSON.stringify(originalQuery)}`);
	return false;
};

// export const $distinct = (data: any, query: any) => {
// 	let lookupPath,
// 		value,
// 		finalDistinctProp;
//
// 	// Ensure options holds a distinct lookup
// 	options.$rootData["//distinctLookup"] = options.$rootData["//distinctLookup"] || {};
//
// 	for (const distinctProp in query) {
// 		if (query.hasOwnProperty(distinctProp)) {
// 			if (typeof query[distinctProp] === "object") {
// 				// Get the path string from the object
// 				lookupPath = this.sharedPathSolver.parse(query)[0].path;
//
// 				// Use the path string to find the lookup value from the data data
// 				value = this.sharedPathSolver.get(data, lookupPath);
// 				finalDistinctProp = lookupPath;
// 			} else {
// 				value = data[distinctProp];
// 				finalDistinctProp = distinctProp;
// 			}
//
// 			options.$rootData["//distinctLookup"][finalDistinctProp] = options.$rootData["//distinctLookup"][finalDistinctProp] || {};
//
// 			// Check if the options distinct lookup has this field's value
// 			if (options.$rootData["//distinctLookup"][finalDistinctProp][value]) {
// 				// Value is already in use
// 				return false;
// 			} else {
// 				// Set the value in the lookup
// 				options.$rootData["//distinctLookup"][finalDistinctProp][value] = true;
//
// 				// Allow the item in the results
// 				return true;
// 			}
// 		}
// 	}
// };
//
// export const $count = (data: any, query: any) => {
// 	let countKey,
// 		countArr,
// 		countVal;
//
// 	// Iterate the count object's keys
// 	for (countKey in query) {
// 		if (Object.hasOwnProperty.call(query, countKey)) {
// 			// Check the property exists and is an array. If the property being counted is not
// 			// an array (or doesn't exist) then use a value of zero in any further count logic
// 			countArr = data[countKey];
// 			if (typeof countArr === "object" && countArr instanceof Array) {
// 				countVal = countArr.length;
// 			} else {
// 				countVal = 0;
// 			}
//
// 			// Now recurse down the query chain further to satisfy the query for this key (countKey)
// 			if (!this._match(countVal, query[countKey], queryOptions, "and", options)) {
// 				return false;
// 			}
// 		}
// 	}
//
// 	// Allow the item in the results
// 	return true;
// };

export const operationLookup: Record<string, OperationFunction> = {
	$eq,
	$eeq,
	$ne,
	$nee,
	$gt,
	$gte,
	$lt,
	$lte,
	$and,
	$or,
	$in,
	$nin,
	$fastIn,
	$fastNin,
	$exists
};