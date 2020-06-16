/**
 * Creates an enum.
 * @param {Object|Array<String>} objOrArr An object or array of strings to
 * make an enum from.
 * @returns {*} A function that also has the enum keys assigned to it.
 */
export const createEnum = (objOrArr) => {
	const keysByValue = new Map();
	const EnumLookup = (value) => keysByValue.get(value);
	
	let obj = objOrArr;
	
	if (Array.isArray(objOrArr)) {
		obj = objOrArr.reduce((newObj, item, index) => {
			newObj[item] = index;
			return newObj;
		}, {});
	}
	
	for (const key of Object.keys(obj)) {
		EnumLookup[key] = obj[key];
		keysByValue.set(EnumLookup[key], key);
	}
	
	// Return a function with all your enum properties attached.
	// Calling the function with the value will return the key.
	return Object.freeze(EnumLookup);
};