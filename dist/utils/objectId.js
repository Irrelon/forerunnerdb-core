"use strict";

Object.defineProperty(exports, "__esModule", {
	"value": true
});
exports["default"] = void 0;
var idCounter = 0;
/**
 * Generates a new 16-character hexadecimal unique ID or
 * generates a new 16-character hexadecimal ID based on
 * the passed string. Will always generate the same ID
 * for the same string.
 * @param {String=} str A string to generate the ID from.
 * @return {String} A string ID.
 */

var objectId = function objectId (str) {
	var pow = Math.pow(10, 17);
	var id;

	if (!str) {
		idCounter++;
		id = (idCounter + (Math.random() * pow + Math.random() * pow + Math.random() * pow + Math.random() * pow)).toString(16);
	} else {
		var count = str.length;
		var val = 0;
		var i;

		for (i = 0; i < count; i++) {
			val += str.charCodeAt(i) * pow;
		}

		id = val.toString(16);
	}

	return id;
};

var _default = objectId;
exports["default"] = _default;