import {
	get as pathGet,
	setImmutable as pathSetImmutable,
	unSetImmutable as pathUnSetImmutable,
	match as pathMatch
} from "@irrelon/path";

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

		if (!opFunc.selfControlled) {
			const currentValue = pathGet(dataItem, opData.path, undefined, {"arrayTraversal": true});
			const newData = opFunc(currentValue, opValue, {"originalQuery": extraInfo.originalQuery, "operation": opData});

			newDataItem = pathSetImmutable(newDataItem, opPath, newData);
		} else {
			newDataItem = opFunc(newDataItem, opPath, opValue, {"originalQuery": extraInfo.originalQuery, "operation": opData});
		}

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

export const $pull = (data, value, extraInfo = {}) => {
	let found = false;
	return data.reduce((newArr, item) => {
		if (!found && pathMatch(item, value)) {
			found = true;
		} else {
			newArr.push(item);
		}

		return newArr;
	}, []);
};

export const $pullAll = (data, value, extraInfo = {}) => {
	return data.reduce((newArr, item) => {
		if (!pathMatch(item, value)) {
			newArr.push(item);
		}

		return newArr;
	}, []);
};

export const $pop = (data, value, extraInfo = {}) => {
	return data.slice(0, data.length - 1);
};

export const $shift = (data, value, extraInfo = {}) => {
	const [, ...newArr] = data;
	return newArr;
};

export const $unset = (newDataItem, opPath, opValue, extraInfo = {}) => {
	return pathUnSetImmutable(newDataItem, opPath);
};

$unset.selfControlled = true;

export const operationLookup = {
	$replaceValue,
	$updateReplaceMode,
	$inc,
	$push,
	$pull,
	$pullAll,
	$pop,
	$shift,
	$unset
};

// TODO: Write
/*
$addToSet
$cast
$each
$inc - DONE
$move
$mul
$overwrite
$push - DONE
$pull - DONE
$pullAll - DONE
$pop - DONE
$shift - DONE
$rename
$replace
$splicePush
$splicePull
$toggle
$unset
Array Positional in Updates (.$)
 */