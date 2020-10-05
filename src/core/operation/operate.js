import {get as pathGet, setImmutable as pathSetImmutable} from "@irrelon/path";

export const operatePipeline = (pipeline, data, extraInfo = {"originalUpdate": {}}) => {
	const opFunc = operationLookup[pipeline.op];

	if (!opFunc) {
		throw new Error(`Unknown operation "${pipeline.op}"`);
	}

	return opFunc(data, pipeline.value, {"originalUpdate": extraInfo.originalUpdate, "operation": pipeline});
};

export const $updateReplaceMode = (dataItem, opArr, extraInfo = {"originalQuery": {}}) => {
	// Run through each operation and return a completely replaced
	// data item based on data from the original
	return opArr.reduce((newDataItem, opData) => {
		const opPath = opData.path;
		const opValue = opData.value;
		const opFunc = operationLookup[opData.op];
		const currentValue = pathGet(dataItem, opData.path, undefined, {"arrayTraversal": true});
		const newData = opFunc(currentValue, opValue, {"originalQuery": extraInfo.originalQuery, "operation": opData});
		
		newDataItem = pathSetImmutable(newDataItem, opPath, newData);

		if (!opFunc) {
			throw new Error(`Unknown operation "${opData.op}" in operation ${JSON.stringify(opData)}`);
		}

		return newDataItem;
	}, dataItem);
};

const normalise = (data) => {
	// No normalisation currently needed - change this as required later - ROB
	return data;
};

export const $inc = (data, value, extraInfo = {}) => {
	return normalise(data) + normalise(value);
};

export const $replaceValue = (data, value, extraInfo = {}) => {
	return value;
};

export const $push = (data, value, extraInfo = {}) => {
	return [...data, value];
};

export const operationLookup = {
	$replaceValue,
	$updateReplaceMode,
	$inc,
	$push
};