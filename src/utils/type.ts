import {ExtendedType} from "../types/ExtendedType";
import {TypeString} from "../types/TypeString";

/**
 * Returns the type from the item passed. Similar to JavaScript's
 * built-in typeof except it will distinguish between arrays, nulls
 * and objects as well.
 * @param {any} item The item to get the type of.
 * @returns {string} The type.
 */
export const type = (item: any): TypeString => {
	if (item === null) {
		return "null";
	}
	if (Array.isArray(item)) {
		return "array";
	}

	return typeof item;
};

/**
 * Returns extended information about the type from the item passed.
 * Similar to JavaScript's built-in typeof except it will distinguish
 * between arrays, nulls and objects as well.
 * @param {*} item The item to get the type of.
 * @returns {ExtendedType} The extended type information object.
 */
export const extendedType = (item: any): ExtendedType => {
	const typeData = {
		"isFlat": false,
		"instance": "",
		"type": "unknown"
	};

	if (item === null) {
		typeData.type = "null";
	} else if (Array.isArray(item)) {
		typeData.type = "array";
	} else {
		typeData.type = typeof item;

		if (typeData.type === "object") {
			typeData.instance = item.constructor.name;
		}
	}

	if (typeData.type === "string" || typeData.type === "number" || typeData.type === "null" || typeData.type === "boolean" || typeData.instance === "Date" || typeData.instance === "RegExp") {
		typeData.isFlat = true;
	}

	return typeData;
};