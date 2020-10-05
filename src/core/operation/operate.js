import {get as pathGet} from "@irrelon/path";

export const operatePipeline = (pipeline, data, extraInfo = {"originalUpdate": {}}) => {
	debugger;
	const opFunc = operationLookup[pipeline.op];

	if (!opFunc) {
		throw new Error(`Unknown operation "${pipeline.op}"`);
	}

	return opFunc(data, pipeline.value, {"originalUpdate": extraInfo.originalUpdate, "operation": pipeline});
};

export const $replace = (dataItem, opArr, extraInfo = {"originalQuery": {}}) => {
	// Run through each operation and return a completely replaced
	// data item based on data from the original
	return opArr.forEach((opData) => {
		let dataValue;
		let opValue;
		let opFunc;
debugger;
		dataValue = pathGet(dataItem, opData.path, undefined, {"arrayTraversal": true});
		opFunc = operationLookup[opData.op];
		opValue = opData.value;

		// TODO:
		//   Loop over each opValue and get the data so we can call $inc
		//   as a pure function where the first param is the current data
		//   and the second param is the new data. Then we take the result
		//   and apply it back to the dataItem at this level. That way
		//   the operation function (like $inc) doesn't need to know anything
		//   about the structure of the dataItem etc, just pure maths.
		//   Only question is will this work for other operations? How about
		//   pushVal()? They need access to the array to push into. Investigate
		//   further by getting at least pushVal() and inc() to work with the
		//   same interface.

		if (!opFunc) {
			throw new Error(`Unknown operation "${opData.op}" in operation ${JSON.stringify(opData)}`);
		}

		return opFunc(dataValue, opValue, {"originalQuery": extraInfo.originalQuery, "operation": opData});
	});
};

const normalise = (data) => {
	// No normalisation currently needed - change this as required later - ROB
	return data;
};

export const $inc = (data, query, extraInfo = {}) => {
	// Increment
	debugger;
	return normalise(data) + normalise(query);
};

export const operationLookup = {
	$replace,
	$inc
};